import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { colors } from '../../../theme';
import type { Category } from '../../../@types/categorie';

interface DeleteCategoryModalProps {
  deleteDialogOpen: boolean;
  handleCloseDeleteDialog: () => void;
  handleConfirmDelete: () => void;
  categoryToDelete: Category | null;
  isDeleting: boolean;
  error: string | null;
  success?: string | null;
}

export const DeleteCategoryModal = ({
  deleteDialogOpen,
  handleCloseDeleteDialog,
  handleConfirmDelete,
  categoryToDelete,
  isDeleting,
  error,
  success,
}: DeleteCategoryModalProps) => {
  const activitiesCount = categoryToDelete?._count?.activities || 0;
  const attractionsCount = categoryToDelete?._count?.attractions || 0;
  const isInUse = activitiesCount > 0 || attractionsCount > 0;

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
        Supprimer la catégorie
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

        {!success && isInUse && (
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
                Cette catégorie ne peut pas être supprimée
              </Typography>
              <Typography variant="body2">
                Elle est utilisée par {activitiesCount > 0 && `${activitiesCount} activité${activitiesCount > 1 ? 's' : ''}`}
                {activitiesCount > 0 && attractionsCount > 0 && ' et '}
                {attractionsCount > 0 && `${attractionsCount} attraction${attractionsCount > 1 ? 's' : ''}`}.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Veuillez d'abord retirer cette catégorie des activités et attractions associées.
              </Typography>
            </Alert>
            <Typography sx={{ color: colors.secondaryGrey }}>
              Catégorie : <strong style={{ color: colors.white }}>{categoryToDelete?.name}</strong>
            </Typography>
          </Box>
        )}

        {!success && !isInUse && (
          <Typography sx={{ color: colors.white }}>
            Êtes-vous sûr de vouloir supprimer la catégorie{' '}
            <strong style={{ color: colors.primaryGreen }}>
              {categoryToDelete?.name}
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
            color: colors.white,
            borderColor: colors.secondaryGrey,
            '&:hover': {
              backgroundColor: `${colors.secondaryGrey}20`,
            },
          }}
        >
          {isInUse ? 'Fermer' : 'Annuler'}
        </Button>
        {!isInUse && (
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
        )}
      </DialogActions>
    </Dialog>
  );
};
