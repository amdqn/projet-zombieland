import { Box, Typography } from "@mui/material";
import { colors } from "../../../theme";
import { InformationCard } from "../../../components/cards";
import EmailIcon from '@mui/icons-material/Email';
import { ticketsMock } from "../../../mocks";

interface Step7OrderConfirmedProps {
  tickets: Array<{ ticketId: number; quantity: number }>;
  total: number;
  date?: string;
}

export const Step7OrderConfirmed = ({ tickets, total, date }: Step7OrderConfirmedProps) => {
  // Générer un numéro de réservation aléatoire
  const reservationNumber = `ZL${Date.now().toString().slice(-8)}`;

  // Fonction pour formater la date
  const formatDateShort = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${monthName} ${year}`;
  };

  // Récupérer tous les billets sélectionnés avec leurs informations
  const selectedTicketsWithDetails = tickets
    .map(ticketSelection => {
      const ticket = ticketsMock.find(t => t.id === ticketSelection.ticketId);
      if (!ticket) return null;
      return {
        ...ticketSelection,
        ticket,
      };
    })
    .filter((item): item is { ticketId: number; quantity: number; ticket: typeof ticketsMock[0] } => item !== null);

  return (
    <Box>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            fontFamily: "'Creepster', cursive",
            color: colors.primaryRed,
          }}
        >
          RÉSERVATION CONFIRMÉE</Typography>
        <Typography
          variant="body1"
          sx={{
            color: colors.white,
            fontSize: { xs: '0.9rem', md: '1rem' },
          }}
        >
          Votre paiement a été effectué avec succès</Typography>
    </Box>

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
        {/* Card : Numéro de commande */}
        <InformationCard borderColor="red">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Typography
                    sx={{
                      fontFamily: "'Lexend Deca', sans-serif",
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      fontWeight: 700,
                      color: colors.primaryRed,
                      textTransform: 'uppercase',
                    }}
                >
                    Numéro de commande
                </Typography>
                <Typography
                    sx={{
                      fontFamily: "'Lexend Deca', sans-serif",
                      fontSize: { xs: '1.5rem', md: '1.8rem' },
                      fontWeight: 700,
                      color: colors.white,
                    }}
                >
                    {reservationNumber}
                </Typography>
            </Box>
        </InformationCard>

        {/* Card récapitulative des billets */}
        <InformationCard borderColor="red">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {/* Affichage de tous les billets sélectionnés */}
            {selectedTicketsWithDetails.length > 0 && selectedTicketsWithDetails.map((item, index) => {
              const ticket = item.ticket;
              const subtotal = ticket.price * item.quantity;

              return (
                <Box key={item.ticketId}>
                  {/* Type de billet */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography
                      sx={{
                        fontFamily: "'Lexend Deca', sans-serif",
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        color: colors.white,
                      }}
                    >
                      {ticket.type}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Lexend Deca', sans-serif",
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        color: colors.white,
                      }}
                    >
                      {ticket.price.toFixed(2).replace('.', ',')} €
                    </Typography>
                  </Box>

                  {/* Nombre de billets */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      pb: 2,
                      borderBottom: index < selectedTicketsWithDetails.length - 1 ? `1px solid rgba(255, 255, 255, 0.2)` : `2px solid ${colors.primaryGreen}`,
                      mb: index < selectedTicketsWithDetails.length - 1 ? 2 : 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "'Lexend Deca', sans-serif",
                        fontSize: { xs: '0.85rem', md: '0.95rem' },
                        color: colors.white,
                      }}
                    >
                      Quantité × {item.quantity}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Lexend Deca', sans-serif",
                        fontSize: { xs: '0.85rem', md: '0.95rem' },
                        color: colors.white,
                      }}
                    >
                      {subtotal.toFixed(2).replace('.', ',')} €
                    </Typography>
                  </Box>
                </Box>
              );
            })}

            {/* Date de visite */}
            {date && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 1,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Lexend Deca', sans-serif",
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    color: colors.white,
                  }}
                >
                  Date de visite
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Lexend Deca', sans-serif",
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    color: colors.white,
                  }}
                >
                  {formatDateShort(date)}
                </Typography>
              </Box>
            )}

            {/* Séparateur */}
            <Box
              sx={{
                borderTop: `2px solid ${colors.primaryGreen}`,
                my: 1,
              }}
            />

            {/* Ligne total payé */}
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
                MONTANT PAYÉ
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Lexend Deca', sans-serif",
                  fontSize: { xs: '1.3rem', md: '1.5rem' },
                  fontWeight: 700,
                  color: colors.primaryGreen,
                }}
              >
                {total.toFixed(2).replace('.', ',')} €
              </Typography>
            </Box>
          </Box>
        </InformationCard>

          {/* Card : Confirmation par email */}
      <InformationCard borderColor="green">
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <EmailIcon
            sx={{
              color: colors.white,
              fontSize: "2rem",
              flexShrink: 0,
            }}
          />
          <Box>
            <Typography
              sx={{
                fontFamily: "'Lexend Deca', sans-serif",
                fontSize: { xs: "1rem", md: "1.1rem" },
                fontWeight: 700,
                color: colors.primaryGreen,
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              CONFIRMATION ENVOYÉE
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Lexend Deca', sans-serif",
                fontSize: { xs: "0.9rem", md: "1rem" },
                color: colors.white,
              }}
            >
              Un email avec vos billets a été envoyé à votre adresse
            </Typography>
          </Box>
        </Box>
      </InformationCard>
    </Box>
    </Box>
  );
};