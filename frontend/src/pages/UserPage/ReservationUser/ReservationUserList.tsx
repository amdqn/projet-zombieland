import {useEffect, useState} from "react";
import {useReservations} from "../../../hooks/useUserReservation.ts";
import {Box, Typography} from "@mui/material";
import {colors} from "../../../theme";
import {ReservationCard} from "../../../components/cards";
import {ReservationDetailsModal} from "../../../components/modals";
import type {Reservation} from "../../../@types/reservation";
import {deleteReservation} from "../../../services/reservations.ts";
import {ReservationCanceledModal} from "../../../components/modals/Reservations/ReservationCanceledModal.tsx";
import {useTranslation} from "react-i18next";

export default function ReservationUserList() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Utilisation d'un hook personnalisé
    const { reservations, setReservations, fetchReservations } = useReservations();
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [reservationToView, setReservationToView] = useState<Reservation | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);


    const handleDelete = (reservation: Reservation) => {
        setReservationToDelete(reservation);
        setDeleteDialogOpen(true);
        setDeleteError(null);
    }

    const handleViewDetails = (reservation: Reservation) => {
        setReservationToView(reservation);
        setDetailsModalOpen(true);
    }

    const handleConfirmDelete = async () => {
        if(!reservationToDelete) return;

        setIsDeleting(true);
        setDeleteError(null);

        try {
            await deleteReservation(reservationToDelete.id);

            // Retirer la réservation supprimée de la liste
            setReservations(reservations.filter(r => r.id !== reservationToDelete.id));

            setDeleteDialogOpen(false);
            setReservationToDelete(null);

        } catch (err) {
            const message = err instanceof Error ? err.message : t("auth.account.reservations.errorDelete");
            // On affiche l'erreur dans le modal
            setDeleteError(message);
        } finally {
            setIsDeleting(false);
        }
    }

    const handleCloseDeleteDialog = () => {
      if(!isDeleting) {
          setDeleteDialogOpen(false);
          setReservationToDelete(null);
      }
    }

    useEffect(() => {
        const loadReservations = async () => {
            setIsLoading(true);
            setError(null);
            try {
                await fetchReservations();
            } catch (err) {
                setError(err instanceof Error ? err.message : t("auth.account.reservations.errorLoading"));
            } finally {
                setIsLoading(false);
            }
        };
        loadReservations();
    }, [fetchReservations]);

    return (
        <Box>
            <Box
                sx={{
                    padding: 3,
                    backgroundColor: colors.secondaryDark,
                }}
            >
                {isLoading ? (
                    <Typography variant="body1" sx={{ color: colors.white }}>
                        {t("auth.account.reservations.loading")}
                    </Typography>
                ) : error ? (
                    <Typography variant="body1" sx={{ color: colors.primaryRed }}>
                        {t("auth.account.reservations.error")} {error}
                    </Typography>
                ) : reservations.length === 0 ? (
                    <Typography variant="body1" sx={{ color: colors.white }}>
                        {t("auth.account.reservations.noReservations")}
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                        }}
                    >
                        {reservations.map((reservation) => (
                            <ReservationCard
                                key={reservation.id}
                                reservation={reservation}
                                onDelete={handleDelete}
                                onClick={handleViewDetails}
                            />
                        ))}
                    </Box>
                )}
            </Box>

            {/* Modal de détails */}
            <ReservationDetailsModal
                open={detailsModalOpen}
                onClose={() => {
                    setDetailsModalOpen(false);
                    setReservationToView(null);
                }}
                reservation={reservationToView}
            />
            {/* Modal de confirmation de suppression */}
            <ReservationCanceledModal
                deleteDialogOpen={deleteDialogOpen}
                handleCloseDeleteDialog={handleCloseDeleteDialog}
                handleConfirmDelete={handleConfirmDelete}
                reservationToDelete={reservationToDelete}
                isDeleting={isDeleting}
                error={deleteError}
            />

        </Box>
    );
}