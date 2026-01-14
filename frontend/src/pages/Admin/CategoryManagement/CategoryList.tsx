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
import { colors } from '../../../theme';
import { useEffect, useState, useRef, useMemo } from 'react';
import { toast } from 'react-toastify';
import type { Category } from '../../../@types/categorie';
import { getCategories, deleteCategory } from '../../../services/categories';
import { CategoryCard } from '../../../components/cards/CategoryCard';
import { CreateCategoryModal } from '../../../components/modals/Categories/CreateCategoryModal';
import { UpdateCategoryModal } from '../../../components/modals/Categories/UpdateCategoryModal';
import { CategoryDetailsModal } from '../../../components/modals/Categories/CategoryDetailsModal';
import { DeleteCategoryModal } from '../../../components/modals/Categories/DeleteCategoryModal';

export const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [usageFilter, setUsageFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name_asc');
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors de la récupération des catégories';
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
  }, []);

  const filteredAndSortedCategories = useMemo(() => {
    let filtered = categories;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchLower) || cat.description.toLowerCase().includes(searchLower),
      );
    }

    // Usage filter
    if (usageFilter === 'used') {
      filtered = filtered.filter(
        (cat) => (cat._count?.activities || 0) > 0 || (cat._count?.attractions || 0) > 0,
      );
    } else if (usageFilter === 'unused') {
      filtered = filtered.filter(
        (cat) => (cat._count?.activities || 0) === 0 && (cat._count?.attractions || 0) === 0,
      );
    }

    // Sort
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
        case 'usage_desc': {
          const usageA = (a._count?.activities || 0) + (a._count?.attractions || 0);
          const usageB = (b._count?.activities || 0) + (b._count?.attractions || 0);
          return usageB - usageA;
        }
        case 'usage_asc': {
          const usageA = (a._count?.activities || 0) + (a._count?.attractions || 0);
          const usageB = (b._count?.activities || 0) + (b._count?.attractions || 0);
          return usageA - usageB;
        }
        default:
          return 0;
      }
    });

    return sorted;
  }, [categories, search, usageFilter, sortBy]);

  const handleCreate = () => {
    setCreateModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    if (editModalOpen) {
      setEditModalOpen(false);
      setSelectedCategory(null);
    }
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
    setDeleteError(null);
  };

  const handleViewDetails = (category: Category) => {
    setSelectedCategory(category);
    setDetailsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);
    setDeleteSuccess(null);
    try {
      await deleteCategory(categoryToDelete.id);
      toast.success('Catégorie supprimée avec succès !');
      setDeleteSuccess('Catégorie supprimée avec succès');
      setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
      setTimeout(() => {
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
        setDeleteSuccess(null);
      }, 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la suppression de la catégorie";
      setDeleteError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const refreshCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la récupération des catégories';
      setError(message);
    }
  };

  const handleCreateSuccess = async () => {
    setCreateModalOpen(false);
    await refreshCategories();
  };

  const handleUpdateSuccess = async () => {
    setEditModalOpen(false);
    setSelectedCategory(null);
    await refreshCategories();
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
    setUsageFilter('');
    setSortBy('name_asc');
  };

  const hasActiveFilters = search || usageFilter || sortBy !== 'name_asc';

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
            Gestion des catégories
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: colors.secondaryGrey,
              mb: 2,
            }}
          >
            Créez, modifiez et gérez toutes les catégories du parc Zombieland. Total : {filteredAndSortedCategories.length} catégorie{filteredAndSortedCategories.length > 1 ? 's' : ''}
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
          Nouvelle catégorie
        </Button>
      </Box>

      {/* Barre de recherche */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher une catégorie..."
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
              <InputLabel sx={{ color: colors.secondaryGrey }}>Utilisation</InputLabel>
              <Select
                value={usageFilter}
                label="Utilisation"
                onChange={(e) => setUsageFilter(e.target.value)}
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
                <MenuItem value="used">Utilisées</MenuItem>
                <MenuItem value="unused">Non utilisées</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth sx={{ minWidth: '200px' }}>
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
                <MenuItem value="name_asc">Alphabétique (A-Z)</MenuItem>
                <MenuItem value="name_desc">Alphabétique (Z-A)</MenuItem>
                <MenuItem value="created_desc">Date création (récent)</MenuItem>
                <MenuItem value="created_asc">Date création (ancien)</MenuItem>
                <MenuItem value="usage_desc">Utilisation (décroissant)</MenuItem>
                <MenuItem value="usage_asc">Utilisation (croissant)</MenuItem>
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

      {/* Liste des catégories */}
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
              Chargement des catégories...
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
        ) : filteredAndSortedCategories.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
            }}
          >
            <Typography variant="body1" sx={{ color: colors.white }}>
              Aucune catégorie trouvée.
            </Typography>
          </Box>
        ) : (
          <Fade in={!isLoading} timeout={500}>
            <Box>
              <Grid container spacing={2}>
                {filteredAndSortedCategories.map((category) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category.id}>
                    <CategoryCard
                      category={category}
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
      <CreateCategoryModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <UpdateCategoryModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        onUpdateSuccess={handleUpdateSuccess}
      />

      <CategoryDetailsModal
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DeleteCategoryModal
        deleteDialogOpen={deleteDialogOpen}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        handleConfirmDelete={handleConfirmDelete}
        categoryToDelete={categoryToDelete}
        isDeleting={isDeleting}
        error={deleteError}
        success={deleteSuccess}
      />
    </Box>
  );
};
