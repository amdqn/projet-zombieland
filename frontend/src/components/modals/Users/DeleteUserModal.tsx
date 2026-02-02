import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        {t('admin.users.delete')}
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
                {t('admin.users.cannotDeleteUser')}
              </Typography>
              <Typography variant="body2">
                {t('admin.users.reservationsAssociated', { count: userToDelete?._count?.reservations || 0 })}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {t('admin.users.deleteOrTransferFirst')}
              </Typography>
            </Alert>
            <Typography sx={{ color: colors.secondaryGrey }}>
              {t('admin.users.userLabel')}: <strong style={{ color: colors.white }}>{userToDelete?.pseudo}</strong>
            </Typography>
          </Box>
        )}

        {!hasReservations && (
          <>
            <Typography sx={{ color: colors.white, mb: 2 }}>
              {t('admin.users.confirmDeleteUser')}{' '}
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
                {t('admin.users.irreversibleAction')}
              </Typography>
              <Typography variant="body2">
                {t('admin.users.personalDataDeleted')}
              </Typography>
            </Alert>
            <Typography variant="body2" sx={{ color: colors.secondaryGrey }}>
              {t('admin.users.email')}: {userToDelete?.email}
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
          {hasReservations ? t('common.close') : t('common.cancel')}
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
            {isDeleting ? t('admin.users.deleting') : t('admin.users.deletePermanently')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
