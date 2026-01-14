import { Box, Modal, Typography, Divider, Chip, Stack } from '@mui/material';
import { colors } from '../../../theme';
import type { Reservation, ReservationStatus } from '../../../@types/reservation';

interface ReservationDetailsModalProps {
  open: boolean;
  onClose: () => void;
  reservation: Reservation | null;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600, md: 700 },
  maxHeight: '90vh',
  overflow: 'auto',
  bgcolor: colors.secondaryDark,
  border: `1px solid ${colors.secondaryGrey}`,
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

const getStatusColor = (status: ReservationStatus): string => {
  switch (status) {
    case 'CONFIRMED':
      return colors.primaryGreen;
    case 'PENDING':
      return colors.warning;
    case 'CANCELLED':
      return colors.primaryRed;
    default:
      return colors.secondaryGrey;
  }
};

const getStatusLabel = (status: ReservationStatus): string => {
  switch (status) {
    case 'CONFIRMED':
      return 'Confirmée';
    case 'PENDING':
      return 'En attente';
    case 'CANCELLED':
      return 'Annulée';
    default:
      return status;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const formatPrice = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${numAmount.toFixed(2).replace('.', ',')} €`;
};

export const ReservationDetailsModal = ({
  open,
  onClose,
  reservation,
}: ReservationDetailsModalProps) => {
  if (!reservation) return null;

  const customerName = reservation.user?.pseudo || `Utilisateur #${reservation.user_id}`;
  const customerEmail = reservation.user?.email || 'Non disponible';
  const reservationDate = reservation.date?.jour
    ? formatDate(reservation.date.jour)
    : 'Date non disponible';
  const isOpen = reservation.date?.is_open !== undefined ? reservation.date.is_open : null;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="reservation-details-modal-title">
      <Box sx={style}>
        <Typography
          id="reservation-details-modal-title"
          variant="h5"
          component="h2"
          sx={{
            mb: 3,
            color: colors.primaryGreen,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Détails de la réservation
        </Typography>

        <Stack spacing={3}>
          {/* En-tête avec numéro et statut */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography
              variant="h6"
              sx={{
                color: colors.primaryGreen,
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              Réservation #{reservation.reservation_number}
            </Typography>
            <Chip
              label={getStatusLabel(reservation.status)}
              size="medium"
              sx={{
                backgroundColor: getStatusColor(reservation.status),
                color: colors.white,
                fontWeight: 700,
                letterSpacing: '0.03em',
                minWidth: '120px',
              }}
            />
          </Box>

          <Divider sx={{ borderColor: colors.secondaryGrey }} />

          {/* Informations client */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: colors.primaryGreen,
                textTransform: 'uppercase',
                fontSize: '0.875rem',
                letterSpacing: '0.05em',
                mb: 1.5,
                fontWeight: 600,
              }}
            >
              Informations client
            </Typography>
            <Stack spacing={1}>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.secondaryGrey,
                    fontSize: '0.75rem',
                    mb: 0.5,
                  }}
                >
                  Nom d'utilisateur
                </Typography>
                <Typography variant="body1" sx={{ color: colors.white, fontWeight: 500 }}>
                  {customerName}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.secondaryGrey,
                    fontSize: '0.75rem',
                    mb: 0.5,
                  }}
                >
                  Email
                </Typography>
                <Typography variant="body1" sx={{ color: colors.white }}>
                  {customerEmail}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Divider sx={{ borderColor: colors.secondaryGrey }} />

          {/* Informations de visite */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: colors.primaryGreen,
                textTransform: 'uppercase',
                fontSize: '0.875rem',
                letterSpacing: '0.05em',
                mb: 1.5,
                fontWeight: 600,
              }}
            >
              Informations de visite
            </Typography>
            <Stack spacing={1}>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.secondaryGrey,
                    fontSize: '0.75rem',
                    mb: 0.5,
                  }}
                >
                  Date de visite
                </Typography>
                <Typography variant="body1" sx={{ color: colors.white, fontWeight: 500 }}>
                  {reservationDate}
                </Typography>
              </Box>
              {isOpen !== null && (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.secondaryGrey,
                      fontSize: '0.75rem',
                      mb: 0.5,
                    }}
                  >
                    Statut du parc
                  </Typography>
                  <Chip
                    label={isOpen ? 'Ouvert' : 'Fermé'}
                    size="small"
                    sx={{
                      backgroundColor: isOpen ? colors.primaryGreen : colors.primaryRed,
                      color: colors.white,
                      fontWeight: 600,
                    }}
                  />
                </Box>
              )}
              {reservation.date?.notes && (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.secondaryGrey,
                      fontSize: '0.75rem',
                      mb: 0.5,
                    }}
                  >
                    Notes
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.white }}>
                    {reservation.date.notes}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>

          <Divider sx={{ borderColor: colors.secondaryGrey }} />

          {/* Détails des tickets */}
          {reservation.tickets && reservation.tickets.length > 0 && (
            <>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: colors.primaryGreen,
                    textTransform: 'uppercase',
                    fontSize: '0.875rem',
                    letterSpacing: '0.05em',
                    mb: 1.5,
                    fontWeight: 600,
                  }}
                >
                  Détails des billets
                </Typography>
                <Stack spacing={2}>
                  {reservation.tickets.map((ticket, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        backgroundColor: colors.secondaryDarkAlt,
                        borderRadius: 2,
                        border: `1px solid ${colors.secondaryGrey}`,
                      }}
                    >
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography
                            variant="body1"
                            sx={{
                              color: colors.primaryGreen,
                              fontWeight: 600,
                              fontSize: '1rem',
                            }}
                          >
                            {ticket.label}
                          </Typography>
                          <Chip
                            label={ticket.type}
                            size="small"
                            sx={{
                              backgroundColor: colors.secondaryGrey,
                              color: colors.white,
                              fontSize: '0.7rem',
                              height: '20px',
                            }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: colors.secondaryGrey,
                              fontSize: '0.875rem',
                            }}
                          >
                            Quantité
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: colors.white,
                              fontWeight: 500,
                            }}
                          >
                            {ticket.quantity}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: colors.secondaryGrey,
                              fontSize: '0.875rem',
                            }}
                          >
                            Prix unitaire
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: colors.white,
                            }}
                          >
                            {formatPrice(ticket.unit_price)}
                          </Typography>
                        </Box>
                        <Divider sx={{ borderColor: colors.secondaryGrey, my: 0.5 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: colors.white,
                              fontWeight: 600,
                            }}
                          >
                            Sous-total
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: colors.primaryGreen,
                              fontWeight: 700,
                              fontSize: '1rem',
                            }}
                          >
                            {formatPrice(ticket.subtotal)}
                          </Typography>
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: colors.secondaryGrey,
                            fontSize: '0.7rem',
                            mt: 0.5,
                          }}
                        >
                          ID tarif: #{ticket.price_id}
                        </Typography>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Box>
              <Divider sx={{ borderColor: colors.secondaryGrey }} />
            </>
          )}

          {/* Informations de réservation */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: colors.primaryGreen,
                textTransform: 'uppercase',
                fontSize: '0.875rem',
                letterSpacing: '0.05em',
                mb: 1.5,
                fontWeight: 600,
              }}
            >
              Informations de réservation
            </Typography>
            <Stack spacing={1}>
              {reservation.tickets_count && (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.secondaryGrey,
                      fontSize: '0.75rem',
                      mb: 0.5,
                    }}
                  >
                    Nombre total de billets
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.white, fontWeight: 500 }}>
                    {reservation.tickets_count}
                  </Typography>
                </Box>
              )}
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.secondaryGrey,
                    fontSize: '0.75rem',
                    mb: 0.5,
                  }}
                >
                  Montant total
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: colors.primaryGreen,
                    fontWeight: 700,
                    fontSize: '1.5rem',
                  }}
                >
                  {formatPrice(reservation.total_amount)}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};
