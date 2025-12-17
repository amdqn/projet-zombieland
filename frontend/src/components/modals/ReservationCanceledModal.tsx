// ReservationCanceledModal.tsx
import type {Reservation} from "../../@types/reservation";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import {colors} from "../../theme";

interface ReservationCanceledModalProps {
    deleteDialogOpen: boolean;
    handleCloseDeleteDialog: () => void;
    handleConfirmDelete: () => void;
    reservationToDelete?: Reservation | null;
    isDeleting: boolean;
    error?: string | null; // ← Ajout du prop error
}

export function ReservationCanceledModal({
                                             deleteDialogOpen,
                                             handleCloseDeleteDialog,
                                             handleConfirmDelete,
                                             reservationToDelete,
                                             isDeleting,
                                             error // ← Destructuration de error
                                         }: ReservationCanceledModalProps) {
    return (
        <Dialog
            open={deleteDialogOpen}
            onClose={handleCloseDeleteDialog}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            maxWidth="sm"
            fullWidth
            disableEscapeKeyDown={isDeleting}
            slotProps={{
                backdrop: {
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    },
                },
            }}
            PaperProps={{
                sx: {
                    backgroundColor: colors.secondaryDark,
                    border: `1px solid ${colors.secondaryGrey}`,
                },
            }}
        >
            <DialogTitle
                id="delete-dialog-title"
                sx={{
                    color: colors.primaryRed,
                    fontWeight: 'bold',
                }}
            >
                Confirmer la suppression
            </DialogTitle>

            <DialogContent>
                {/* Affichage de l'erreur si elle existe */}
                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 2,
                            backgroundColor: `${colors.primaryRed}20`,
                            color: colors.white,
                            '& .MuiAlert-icon': {
                                color: colors.primaryRed,
                            },
                        }}
                    >
                        {error}
                    </Alert>
                )}

                <Alert
                    severity="warning"
                    icon={<WarningIcon />}
                    sx={{
                        mb: 2,
                        backgroundColor: `${colors.warning}20`,
                        color: colors.white,
                        '& .MuiAlert-icon': {
                            color: colors.warning,
                        },
                    }}
                >
                    Attention : Cette action est irréversible
                </Alert>

                <DialogContentText
                    id="delete-dialog-description"
                    sx={{
                        color: colors.white,
                        fontSize: '1rem',
                        mb: 1,
                    }}
                >
                    Vous êtes sur le point de supprimer définitivement la réservation{' '}
                    <strong style={{ color: colors.primaryGreen }}>
                        #{reservationToDelete?.reservation_number}
                    </strong>
                    .
                </DialogContentText>

                {reservationToDelete && (
                    <DialogContentText
                        sx={{
                            color: colors.secondaryGrey,
                            fontSize: '0.875rem',
                            mt: 1,
                        }}
                    >
                        Client : {reservationToDelete.user?.pseudo || `Utilisateur #${reservationToDelete.user_id}`}
                        <br />
                        Montant : {reservationToDelete.total_amount} €
                    </DialogContentText>
                )}
            </DialogContent>

            <DialogActions>
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
                    sx={{
                        color: colors.primaryRed,
                        '&:hover': {
                            backgroundColor: `${colors.primaryRed}20`,
                        },
                    }}
                >
                    {isDeleting ? 'Suppression...' : 'Supprimer'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}