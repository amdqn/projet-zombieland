import { useState, useEffect } from 'react';
import { Box, Typography, Stack, IconButton, Button, Radio } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { InformationCard } from '../../../components/cards';
import { colors } from '../../../theme/theme';
import { useReservationStore } from '../../../stores/reservationStore';
import { getPrices } from '../../../services/prices';
import type { Price } from '../../../@types/price';

interface Step1SelectTicketProps {
  onViewChange?: (view: 'list' | 'quantity') => void;
}

export const Step1SelectTicket = ({ onViewChange }: Step1SelectTicketProps) => {
  const { tickets, setTickets } = useReservationStore();
  const [prices, setPrices] = useState<Price[]>([]);
  const priceMap = new Map(prices.map((p) => [p.id, p]));
  
  // Initialiser selectedTickets depuis le store
  const [selectedTickets, setSelectedTickets] = useState<Map<number, number>>(
    new Map(tickets.map(t => [t.ticketId, t.quantity]))
  );
  const [currentView, setCurrentView] = useState<'list' | 'quantity'>('list');
  const [selectedTicket, setSelectedTicket] = useState<Price | null>(null);
  const [tempQuantity, setTempQuantity] = useState<number>(0);

  useEffect(() => {
    const fetchPrices = async () => {
      const prices = await getPrices();
      setPrices(prices);
    };
    fetchPrices();
  }, []);

  // Synchroniser selectedTickets avec le store quand tickets change
  useEffect(() => {
    setSelectedTickets(new Map(tickets.map(t => [t.ticketId, t.quantity])));
  }, [tickets]);

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
      const price = priceMap.get(id);
      return sum + (price ? price.amount * qty : 0);
    }, 0);

    // Sauvegarder dans le store
    const ticketsArray = Array.from(newSelections.entries()).map(([ticketId, quantity]) => ({
      ticketId,
      quantity,
    }));
    setTickets(ticketsArray, total);
  };

  const handleTicketSelect = (ticketId: number) => {
    // Navigation automatique vers le sélecteur de quantité
    const price = priceMap.get(ticketId);
    if (price) {
      setSelectedTicket(price);
      setTempQuantity(selectedTickets.get(price.id) || 0);
      setCurrentView('quantity');
      if (onViewChange) onViewChange('quantity');
    }
  };

  const handleBackToList = () => {
    // Retour sans sauvegarder
    setCurrentView('list');
    setSelectedTicket(null);
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
    const price = priceMap.get(ticketId);
    if (price) {
      setSelectedTicket(price);
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
          {prices
            .map((price) => {
              const hasQuantity = selectedTickets.has(price.id);
              const quantity = selectedTickets.get(price.id) || 0;

              return (
                <Box key={price.id}>
                  <Box
                    onClick={() => handleTicketSelect(price.id)}
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
                      {price.type} - {price.duration_days} jour{price.duration_days > 1 ? 's' : ''}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.secondaryGrey,
                          fontSize: { xs: '0.85rem', md: '0.95rem' },
                          mb: 2,
                        }}
                      >
                        {price.label}
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
                        {price.amount.toFixed(2)} €
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
                          handleEditTicket(price.id);
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
                          handleDeleteTicket(price.id);
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

    const totalPrice = selectedTicket.amount * tempQuantity;

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

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            maxWidth: '600px',
            mx: 'auto',
            mb: { xs: 20, md: 16 },
          }}
        >
          {/* Sélecteur de quantité */}
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

          {/* Card récapitulative  */}
          {tempQuantity > 0 && (
            <Box sx={{ width: '100%' }}>
              <InformationCard
                borderColor="red"
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
                      {selectedTicket.amount.toFixed(2)} €
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
                        color: colors.white,
                      }}
                    >
                      Quantité × {tempQuantity}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Lexend Deca', sans-serif",
                        fontSize: { xs: '0.85rem', md: '0.95rem' },
                        color: colors.white,
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
                        color: colors.primaryGreen,
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
              </InformationCard>
            </Box>
          )}

          {/* Boutons */}
          <Box
            sx={{
              position: 'sticky',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              gap: 2,
              mt: 4,
              padding: { xs: 2, md: 3 },
              backgroundColor: colors.secondaryDark,
              borderTop: `1px solid ${colors.secondaryGrey}`,
              zIndex: 1000,
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