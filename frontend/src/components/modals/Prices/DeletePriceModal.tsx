import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { colors } from '../../../theme';
import type {Price} from "../../../@types/price";

interface DeleteActivityModalProps {
    deleteDialogOpen: boolean;
    handleCloseDeleteDialog: () => void;
    handleConfirmDelete: () => void;
    priceToDelete: Price | null;
    isDeleting: boolean;
    error: string | null;
    success?: string | null;
}

export const DeletePriceModal = ({
                                        deleteDialogOpen,
                                        handleCloseDeleteDialog,
                                        handleConfirmDelete,
                                        priceToDelete,
                                        isDeleting,
                                        error,
                                        success,
                                    }: DeleteActivityModalProps) => {
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
                Supprimer un tarif
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
                        Êtes-vous sûr de vouloir supprimer l'activité{' '}
                        <strong style={{ color: colors.primaryGreen }}>
                            {priceToDelete?.label}
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
