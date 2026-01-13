import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
  Grid,
  Fade,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import { colors } from '../../../theme';
import { useEffect, useState, useRef } from 'react';
import type { Attraction } from '../../../@types/attraction';
import { getAttractions, deleteAttraction, type AttractionFilters } from '../../../services/attractions';
import { getCategories } from '../../../services/categories';
import type { Category } from '../../../@types/categorie';
import { AttractionCard } from '../../../components/cards/AttractionCard';
import { CreateAttractionModal } from '../../../components/modals/Attractions/CreateAttractionModal.tsx';
import { UpdateAttractionModal } from '../../../components/modals/Attractions/UpdateAttractionModal.tsx';
import { AttractionDetailsModal } from '../../../components/modals/Attractions/AttractionDetailsModal.tsx';
import { DeleteAttractionModal } from '../../../components/modals/Attractions/DeleteAttractionModal.tsx';

export const AttractionList = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [attractionToDelete, setAttractionToDelete] = useState<Attraction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | ''>('');
  const [publishedFilter, setPublishedFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('created_desc');
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Erreur lors de la récupération des catégories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const filters: AttractionFilters = {
          search: search || undefined,
          categoryId: categoryFilter ? Number(categoryFilter) : undefined,
        };

        const attractionsData = await getAttractions(filters);
        // Filtrer par statut de publication côté client si nécessaire
        let filtered = attractionsData;
        if (publishedFilter === 'published') {
          filtered = attractionsData.filter((a: any) => a.is_published !== false);
        } else if (publishedFilter === 'draft') {
          filtered = attractionsData.filter((a: any) => a.is_published === false);
        }

        // Trier les attractions
        const sorted = [...filtered].sort((a, b) => {
          switch (sortBy) {
            case 'name_asc':
              return a.name.localeCompare(b.name);
            case 'name_desc':
              return b.name.localeCompare(a.name);
            case 'created_desc':
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            case 'created_asc':
              return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            case 'updated_desc':
              return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
            case 'updated_asc':
              return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
            default:
              return 0;
          }
        });

        setAttractions(sorted);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors de la récupération des attractions';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [search, categoryFilter, publishedFilter, sortBy]);

  const handleCreate = () => {
    setCreateModalOpen(true);
  };

  const handleEdit = (attraction: Attraction) => {
    setSelectedAttraction(attraction);
    setEditModalOpen(true);
  };

  const handleDelete = (attraction: Attraction) => {
    if (editModalOpen) {
      setEditModalOpen(false);
      setSelectedAttraction(null);
    }
    setAttractionToDelete(attraction);
    setDeleteDialogOpen(true);
    setDeleteError(null);
  };

  const handleViewDetails = (attraction: Attraction) => {
    setSelectedAttraction(attraction);
    setDetailsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!attractionToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);
    setDeleteSuccess(null);
    try {
      await deleteAttraction(attractionToDelete.id);
      toast.success('Attraction supprimée avec succès !');
      setAttractions(attractions.filter((a) => a.id !== attractionToDelete.id));
      setDeleteDialogOpen(false);
      setAttractionToDelete(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'attraction';
      setDeleteError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setAttractionToDelete(null);
    }
  };

  const handleCreateSuccess = async () => {
    setCreateModalOpen(false);
    // Rafraîchir la liste
    try {
      const filters: AttractionFilters = {
        search: search || undefined,
        categoryId: categoryFilter ? Number(categoryFilter) : undefined,
      };
      const attractionsData = await getAttractions(filters);
      let filtered = attractionsData;
      if (publishedFilter === 'published') {
        filtered = attractionsData.filter((a: any) => a.is_published !== false);
      } else if (publishedFilter === 'draft') {
        filtered = attractionsData.filter((a: any) => a.is_published === false);
      }
      setAttractions(filtered);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la récupération des attractions';
      setError(message);
    }
  };

  const handleUpdateSuccess = async () => {
    setEditModalOpen(false);
    setSelectedAttraction(null);
    // Rafraîchir la liste
    try {
      const filters: AttractionFilters = {
        search: search || undefined,
        categoryId: categoryFilter ? Number(categoryFilter) : undefined,
      };
      const attractionsData = await getAttractions(filters);
      let filtered = attractionsData;
      if (publishedFilter === 'published') {
        filtered = attractionsData.filter((a: any) => a.is_published !== false);
      } else if (publishedFilter === 'draft') {
        filtered = attractionsData.filter((a: any) => a.is_published === false);
      }
      setAttractions(filtered);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la récupération des attractions';
      setError(message);
    }
  };

  const handleSearch = () => {
    setSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearch('');
    setCategoryFilter('');
    setPublishedFilter('');
    setSortBy('created_desc');
  };

  const hasActiveFilters = search || categoryFilter || publishedFilter;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.5rem', md: '2rem' },
              mb: 1,
              color: colors.white,
            }}
          >
            Gestion des attractions
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: colors.secondaryGrey,
              mb: 2,
            }}
          >
            Créez, modifiez et gérez toutes les attractions du parc Zombieland. Total : {attractions.length} attraction{attractions.length > 1 ? 's' : ''}
          </Typography>
        </Box>
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
          }}
        >
          Nouvelle attraction
        </Button>
      </Box>

      {/* Barre de recherche */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher une attraction..."
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
                borderColor: colors.primaryGreen,
              },
            },
          }}
          sx={{ mb: 2 }}
        />

        {/* Filtres */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth sx={{ minWidth: '200px' }}>
              <InputLabel sx={{ color: colors.secondaryGrey }}>Catégorie</InputLabel>
              <Select
                value={categoryFilter}
                label="Catégorie"
                onChange={(e) => setCategoryFilter(e.target.value as number | '')}
                sx={{
                  backgroundColor: colors.secondaryDark,
                  color: colors.white,
                  minHeight: '56px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.secondaryGrey,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primaryGreen,
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
                          backgroundColor: `${colors.primaryGreen}20`,
                        },
                        '&.Mui-selected': {
                          backgroundColor: `${colors.primaryGreen}40`,
                          '&:hover': {
                            backgroundColor: `${colors.primaryGreen}60`,
                          },
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">Toutes</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth sx={{ minWidth: '200px' }}>
              <InputLabel sx={{ color: colors.secondaryGrey }}>Statut</InputLabel>
              <Select
                value={publishedFilter}
                label="Statut"
                onChange={(e) => setPublishedFilter(e.target.value)}
                sx={{
                  backgroundColor: colors.secondaryDark,
                  color: colors.white,
                  minHeight: '56px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.secondaryGrey,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primaryGreen,
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
                          backgroundColor: `${colors.primaryGreen}20`,
                        },
                        '&.Mui-selected': {
                          backgroundColor: `${colors.primaryGreen}40`,
                          '&:hover': {
                            backgroundColor: `${colors.primaryGreen}60`,
                          },
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="published">Publiées</MenuItem>
                <MenuItem value="draft">Brouillons</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleResetFilters}
              disabled={!hasActiveFilters}
              sx={{
                height: '56px',
                borderColor: colors.secondaryGrey,
                color: colors.white,
                '&:hover': {
                  borderColor: colors.primaryGreen,
                  backgroundColor: `${colors.primaryGreen}20`,
                },
                '&:disabled': {
                  borderColor: colors.secondaryGrey,
                  color: colors.secondaryGrey,
                },
              }}
            >
              Réinitialiser
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Filtre de tri */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl sx={{ minWidth: '250px' }}>
          <InputLabel sx={{ color: colors.secondaryGrey }}>Trier par</InputLabel>
          <Select
            value={sortBy}
            label="Trier par"
            onChange={(e) => setSortBy(e.target.value)}
            sx={{
              backgroundColor: colors.secondaryDark,
              color: colors.white,
              minHeight: '56px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.secondaryGrey,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primaryGreen,
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
                      backgroundColor: `${colors.primaryGreen}20`,
                    },
                    '&.Mui-selected': {
                      backgroundColor: `${colors.primaryGreen}40`,
                      '&:hover': {
                        backgroundColor: `${colors.primaryGreen}60`,
                      },
                    },
                  },
                },
              },
            }}
          >
            <MenuItem value="created_desc">Date création (récent)</MenuItem>
            <MenuItem value="created_asc">Date création (ancien)</MenuItem>
            <MenuItem value="updated_desc">Dernière modification (récent)</MenuItem>
            <MenuItem value="updated_asc">Dernière modification (ancien)</MenuItem>
            <MenuItem value="name_asc">Nom (A-Z)</MenuItem>
            <MenuItem value="name_desc">Nom (Z-A)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Liste des attractions */}
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
            <CircularProgress sx={{ color: colors.primaryGreen }} size={60} />
            <Typography variant="body1" sx={{ color: colors.white }}>
              Chargement des attractions...
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
        ) : attractions.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
            }}
          >
            <Typography variant="body1" sx={{ color: colors.white }}>
              Aucune attraction trouvée.
            </Typography>
          </Box>
        ) : (
          <Fade in={!isLoading} timeout={500}>
            <Box>
              <Grid container spacing={2}>
                {attractions.map((attraction) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={attraction.id}>
                    <AttractionCard
                      attraction={attraction}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onClick={handleViewDetails}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        )}
      </Box>

      {/* Modals */}
      <CreateAttractionModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <UpdateAttractionModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedAttraction(null);
        }}
        attraction={selectedAttraction}
        onUpdateSuccess={handleUpdateSuccess}
      />

      <AttractionDetailsModal
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedAttraction(null);
        }}
        attraction={selectedAttraction}
      />

      <DeleteAttractionModal
        deleteDialogOpen={deleteDialogOpen}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        handleConfirmDelete={handleConfirmDelete}
        attractionToDelete={attractionToDelete}
        isDeleting={isDeleting}
        error={deleteError}
        success={deleteSuccess}
      />
    </Box>
  );
};
