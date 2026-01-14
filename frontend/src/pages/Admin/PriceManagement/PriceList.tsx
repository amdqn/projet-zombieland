import {
    Box,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Pagination,
    Grid,
    Button,
    CircularProgress,
    Fade
} from '@mui/material';
import { colors } from '../../../theme';
import { useEffect, useState, useRef } from 'react';
import { deletePrice, getPrices } from "../../../services/prices.ts";
import type { Price, PricesFilters } from "../../../@types/price";
import { PriceDetailsModal } from "../../../components/modals/Prices/PriceDetailsModal.tsx";
import AddIcon from "@mui/icons-material/Add";
import { UpdatePriceModal } from "../../../components/modals/Prices/UpdatePriceModal.tsx";
import { DeletePriceModal } from "../../../components/modals/Prices/DeletePriceModal.tsx";
import { CreatePriceModal } from "../../../components/modals/Prices/CreatePriceModal.tsx";
import PriceAdminCard from "../../../components/cards/Prices/PricesAdminCard.tsx";

export const PriceList = () => {
    const [prices, setPrices] = useState<Price[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState<Price | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [priceToDelete, setPriceToDelete] = useState<Price | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [priceToView, setPriceToView] = useState<Price | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const [dateFromFilter, setDateFromFilter] = useState('');
    const [dateToFilter, setDateToFilter] = useState('');
    const [priceType, setPriceType] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [sortBy, setSortBy] = useState('created_desc');
    const [amount] = useState<number>(0);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
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
                const filters: PricesFilters = {
                    priceType,
                    page,
                    limit,
                    sortBy,
                    amount: amount || undefined,
                };

                const response = await getPrices(filters);
                setPrices(response.data);
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
    }, [page, priceType, limit, amount, sortBy, refreshTrigger, dateFromFilter, dateToFilter]);

    const handleEdit = (price: Price) => {
        setSelectedPrice(price);
        setEditModalOpen(true);
    };

    const handleDelete = (price: Price) => {
        if (editModalOpen) {
            setEditModalOpen(false);
            setSelectedPrice(null);
        }
        setPriceToDelete(price);
        setDeleteDialogOpen(true);
        setDeleteError(null);
    };

    const handleViewDetails = (price: Price) => {
        setPriceToView(price);
        setDetailsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!priceToDelete) return;

        setIsDeleting(true);
        setDeleteError(null);
        try {
            await deletePrice(priceToDelete.id);
            setPrices(prices.filter((r) => r.id !== priceToDelete.id));
            setDeleteDialogOpen(false);
            setPriceToDelete(null);
            setRefreshTrigger((prev) => prev + 1);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors de la suppression du prix';
            setDeleteError(message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCloseDeleteDialog = () => {
        if (!isDeleting) {
            setDeleteDialogOpen(false);
            setPriceToDelete(null);
        }
    };

    const handleCreate = () => {
        setCreateModalOpen(true);
    };

    const handleCreateSuccess = () => {
        setCreateModalOpen(false);
        setRefreshTrigger((prev) => prev + 1); // Rafraîchir la liste
    };

    const handleUpdateSuccess = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    const handleResetFilters = () => {
        setPriceType('');
        setDateFromFilter('');
        setDateToFilter('');
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
                    Liste des tarifs
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: colors.secondaryGrey,
                        mb: 2,
                    }}
                >
                    Créez, modifiez et gérez tous les tarifs du parc Zombieland. Total : {total} tarifs
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreate}
                    sx={{
                        backgroundColor: colors.primaryGreen,
                        color: colors.secondaryDark,
                        '&:hover': {
                            backgroundColor: colors.primaryGreen,
                            opacity: 0.9,
                        },
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        mb: 3,
                    }}
                >
                    Nouveau tarif
                </Button>

                {/* Barre de recherche */}
                <Box sx={{ mb: 3 }}>
                    {/* Filtres */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <FormControl fullWidth sx={{ minWidth: '200px' }}>
                                <InputLabel sx={{ color: colors.secondaryGrey }}>Type de prix</InputLabel>
                                <Select
                                    value={priceType}
                                    label="Type de prix"
                                    onChange={(e) => {
                                        setPriceType(e.target.value);
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
                                    <MenuItem value="ETUDIANT">Tarif étudiant</MenuItem>
                                    <MenuItem value="GROUPE">Tarif groupe</MenuItem>
                                    <MenuItem value="PASS_2J">Tarif pass 2 jours</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 6}}>
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
                                    <MenuItem value="updated_desc">Date modification (récent)</MenuItem>
                                    <MenuItem value="updated_asc">Date modification (ancien)</MenuItem>
                                    <MenuItem value="amount_desc">Montant (décroissant)</MenuItem>
                                    <MenuItem value="amount_asc">Montant (croissant)</MenuItem>
                                </Select>
                            </FormControl>
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
                            Chargement des tarifs...
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
                ) : prices.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '400px',
                        }}
                    >
                        <Typography variant="body1" sx={{ color: colors.white }}>
                            Aucun tarif trouvé.
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
                                {prices.map((price) => (
                                    <PriceAdminCard
                                        key={price.id}
                                        price={price}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onClick={handleViewDetails}
                                    />
                                ))}
                            </Box>

                            {/* Pagination */}
                            {totalPages > 1 && (
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
            <UpdatePriceModal
                open={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedPrice(null);
                }}
                price={selectedPrice}
                onUpdateSuccess={handleUpdateSuccess}
            />

            {/* Modal de détails */}
            <PriceDetailsModal
                open={detailsModalOpen}
                onClose={() => {
                    setDetailsModalOpen(false);
                    setPriceToView(null);
                }}
                price={priceToView}
            />

            {/* Modal de confirmation de suppression */}
            <DeletePriceModal
                deleteDialogOpen={deleteDialogOpen}
                handleCloseDeleteDialog={handleCloseDeleteDialog}
                handleConfirmDelete={handleConfirmDelete}
                priceToDelete={priceToDelete}
                isDeleting={isDeleting}
                error={deleteError}
            />

            {/* Modal de création de prix */}
            <CreatePriceModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onCreateSuccess={handleCreateSuccess}
            />
        </Box>
    );
};