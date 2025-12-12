import { Box, Card, CardContent, Chip, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { colors } from '../../theme/theme';
import type { Reservation, ReservationStatus } from '../../@types/reservation';

const StyledReservationCard = styled(Card)({
  backgroundColor: colors.secondaryDark,
  border: `1px solid ${colors.secondaryGrey}`,
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: colors.primaryGreen,
    transform: 'translateY(-3px)',
    boxShadow: `0 5px 20px ${colors.primaryGreen}40`,
  },
  '& .MuiCardContent-root': {
    padding: '1.5rem',
  },
});

interface ReservationCardProps {
  reservation: Reservation;
  onEdit?: (reservation: Reservation) => void;
  onDelete?: (reservation: Reservation) => void;
  onClick?: (reservation: Reservation) => void;
}

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

export const ReservationCard = ({ reservation, onEdit, onDelete, onClick }: ReservationCardProps) => {
  const customerName = reservation.user?.pseudo || `Utilisateur #${reservation.user_id}`;
  const reservationDate = reservation.date?.jour 
    ? formatDate(reservation.date.jour) 
    : 'Date non disponible';

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(reservation);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(reservation);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(reservation);
    }
  };

  return (
    <StyledReservationCard
      onClick={handleCardClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          {/* En-tête avec numéro de réservation, statut et actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box>
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
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={getStatusLabel(reservation.status)}
                size="small"
                sx={{
                  backgroundColor: getStatusColor(reservation.status),
                  color: colors.white,
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  minWidth: '100px',
                }}
              />
              {(onEdit || onDelete) && (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {onEdit && (
                    <IconButton
                      onClick={handleEdit}
                      size="small"
                      sx={{
                        color: colors.primaryGreen,
                        '&:hover': {
                          backgroundColor: `${colors.primaryGreen}20`,
                        },
                      }}
                      aria-label="Modifier la réservation"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                  {onDelete && (
                    <IconButton
                      onClick={handleDelete}
                      size="small"
                      sx={{
                        color: colors.primaryRed,
                        '&:hover': {
                          backgroundColor: `${colors.primaryRed}20`,
                        },
                      }}
                      aria-label="Supprimer la réservation"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              )}
            </Box>
          </Box>

          <Box sx={{ height: '1px', backgroundColor: colors.secondaryGrey }} />

          {/* Informations principales */}
          <Stack spacing={1.5}>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: colors.secondaryGrey,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  mb: 0.5,
                }}
              >
                Client
              </Typography>
              <Typography variant="body1" sx={{ color: colors.white, fontWeight: 600 }}>
                {customerName}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: colors.secondaryGrey,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  mb: 0.5,
                }}
              >
                Date de visite
              </Typography>
              <Typography variant="body1" sx={{ color: colors.white }}>
                {reservationDate}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: colors.secondaryGrey,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
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

            {reservation.tickets_count && (
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.secondaryGrey,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                    mb: 0.5,
                  }}
                >
                  Nombre de billets
                </Typography>
                <Typography variant="body1" sx={{ color: colors.white }}>
                  {reservation.tickets_count}
                </Typography>
              </Box>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </StyledReservationCard>
  );
};
