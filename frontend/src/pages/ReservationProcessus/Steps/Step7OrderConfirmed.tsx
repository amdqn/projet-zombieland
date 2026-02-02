import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { colors } from "../../../theme";
import { InformationCard } from "../../../components/cards";
import EmailIcon from '@mui/icons-material/Email';
import { useReservationStore } from "../../../stores/reservationStore";
import { getPrices } from "../../../services/prices";
import type { Price } from "../../../@types/price";
import {useReservations} from "../../../hooks/useUserReservation.ts";
import { useTranslation } from 'react-i18next';
import { formatPriceName } from '../../../utils/translatePrice';

export const Step7OrderConfirmed = () => {
  const { t, i18n } = useTranslation();
  const { tickets, total, date, createdReservations, customerInfo } = useReservationStore();
  const [prices, setPrices] = useState<Price[]>([]);

  // Utilisation d'un hook personnalisé
  const { reservationNumbers, setReservationNumbers, fetchReservations } = useReservations();

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
  }, [i18n.language]);

  useEffect(() => {
    if (createdReservations && createdReservations.length > 0) {
      setReservationNumbers(createdReservations.map(r => r.reservation_number));
    }
  }, [createdReservations, setReservationNumbers]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const mainReservationNumber = useMemo(
    () => (reservationNumbers.length > 0 ? reservationNumbers[0] : null),
    [reservationNumbers]
  );

  // Fonction pour formater la date
  const formatDateShort = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const months = [
      t('reservation.step7.months.jan'), t('reservation.step7.months.feb'), t('reservation.step7.months.mar'),
      t('reservation.step7.months.apr'), t('reservation.step7.months.may'), t('reservation.step7.months.jun'),
      t('reservation.step7.months.jul'), t('reservation.step7.months.aug'), t('reservation.step7.months.sep'),
      t('reservation.step7.months.oct'), t('reservation.step7.months.nov'), t('reservation.step7.months.dec')
    ];
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
          {t('reservation.step7.title')}</Typography>
        <Typography
          variant="body1"
          sx={{
            color: colors.white,
            fontSize: { xs: '0.9rem', md: '1rem' },
          }}
        >
          {t('reservation.step7.subtitle')}</Typography>
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
                    {t('reservation.step7.orderNumber')}
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
                      {t('reservation.step7.orderNumberNotAvailable')}
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
                      {formatPriceName(price.type, price.duration_days, t)}
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
                      {t('reservation.step7.quantityLabel', { quantity: item.quantity })}
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
              Un email avec vos billets a été envoyé {customerInfo?.email ? `à ${customerInfo.email}` : 'à votre adresse'}
            </Typography>
          </Box>
        </Box>
      </InformationCard>
    </Box>
    </Box>
  );
};