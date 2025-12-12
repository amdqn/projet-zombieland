import { Alert, Box, MenuItem, Modal, Select, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { updateReservation } from '../../services/reservations';
import { colors } from '../../theme';
import { PrimaryButton } from '../common';
import type { Reservation, ReservationStatus } from '../../@types/reservation';

interface UpdateReservationModalProps {
  open: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  onUpdateSuccess: () => void;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 450 },
  bgcolor: colors.secondaryDark,
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

export const UpdateReservationModal = ({
  open,
  onClose,
  reservation,
  onUpdateSuccess,
}: UpdateReservationModalProps) => {
  const [status, setStatus] = useState<ReservationStatus>(
    reservation?.status || 'PENDING'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Réinitialiser les états quand la modal s'ouvre avec une nouvelle réservation
  useEffect(() => {
    if (reservation) {
      setStatus(reservation.status);
      setError(null);
      setSuccess(null);
    }
  }, [reservation]);

  const handleClose = () => {
    setError(null);
    setSuccess(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!reservation) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateReservation(reservation.id, { status });
      setSuccess('Réservation mise à jour avec succès');
      setTimeout(() => {
        onUpdateSuccess();
        handleClose();
      }, 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la réservation';
      setError(message);
    } finally {
      setIsLoading(false);
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

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title">
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h5"
          component="h2"
          sx={{
            mb: 3,
            color: colors.primaryGreen,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Modifier la réservation
        </Typography>

        {reservation && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                color: colors.secondaryGrey,
                mb: 1,
              }}
            >
              Réservation #{reservation.reservation_number}
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
            {success}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography
            component="label"
            sx={{
              display: 'block',
              mb: 1,
              fontFamily: "'Lexend Deca', sans-serif",
              fontSize: '0.95rem',
              fontWeight: 600,
              color: colors.primaryGreen,
              textTransform: 'uppercase',
            }}
          >
            Statut
            <span style={{ color: colors.primaryGreen, marginLeft: '4px' }}>*</span>
          </Typography>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as ReservationStatus)}
            fullWidth
            disabled={isLoading}
            sx={{
              backgroundColor: colors.secondaryDarkAlt,
              color: colors.white,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.secondaryGrey,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primaryGreen,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primaryGreen,
              },
              '& .MuiSvgIcon-root': {
                color: colors.white,
              },
            }}
          >
            <MenuItem value="PENDING" sx={{ color: colors.white }}>
              {getStatusLabel('PENDING')}
            </MenuItem>
            <MenuItem value="CONFIRMED" sx={{ color: colors.white }}>
              {getStatusLabel('CONFIRMED')}
            </MenuItem>
            <MenuItem value="CANCELLED" sx={{ color: colors.white }}>
              {getStatusLabel('CANCELLED')}
            </MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <PrimaryButton
            text="Annuler"
            onClick={handleClose}
            fullWidth={false}
            disabled={isLoading}
            type="button"
          />
          <PrimaryButton
            text="Enregistrer"
            onClick={handleSubmit}
            fullWidth={false}
            disabled={isLoading}
            type="button"
          />
        </Box>
      </Box>
    </Modal>
  );
};

