import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { colors } from "../../../theme";
import { InformationCard } from "../../../components/cards";
import EmailIcon from '@mui/icons-material/Email';
import { useReservationStore } from "../../../stores/reservationStore";
import { getMyReservations } from "../../../services/reservations";
import { getPrices } from "../../../services/prices";
import type { Price } from "../../../@types/price";

export const Step7OrderConfirmed = () => {
  const { tickets, total, date, createdReservations } = useReservationStore();
  const [reservationNumbers, setReservationNumbers] = useState<string[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);

  // Charger les prices pour afficher les détails
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const pricesData = await getPrices();
        setPrices(pricesData);
      } catch (error) {
        console.error("Impossible de récupérer les prices:", error);
      }
    };
    fetchPrices();
  }, []);

  useEffect(() => {
    if (createdReservations && createdReservations.length > 0) {
      setReservationNumbers(createdReservations.map(r => r.reservation_number));
    }
  }, [createdReservations]);

  useEffect(() => {
    const fetchReservations = async () => {
      if (reservationNumbers.length > 0) return;
      try {
        const myReservations = await getMyReservations();
        const numbers = myReservations
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .map(r => r.reservation_number);
        setReservationNumbers(numbers);
      } catch (error) {
        console.error("Impossible de récupérer vos réservations:", error);
      }
    };
    fetchReservations();
  }, [reservationNumbers.length]);

  const mainReservationNumber = useMemo(
    () => (reservationNumbers.length > 0 ? reservationNumbers[0] : null),
    [reservationNumbers]
  );

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

  // Récupérer tous les billets sélectionnés avec leurs informations depuis les prices
  const selectedTicketsWithDetails = useMemo(() => {
    return tickets
      .map(ticketSelection => {
        const price = prices.find(p => p.id === ticketSelection.ticketId);
        if (!price) return null;
        return {
          ...ticketSelection,
          price,
        };
      })
      .filter((item): item is { ticketId: number; quantity: number; price: Price } => item !== null);
  }, [tickets, prices]);

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
                {mainReservationNumber ? (
                  <Typography
                      sx={{
                        fontFamily: "'Lexend Deca', sans-serif",
                        fontSize: { xs: '1.5rem', md: '1.8rem' },
                        fontWeight: 700,
                        color: colors.white,
                      }}
                  >
                      {mainReservationNumber}
                  </Typography>
                ) : (
                  <Typography
                      sx={{
                        fontFamily: "'Lexend Deca', sans-serif",
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        color: colors.secondaryGrey,
                      }}
                  >
                      Numéro non disponible
                  </Typography>
                )}
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
              const price = item.price;
              const subtotal = price.amount * item.quantity;

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
                      {price.type} - {price.duration_days} jour{price.duration_days > 1 ? 's' : ''}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Lexend Deca', sans-serif",
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        color: colors.white,
                      }}
                    >
                      {price.amount.toFixed(2).replace('.', ',')} €
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