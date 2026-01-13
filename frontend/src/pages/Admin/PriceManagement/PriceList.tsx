import {
    Box,
    Typography,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Pagination,
    Grid,
    InputAdornment,
    IconButton,
    Button,
    CircularProgress,
    Fade
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { colors } from '../../../theme';
import { useEffect, useState, useRef } from 'react';
import {getPrices} from "../../../services/prices.ts";

export const PriceList = () => {
    const [prices, setPrices] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState<Reservation | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [priceToDelete, setPriceToDelete] = useState<Reservation | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [priceToView, setPriceToView] = useState<Reservation | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFromFilter, setDateFromFilter] = useState('');
    const [dateToFilter, setDateToFilter] = useState('');
    const [sortBy, setSortBy] = useState('created_desc');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        const delay = dateFromFilter || dateToFilter ? 500 : 0;

        debounceTimeoutRef.current = setTimeout(async () => {
            setIsLoading(true);
            setError(null);
            try {
                /*const filters: PricesFilters = {
                    page,
                    limit: 10,
                    search: search || undefined,
                    status: statusFilter || undefined,
                    dateFrom: dateFromFilter || undefined,
                    dateTo: dateToFilter || undefined,
                    sortBy: sortBy || undefined,
                };*/
                // Revoir ici
                const response = await getPrices(filters);
                setPrices(response);
                setTotalPages(response.pagination.totalPages);
                setTotal(response.pagination.total);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Erreur lors de la récupération des prix';
                setError(message);
            } finally {
                setIsLoading(false);
            }
        }, delay);

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [page, search, statusFilter, dateFromFilter, dateToFilter, sortBy, refreshTrigger]);

    const handleEdit = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setEditModalOpen(true);
    };

    const handleDelete = (reservation: Reservation) => {
        if (editModalOpen) {
            setEditModalOpen(false);
            setSelectedReservation(null);
        }
        setReservationToDelete(reservation);
        setDeleteDialogOpen(true);
        setDeleteError(null);
    };

    const handleViewDetails = (reservation: Reservation) => {
        setReservationToView(reservation);
        setDetailsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!reservationToDelete) return;

        setIsDeleting(true);
        setDeleteError(null);
        try {
            await deleteReservation(reservationToDelete.id);
            setReservations(reservations.filter((r) => r.id !== reservationToDelete.id));
            setDeleteDialogOpen(false);
            setReservationToDelete(null);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors de la suppression de la réservation';
            setDeleteError(message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCloseDeleteDialog = () => {
        if (!isDeleting) {
            setDeleteDialogOpen(false);
            setReservationToDelete(null);
        }
    };

    const handleUpdateSuccess = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    const handleSearch = () => {
        setSearch(searchInput);
        setPage(1); // Réinitialiser à la première page lors d'une recherche
    };

    const handleClearSearch = () => {
        setSearchInput('');
        setSearch('');
        setPage(1);
    };

    const handleResetFilters = () => {
        setStatusFilter('');
        setDateFromFilter('');
        setDateToFilter('');
        setSearchInput('');
        setSearch('');
        setSortBy('created_desc');
        setPage(1);
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h2"
                    sx={{
                        fontSize: { xs: '1.5rem', md: '2rem' },
                        mb: 2,
                    }}
                >
                    Liste des réservations
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: colors.secondaryGrey,
                        mb: 2,
                    }}
                >
                    Gérez toutes les réservations du parc Zombieland. Total : {total} réservation(s)
                </Typography>

                {/* Barre de recherche */}
                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Rechercher par numéro de réservation, utilisateur, statut..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: colors.secondaryGrey }} />
                                </InputAdornment>
                            ),
                            endAdornment: searchInput && (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClearSearch} size="small">
                                        <ClearIcon sx={{ color: colors.secondaryGrey }} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                backgroundColor: colors.secondaryDark,
                                color: colors.white,
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: colors.secondaryGrey,
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: colors.primaryRed,
                                },
                            },
                        }}
                        sx={{ mb: 2 }}
                    />

                    {/* Filtres */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <FormControl fullWidth sx={{ minWidth: '200px' }}>
                                <InputLabel sx={{ color: colors.secondaryGrey }}>Statut</InputLabel>
                                <Select
                                    value={statusFilter}
                                    label="Statut"
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setPage(1);
                                    }}
                                    sx={{
                                        backgroundColor: colors.secondaryDark,
                                        color: colors.white,
                                        minHeight: '56px',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: colors.secondaryGrey,
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: colors.primaryRed,
                                        },
                                        '& .MuiSelect-select': {
                                            paddingY: '16.5px',
                                            minWidth: '100px',
                                            display: 'flex',
                                            alignItems: 'center',
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: colors.secondaryDark,
                                                '& .MuiMenuItem-root': {
                                                    color: colors.white,
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                                    },
                                                    '&.Mui-selected': {
                                                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(255, 0, 0, 0.3)',
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="">Tous</MenuItem>
                                    <MenuItem value="PENDING">En attente</MenuItem>
                                    <MenuItem value="CONFIRMED">Confirmée</MenuItem>
                                    <MenuItem value="CANCELLED">Annulée</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                            <FormControl fullWidth sx={{ minWidth: '200px' }}>
                                <InputLabel sx={{ color: colors.secondaryGrey }}>Trier par</InputLabel>
                                <Select
                                    value={sortBy}
                                    label="Trier par"
                                    onChange={(e) => {
                                        setSortBy(e.target.value);
                                        setPage(1);
                                    }}
                                    sx={{
                                        backgroundColor: colors.secondaryDark,
                                        color: colors.white,
                                        minHeight: '56px',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: colors.secondaryGrey,
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: colors.primaryRed,
                                        },
                                        '& .MuiSelect-select': {
                                            paddingY: '16.5px',
                                            minWidth: '100px',
                                            display: 'flex',
                                            alignItems: 'center',
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: colors.secondaryDark,
                                                '& .MuiMenuItem-root': {
                                                    color: colors.white,
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                                    },
                                                    '&.Mui-selected': {
                                                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(255, 0, 0, 0.3)',
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="created_desc">Date création (récent)</MenuItem>
                                    <MenuItem value="created_asc">Date création (ancien)</MenuItem>
                                    <MenuItem value="date_desc">Date visite (récent)</MenuItem>
                                    <MenuItem value="date_asc">Date visite (ancien)</MenuItem>
                                    <MenuItem value="amount_desc">Montant (décroissant)</MenuItem>
                                    <MenuItem value="amount_asc">Montant (croissant)</MenuItem>
                                    <MenuItem value="status">Statut</MenuItem>
                                    <MenuItem value="number">Numéro</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date de visite (de)"
                                value={dateFromFilter}
                                onChange={(e) => {
                                    setDateFromFilter(e.target.value);
                                    setPage(1);
                                }}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    backgroundColor: colors.secondaryDark,
                                    '& .MuiOutlinedInput-root': {
                                        color: colors.white,
                                        '& fieldset': {
                                            borderColor: colors.secondaryGrey,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: colors.primaryRed,
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: colors.secondaryGrey,
                                    },
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date de visite (à)"
                                value={dateToFilter}
                                onChange={(e) => {
                                    setDateToFilter(e.target.value);
                                    setPage(1);
                                }}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    backgroundColor: colors.secondaryDark,
                                    '& .MuiOutlinedInput-root': {
                                        color: colors.white,
                                        '& fieldset': {
                                            borderColor: colors.secondaryGrey,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: colors.primaryRed,
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: colors.secondaryGrey,
                                    },
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleResetFilters}
                                sx={{
                                    height: '56px',
                                    borderColor: colors.secondaryGrey,
                                    color: colors.white,
                                    '&:hover': {
                                        borderColor: colors.primaryRed,
                                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                    },
                                }}
                            >
                                Réinitialiser
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            <Box
                sx={{
                    padding: 3,
                    backgroundColor: colors.secondaryDark,
                    border: `1px solid ${colors.secondaryGrey}`,
                    borderRadius: '8px',
                    minHeight: '400px',
                    position: 'relative',
                }}
            >
                {isLoading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '400px',
                            gap: 2,
                        }}
                    >
                        <CircularProgress sx={{ color: colors.primaryRed }} size={60} />
                        <Typography variant="body1" sx={{ color: colors.white }}>
                            Chargement des réservations...
                        </Typography>
                    </Box>
                ) : error ? (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '400px',
                        }}
                    >
                        <Typography variant="body1" sx={{ color: colors.primaryRed }}>
                            Erreur : {error}
                        </Typography>
                    </Box>
                ) : reservations.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '400px',
                        }}
                    >
                        <Typography variant="body1" sx={{ color: colors.white }}>
                            Aucune réservation trouvée.
                        </Typography>
                    </Box>
                ) : (
                    <Fade in={!isLoading} timeout={500}>
                        <Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 3,
                                    mb: 3,
                                }}
                            >
                                {reservations.map((reservation) => (
                                    <ReservationCard
                                        key={reservation.id}
                                        reservation={reservation}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onClick={handleViewDetails}
                                    />
                                ))}
                            </Box>

                            {/* Pagination */}
                            {totalPages >= 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                    <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={handlePageChange}
                                        color="primary"
                                        size="large"
                                        sx={{
                                            '& .MuiPaginationItem-root': {
                                                color: colors.white,
                                                borderColor: colors.secondaryGrey,
                                            },
                                            '& .MuiPaginationItem-root.Mui-selected': {
                                                backgroundColor: colors.primaryRed,
                                                color: colors.white,
                                            },
                                            '& .MuiPaginationItem-root:hover': {
                                                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                                            },
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Fade>
                )}
            </Box>

            {/* Modal de modification */}
            <UpdateReservationModal
                open={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedReservation(null);
                }}
                reservation={selectedReservation}
                onUpdateSuccess={handleUpdateSuccess}
            />

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
};