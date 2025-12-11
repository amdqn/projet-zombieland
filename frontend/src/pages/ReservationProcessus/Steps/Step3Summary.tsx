import { useState, useEffect, useMemo } from "react";
import { Box, Typography, Checkbox, Link } from "@mui/material";
import WarningIcon from '@mui/icons-material/Warning';
import { colors } from "../../../theme";
import { InformationCard } from "../../../components/cards";
import { useReservationStore } from "../../../stores/reservationStore";
import { getPrices } from "../../../services/prices";
import type { Price } from "../../../@types/price";

export const Step3Summary = () => {
  const { tickets, total, date, acceptedTerms, setAcceptedTerms } = useReservationStore();
  const [localAcceptedTerms, setLocalAcceptedTerms] = useState(acceptedTerms);
  const [prices, setPrices] = useState<Price[]>([]);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [isLoadingPrices, setIsLoadingPrices] = useState<boolean>(false);

  // Synchroniser avec le store
  useEffect(() => {
    setLocalAcceptedTerms(acceptedTerms);
  }, [acceptedTerms]);

  // Récupérer les tarifs pour afficher les détails des billets sélectionnés
  useEffect(() => {
    const fetchPrices = async () => {
      setIsLoadingPrices(true);
      setPriceError(null);
      try {
        const apiPrices = await getPrices();
        setPrices(apiPrices);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Impossible de récupérer les tarifs.";
        setPriceError(message);
      } finally {
        setIsLoadingPrices(false);
      }
    };

    fetchPrices();
  }, []);

  const priceMap = useMemo(() => new Map(prices.map((p) => [p.id, p])), [prices]);

  const handleAcceptedTermsChange = (value: boolean) => {
    setLocalAcceptedTerms(value);
    setAcceptedTerms(value);
  };

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
      const ticket = priceMap.get(ticketSelection.ticketId);
      if (!ticket) {
        console.warn(`Tarif introuvable pour l'id ${ticketSelection.ticketId}`);
        return null;
      }
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
          RÉCAPITULATIF
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: colors.white,
            fontSize: { xs: '0.9rem', md: '1rem' },
          }}
        >
          Vérifiez votre commande avant de continuer
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
        {/* Card 1: Récapitulatif de commande */}
        <InformationCard borderColor="red">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Affichage de tous les billets sélectionnés */}
            {isLoadingPrices ? (
              <Typography
                sx={{
                  fontFamily: "'Lexend Deca', sans-serif",
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  color: colors.secondaryGrey,
                  textAlign: 'center',
                }}
              >
                Chargement des billets...
              </Typography>
            ) : priceError ? (
              <Typography
                sx={{
                  fontFamily: "'Lexend Deca', sans-serif",
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  color: colors.primaryRed,
                  textAlign: 'center',
                }}
              >
                {priceError}
              </Typography>
            ) : selectedTicketsWithDetails.length > 0 ? (
              selectedTicketsWithDetails.map((item, index) => {
                const ticket = item.ticket;
              
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
                      Type de billet
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Lexend Deca', sans-serif",
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        color: colors.white,
                      }}
                    >
                      {ticket.type} - {ticket.duration_days} jour{ticket.duration_days > 1 ? 's' : ''}
                    </Typography>
                  </Box>

                  {/* Nombre de billets */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography
                      sx={{
                        fontFamily: "'Lexend Deca', sans-serif",
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        color: colors.white,
                      }}
                    >
                      Nombre de billets
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Lexend Deca', sans-serif",
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        color: colors.white,
                      }}
                    >
                      {item.quantity}
                    </Typography>
                  </Box>

                  {/* Prix unitaire */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography
                      sx={{
                        fontFamily: "'Lexend Deca', sans-serif",
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        color: colors.white,
                      }}
                    >
                      Prix unitaire
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Lexend Deca', sans-serif",
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        color: colors.white,
                      }}
                    >
                      {ticket.amount.toFixed(2).replace('.', ',')} €
                    </Typography>
                  </Box>

                  {/* Séparateur entre les billets (sauf le dernier) */}
                  {index < selectedTicketsWithDetails.length - 1 && (
                    <Box
                      sx={{
                        borderTop: `1px solid rgba(255, 255, 255, 0.2)`,
                        my: 2,
                      }}
                    />
                  )}
                </Box>
              );
            })
            ) : (
              <Typography
                sx={{
                  fontFamily: "'Lexend Deca', sans-serif",
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  color: colors.white,
                  textAlign: 'center',
                }}
              >
                Aucun billet sélectionné
              </Typography>
            )}

            {/* Date de visite */}
            {date && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

            {/* TOTAL */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                {total.toFixed(2).replace('.', ',')} €
              </Typography>
            </Box>
          </Box>
        </InformationCard>

        {/* Card 2: Conditions générales */}
        <InformationCard borderColor="green">
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Checkbox
              checked={localAcceptedTerms}
              onChange={(e) => handleAcceptedTermsChange(e.target.checked)}
              sx={{
                color: colors.primaryGreen,
                '&.Mui-checked': {
                  color: colors.primaryGreen,
                },
                padding: 0,
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontFamily: "'Lexend Deca', sans-serif",
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  color: colors.white,
                  mb: 1,
                }}
              >
                J'accepte les Conditions Générales de Vente
              </Typography>
              <Link
                href="/static/conditions-vente"
                sx={{
                  fontFamily: "'Lexend Deca', sans-serif",
                  fontSize: { xs: '0.85rem', md: '0.9rem' },
                  color: colors.primaryGreen,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                Lire les CGV complètes
              </Link>
            </Box>
          </Box>
        </InformationCard>

        {/* Card 3: Politique d'annulation */}
        <InformationCard borderColor="green">
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <WarningIcon
              sx={{
                color: colors.warning,
                fontSize: '2rem',
                flexShrink: 0,
              }}
            />
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Lexend Deca', sans-serif",
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 700,
                  color: colors.warning,
                  textTransform: 'uppercase',
                  mb: 1,
                }}
              >
                ANNULATION GRATUITE
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Lexend Deca', sans-serif",
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  color: colors.white,
                }}
              >
                Vous pouvez annuler jusqu'à 10 jours avant la date de visite
              </Typography>
            </Box>
          </Box>
        </InformationCard>
      </Box>
    </Box>
  );
};