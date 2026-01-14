import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { colors } from '../../../theme';
import type { User } from '../../../@types/users';

interface DeleteUserModalProps {
  deleteDialogOpen: boolean;
  handleCloseDeleteDialog: () => void;
  handleConfirmDelete: () => void;
  userToDelete: User | null;
  isDeleting: boolean;
  error: string | null;
}

export const DeleteUserModal = ({
  deleteDialogOpen,
  handleCloseDeleteDialog,
  handleConfirmDelete,
  userToDelete,
  isDeleting,
  error,
}: DeleteUserModalProps) => {
  const hasReservations = (userToDelete?._count?.reservations || 0) > 0;

  return (
    <Dialog
      open={deleteDialogOpen}
      onClose={handleCloseDeleteDialog}
      PaperProps={{
        sx: {
          backgroundColor: colors.secondaryDark,
          border: `1px solid ${colors.secondaryGrey}`,
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ color: colors.primaryRed, fontWeight: 600 }}>
        Supprimer l'utilisateur
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {hasReservations && (
          <Box>
            <Alert
              severity="warning"
              icon={<WarningIcon />}
              sx={{
                mb: 2,
                backgroundColor: `${colors.primaryGold}20`,
                color: colors.white,
                '& .MuiAlert-icon': {
                  color: colors.primaryGold,
                },
              }}
            >
              <Typography sx={{ fontWeight: 600, mb: 1 }}>
                Cet utilisateur ne peut pas être supprimé
              </Typography>
              <Typography variant="body2">
                Il a {userToDelete?._count?.reservations || 0} réservation{userToDelete?._count?.reservations !== 1 ? 's' : ''} associée{userToDelete?._count?.reservations !== 1 ? 's' : ''}.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Veuillez d'abord supprimer ou transférer les réservations associées.
              </Typography>
            </Alert>
            <Typography sx={{ color: colors.secondaryGrey }}>
              Utilisateur : <strong style={{ color: colors.white }}>{userToDelete?.pseudo}</strong>
            </Typography>
          </Box>
        )}

        {!hasReservations && (
          <>
            <Typography sx={{ color: colors.white, mb: 2 }}>
              Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur{' '}
              <strong style={{ color: colors.primaryGreen }}>
                {userToDelete?.pseudo}
              </strong>
              ?
            </Typography>
            <Alert
              severity="warning"
              sx={{
                mb: 2,
                backgroundColor: `${colors.primaryGold}20`,
                color: colors.white,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Attention : Cette action est irréversible et conforme au RGPD
              </Typography>
              <Typography variant="body2">
                Toutes les données personnelles de cet utilisateur seront définitivement supprimées.
              </Typography>
            </Alert>
            <Typography variant="body2" sx={{ color: colors.secondaryGrey }}>
              Email : {userToDelete?.email}
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleCloseDeleteDialog}
          disabled={isDeleting}
          sx={{
            color: colors.white,
            borderColor: colors.secondaryGrey,
            '&:hover': {
              backgroundColor: `${colors.secondaryGrey}20`,
            },
          }}
        >
          {hasReservations ? 'Fermer' : 'Annuler'}
        </Button>
        {!hasReservations && (
          <Button
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            variant="contained"
            sx={{
              backgroundColor: colors.primaryRed,
              '&:hover': {
                backgroundColor: colors.primaryRed,
                opacity: 0.9,
              },
            }}
          >
            {isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
