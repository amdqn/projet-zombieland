import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { colors } from '../../../theme';
import type { Attraction } from '../../../@types/attraction';

interface DeleteAttractionModalProps {
  deleteDialogOpen: boolean;
  handleCloseDeleteDialog: () => void;
  handleConfirmDelete: () => void;
  attractionToDelete: Attraction | null;
  isDeleting: boolean;
  error: string | null;
  success?: string | null;
}

export const DeleteAttractionModal = ({
  deleteDialogOpen,
  handleCloseDeleteDialog,
  handleConfirmDelete,
  attractionToDelete,
  isDeleting,
  error,
  success,
}: DeleteAttractionModalProps) => {
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
        Supprimer l'attraction
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        {!success && (
          <Typography sx={{ color: colors.white }}>
            Êtes-vous sûr de vouloir supprimer l'attraction{' '}
            <strong style={{ color: colors.primaryGreen }}>
              {attractionToDelete?.name}
            </strong>
            ? Cette action est irréversible.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleCloseDeleteDialog}
          disabled={isDeleting}
          sx={{
            color: colors.secondaryGrey,
            '&:hover': {
              backgroundColor: `${colors.secondaryGrey}20`,
            },
          }}
        >
          Annuler
        </Button>
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
          {isDeleting ? 'Suppression...' : 'Supprimer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
