import { useState } from 'react';
import { Box, Typography, Stack, IconButton, Button, Radio } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ticketsMock, type Ticket } from '../../../mocks';
import { colors } from '../../../theme/theme';

interface TicketSelection {
  ticketId: number;
  quantity: number;
}

interface Step1SelectTicketProps {
  onDataChange?: (data: { tickets: TicketSelection[]; total: number }) => void;
  onViewChange?: (view: 'list' | 'quantity') => void;
}

export const Step1SelectTicket = ({ onDataChange, onViewChange }: Step1SelectTicketProps) => {
  const [selectedTickets, setSelectedTickets] = useState<Map<number, number>>(
    new Map()
  );
  const [currentView, setCurrentView] = useState<'list' | 'quantity'>('list');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [tempQuantity, setTempQuantity] = useState<number>(0);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  const handleQuantityChange = (ticketId: number, quantity: number) => {
    const newSelections = new Map(selectedTickets);

    if (quantity === 0) {
      newSelections.delete(ticketId);
    } else {
      newSelections.set(ticketId, quantity);
    }

    setSelectedTickets(newSelections);

    // Calculer le total
    const total = Array.from(newSelections.entries()).reduce((sum, [id, qty]) => {
      const ticket = ticketsMock.find(t => t.id === id);
      return sum + (ticket ? ticket.price * qty : 0);
    }, 0);

    // Envoyer les données au parent
    if (onDataChange) {
      const tickets = Array.from(newSelections.entries()).map(([ticketId, quantity]) => ({
        ticketId,
        quantity,
      }));
      onDataChange({ tickets, total });
    }
  };

  const calculateTotal = () => {
    return Array.from(selectedTickets.entries()).reduce((sum, [id, qty]) => {
      const ticket = ticketsMock.find(t => t.id === id);
      return sum + (ticket ? ticket.price * qty : 0);
    }, 0);
  };

  const getTotalTickets = () => {
    return Array.from(selectedTickets.values()).reduce((sum, qty) => sum + qty, 0);
  };

  const handleTicketSelect = (ticketId: number) => {
    setSelectedTicketId(ticketId);

    // Navigation automatique vers le sélecteur de quantité
    const ticket = ticketsMock.find((t) => t.id === ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
      setTempQuantity(selectedTickets.get(ticket.id) || 0);
      setCurrentView('quantity');
      if (onViewChange) onViewChange('quantity');
    }
  };

  const handleBackToList = () => {
    // Retour sans sauvegarder
    setCurrentView('list');
    setSelectedTicket(null);
    setSelectedTicketId(null);
    setTempQuantity(0);
    if (onViewChange) onViewChange('list');
  };

  const handleValidateQuantity = () => {
    if (selectedTicket) {
      // Enregistrer la quantité
      handleQuantityChange(selectedTicket.id, tempQuantity);
    }
    // Retourner à la liste
    setCurrentView('list');
    setSelectedTicket(null);
    setTempQuantity(0);
    if (onViewChange) onViewChange('list');
  };

  const handleEditTicket = (ticketId: number) => {
    const ticket = ticketsMock.find((t) => t.id === ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
      setSelectedTicketId(ticketId);
      setTempQuantity(selectedTickets.get(ticketId) || 0);
      setCurrentView('quantity');
      if (onViewChange) onViewChange('quantity');
    }
  };

  const handleDeleteTicket = (ticketId: number) => {
    handleQuantityChange(ticketId, 0);
  };

  // Vue liste des tickets
  const renderTicketList = () => (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            fontFamily: "'Creepster', cursive",
            color: colors.primaryRed,
          }}
        >
          QUEL TYPE DE BILLET ?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: colors.white,
            fontSize: { xs: '0.9rem', md: '1rem' },
          }}
        >
          Choisissez votre type d'entrée
        </Typography>
      </Box>

      {/* Liste des billets avec radio buttons */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          mb: 4,
        }}
      >
        <Stack spacing={3} sx={{ width: '100%', maxWidth: '600px' }}>
          {ticketsMock
            .filter((ticket) => ticket.available)
            .map((ticket) => {
              const hasQuantity = selectedTickets.has(ticket.id);
              const quantity = selectedTickets.get(ticket.id) || 0;

              return (
                <Box key={ticket.id}>
                  <Box
                    onClick={() => handleTicketSelect(ticket.id)}
                    sx={{
                      backgroundColor: colors.secondaryDarkAlt,
                      border: hasQuantity
                        ? `2px solid ${colors.primaryGreen}`
                        : `1px solid ${colors.secondaryGrey}`,
                      borderRadius: '8px',
                      padding: 3,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      '&:hover': {
                        borderColor: colors.primaryGreen,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    {/* Radio button */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                      }}
                    >
                      <Radio
                        checked={hasQuantity}
                        sx={{
                          color: colors.secondaryGrey,
                          '&.Mui-checked': {
                            color: colors.primaryGreen,
                          },
                        }}
                      />
                    </Box>

                    {/* Contenu de la card */}
                    <Box sx={{ pr: 5 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontFamily: "'Lexend Deca', sans-serif",
                          fontSize: { xs: '1rem', md: '1.2rem' },
                          fontWeight: 700,
                          color: colors.white,
                          textTransform: 'uppercase',
                          mb: 1,
                        }}
                      >
                        {ticket.type}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.secondaryGrey,
                          fontSize: { xs: '0.85rem', md: '0.95rem' },
                          mb: 2,
                        }}
                      >
                        {ticket.description}
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          fontFamily: "'Lexend Deca', sans-serif",
                          fontSize: { xs: '1.5rem', md: '1.8rem' },
                          fontWeight: 700,
                          color: colors.primaryGreen,
                        }}
                      >
                        {ticket.price.toFixed(2)} €
                      </Typography>
                    </Box>
                  </Box>

                  {/* Affichage de la quantité sélectionnée avec icônes */}
                  {hasQuantity && (
                    <Box
                      sx={{
                        mt: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.primaryGreen,
                          fontWeight: 600,
                          fontSize: '0.9rem',
                        }}
                      >
                        Quantité sélectionnée : {quantity}
                      </Typography>

                      {/* Icône Edit */}
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTicket(ticket.id);
                        }}
                        sx={{
                          color: colors.white,
                          padding: '4px',
                          '&:hover': {
                            backgroundColor: colors.primaryGreen,
                            color: colors.secondaryDark,
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>

                      {/* Icône Delete */}
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTicket(ticket.id);
                        }}
                        sx={{
                          color: colors.primaryRed,
                          padding: '4px',
                          '&:hover': {
                            backgroundColor: colors.primaryRed,
                            color: colors.white,
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              );
            })}
        </Stack>
      </Box>
    </Box>
  );

  // Vue sélection de quantité
  const renderQuantitySelector = () => {
    if (!selectedTicket) return null;

    const totalPrice = selectedTicket.price * tempQuantity;

    return (
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontFamily: "'Creepster', cursive",
              color: colors.primaryRed,
            }}
          >
            COMBIEN DE BILLETS ?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: colors.secondaryGrey,
              fontSize: { xs: '0.9rem', md: '1rem' },
            }}
          >
            Sélectionnez le nombre de personnes
          </Typography>
        </Box>

        {/* Contenu centré */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          {/* Sélecteur de quantité custom */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <IconButton
              onClick={() => tempQuantity > 0 && setTempQuantity(tempQuantity - 1)}
              disabled={tempQuantity <= 0}
              sx={{
                border: `2px solid ${colors.primaryGreen}`,
                backgroundColor: 'transparent',
                color: colors.primaryGreen,
                width: 56,
                height: 56,
                borderRadius: '50%',
                '&:hover': {
                  backgroundColor: colors.primaryGreen,
                  color: colors.secondaryDark,
                },
                '&.Mui-disabled': {
                  borderColor: colors.secondaryGrey,
                  color: colors.secondaryGrey,
                  opacity: 0.3,
                },
              }}
            >
              <RemoveIcon sx={{ fontSize: '2rem' }} />
            </IconButton>

            <Typography
              sx={{
                fontFamily: "'Creepster', cursive",
                fontSize: { xs: '3rem', md: '4rem' },
                fontWeight: 400,
                color: colors.white,
                minWidth: '80px',
                textAlign: 'center',
              }}
            >
              {tempQuantity}
            </Typography>

            <IconButton
              onClick={() => tempQuantity < 20 && setTempQuantity(tempQuantity + 1)}
              disabled={tempQuantity >= 20}
              sx={{
                border: `2px solid ${colors.primaryGreen}`,
                backgroundColor: 'transparent',
                color: colors.primaryGreen,
                width: 56,
                height: 56,
                borderRadius: '50%',
                '&:hover': {
                  backgroundColor: colors.primaryGreen,
                  color: colors.secondaryDark,
                },
                '&.Mui-disabled': {
                  borderColor: colors.secondaryGrey,
                  color: colors.secondaryGrey,
                  opacity: 0.3,
                },
              }}
            >
              <AddIcon sx={{ fontSize: '2rem' }} />
            </IconButton>
          </Box>

          {/* Card récapitulative avec bordure rouge */}
          {tempQuantity > 0 && (
            <Box
              sx={{
                width: '100%',
                backgroundColor: colors.secondaryDarkAlt,
                border: `2px solid ${colors.primaryRed}`,
                borderRadius: '8px',
                padding: 3,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {/* Ligne titre du billet */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Lexend Deca', sans-serif",
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      color: colors.white,
                    }}
                  >
                    {selectedTicket.type}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Lexend Deca', sans-serif",
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      color: colors.white,
                    }}
                  >
                    {selectedTicket.price.toFixed(2)} €
                  </Typography>
                </Box>

                {/* Ligne quantité */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: 2,
                    borderBottom: `1px solid ${colors.primaryGreen}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Lexend Deca', sans-serif",
                      fontSize: { xs: '0.85rem', md: '0.95rem' },
                      color: colors.secondaryGrey,
                    }}
                  >
                    Quantité × {tempQuantity}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Lexend Deca', sans-serif",
                      fontSize: { xs: '0.85rem', md: '0.95rem' },
                      color: colors.secondaryGrey,
                    }}
                  >
                    {totalPrice.toFixed(2)} €
                  </Typography>
                </Box>

                {/* Ligne total */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Lexend Deca', sans-serif",
                      fontSize: { xs: '1.1rem', md: '1.3rem' },
                      fontWeight: 700,
                      color: colors.white,
                      textTransform: 'uppercase',
                    }}
                  >
                    TOTAL
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Lexend Deca', sans-serif",
                      fontSize: { xs: '1.3rem', md: '1.5rem' },
                      fontWeight: 700,
                      color: colors.primaryGreen,
                    }}
                  >
                    {totalPrice.toFixed(2)} €
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Conditions */}
          {selectedTicket.conditions && tempQuantity > 0 && (
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: colors.warning,
                fontSize: '0.85rem',
                fontStyle: 'italic',
                textAlign: 'center',
              }}
            >
              ⚠️ {selectedTicket.conditions}
            </Typography>
          )}

          {/* Boutons */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              gap: 2,
              mt: 4,
            }}
          >
            <Button
              variant="outlined"
              size="large"
              onClick={handleBackToList}
              sx={{
                backgroundColor: colors.secondaryDark,
                border: `1px solid ${colors.secondaryGrey}`,
                color: colors.white,
                fontSize: '1rem',
                padding: '0.75rem 2rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                fontFamily: "'Lexend Deca', sans-serif",
                borderRadius: '8px',
                flex: { xs: 'none', md: 1 },
                width: { xs: '100%', md: 'auto' },
                '&:hover': {
                  backgroundColor: colors.secondaryGrey,
                  borderColor: colors.secondaryGrey,
                },
              }}
            >
              ← RETOUR
            </Button>

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleValidateQuantity}
              disabled={tempQuantity === 0}
              sx={{
                fontSize: '1rem',
                padding: '0.75rem 2rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                fontFamily: "'Lexend Deca', sans-serif",
                borderRadius: '8px',
                flex: { xs: 'none', md: 1 },
                width: { xs: '100%', md: 'auto' },
              }}
            >
              CONTINUER →
            </Button>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      {currentView === 'list' ? renderTicketList() : renderQuantitySelector()}
    </Box>
  );
};