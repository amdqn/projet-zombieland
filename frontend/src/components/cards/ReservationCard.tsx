import { Box, Card, CardContent, Chip, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { colors } from '../../theme/theme';
import type { Reservation, ReservationStatus } from '../../@types/reservation';
import {useContext} from "react";
import {LoginContext} from "../../context/UserLoginContext.tsx";
import { useTranslation } from 'react-i18next';

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

const getStatusLabel = (status: ReservationStatus, t: (key: string) => string): string => {
  switch (status) {
    case 'CONFIRMED':
      return t('admin.reservations.confirmed');
    case 'PENDING':
      return t('admin.reservations.pending');
    case 'CANCELLED':
      return t('admin.reservations.cancelled');
    default:
      return status;
  }
};

const formatDate = (dateString: string, locale: string = 'fr-FR'): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const formatPrice = (amount: number | string, locale: string = 'fr-FR'): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (locale === 'en-US') {
    return `€${numAmount.toFixed(2)}`;
  }
  return `${numAmount.toFixed(2).replace('.', ',')} €`;
};

export const ReservationCard = ({ reservation, onEdit, onDelete, onClick }: ReservationCardProps) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
  const { role } = useContext(LoginContext);

  const customerName = reservation.user?.pseudo || `${t('admin.reservations.card.userFallback')}${reservation.user_id}`;
  const reservationDate = reservation.date?.jour 
    ? formatDate(reservation.date.jour, locale) 
    : t('admin.reservations.card.dateNotAvailable');

  // Vérifier si la date est passée
  const isDatePassed = () => {
    if (!reservation.date?.jour) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const visitDate = new Date(reservation.date.jour);
    visitDate.setHours(0, 0, 0, 0);
    return visitDate < today;
  };

  // Vérifier si on peut annuler (règle J-10 pour admin)
  const canCancel = () => {
    if (isDatePassed()) return false;
    if (!reservation.date?.jour) return true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const visitDate = new Date(reservation.date.jour);
    visitDate.setHours(0, 0, 0, 0);
    
    const diffTime = visitDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Pour l'admin, vérification J-10
    if (role === 'ADMIN') {
      return diffDays >= 10;
    }
    
    return true;
  };

  const datePassed = isDatePassed();
  const canCancelReservation = canCancel();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit && !datePassed) {
      onEdit(reservation);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && canCancelReservation) {
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
                {t('admin.reservations.card.reservationNumber')}{reservation.reservation_number}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={getStatusLabel(reservation.status, t)}
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
                      disabled={datePassed}
                      sx={{
                        color: datePassed ? colors.secondaryGrey : colors.primaryGreen,
                        '&:hover': {
                          backgroundColor: datePassed ? 'transparent' : `${colors.primaryGreen}20`,
                        },
                        '&.Mui-disabled': {
                          color: colors.secondaryGrey,
                        },
                      }}
                      aria-label={t('admin.reservations.card.editLabel')}
                      title={datePassed ? t('admin.reservations.card.editDisabled') : t('admin.reservations.card.editLabel')}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                  {onDelete && (
                    <IconButton
                      onClick={handleDelete}
                      size="small"
                      disabled={!canCancelReservation}
                      sx={{
                        color: canCancelReservation ? colors.primaryRed : colors.secondaryGrey,
                        '&:hover': {
                          backgroundColor: canCancelReservation ? `${colors.primaryRed}20` : 'transparent',
                        },
                        '&.Mui-disabled': {
                          color: colors.secondaryGrey,
                        },
                      }}
                      aria-label={t('admin.reservations.card.deleteLabel')}
                      title={
                        datePassed 
                          ? t('admin.reservations.card.deleteDisabledDate')
                          : !canCancelReservation && role === 'ADMIN'
                          ? t('admin.reservations.card.deleteDisabledDays')
                          : t('admin.reservations.card.deleteLabel')
                      }
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

            {/* Affichage client en fonction du role */}
            {role === 'ADMIN' && (
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
                    {t('admin.reservations.card.client')}
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.white, fontWeight: 600 }}>
                    {customerName}
                  </Typography>
                </Box>

            )}


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
                {t('admin.reservations.card.visitDate')}
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
                {t('admin.reservations.card.totalAmount')}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: colors.primaryGreen,
                  fontWeight: 700,
                  fontSize: '1.5rem',
                }}
              >
                {formatPrice(reservation.total_amount, locale)}
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
                  {t('admin.reservations.card.ticketsCount')}
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
