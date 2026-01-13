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
import { useEffect, useState, useRef } from 'react';
import type { Activity } from '../../../@types/activity';
import { getActivities, deleteActivity, type ActivityFilters } from '../../../services/activities';
import { getCategories } from '../../../services/categories';
import type { Category } from '../../../@types/categorie';
import { ActivityCard } from '../../../components/cards/ActivityCard';
import { CreateActivityModal } from '../../../components/modals/CreateActivityModal';
import { UpdateActivityModal } from '../../../components/modals/UpdateActivityModal';
import { ActivityDetailsModal } from '../../../components/modals/ActivityDetailsModal';
import { DeleteActivityModal } from '../../../components/modals/DeleteActivityModal';

export const ActivityList = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | ''>('');
  const [publishedFilter, setPublishedFilter] = useState<string>('');
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
        const filters: ActivityFilters = {
          search: search || undefined,
          categoryId: categoryFilter ? Number(categoryFilter) : undefined,
        };

        const activitiesData = await getActivities(filters);
        // Filtrer par statut de publication côté client si nécessaire
        let filtered = activitiesData;
        if (publishedFilter === 'published') {
          filtered = activitiesData.filter((a: any) => a.is_published !== false);
        } else if (publishedFilter === 'draft') {
          filtered = activitiesData.filter((a: any) => a.is_published === false);
        }
        setActivities(filtered);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors de la récupération des activités';
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
  }, [search, categoryFilter, publishedFilter]);

  const handleCreate = () => {
    setCreateModalOpen(true);
  };

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setEditModalOpen(true);
  };

  const handleDelete = (activity: Activity) => {
    if (editModalOpen) {
      setEditModalOpen(false);
      setSelectedActivity(null);
    }
    setActivityToDelete(activity);
    setDeleteDialogOpen(true);
    setDeleteError(null);
  };

  const handleViewDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setDetailsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!activityToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);
    setDeleteSuccess(null);
    try {
      await deleteActivity(activityToDelete.id);
      setDeleteSuccess('Activité supprimée avec succès');
      setActivities(activities.filter((a) => a.id !== activityToDelete.id));
      setTimeout(() => {
        setDeleteDialogOpen(false);
        setActivityToDelete(null);
        setDeleteSuccess(null);
      }, 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'activité';
      setDeleteError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setActivityToDelete(null);
    }
  };

  const handleCreateSuccess = async () => {
    setCreateModalOpen(false);
    // Rafraîchir la liste
    try {
      const filters: ActivityFilters = {
        search: search || undefined,
        categoryId: categoryFilter ? Number(categoryFilter) : undefined,
      };
      const activitiesData = await getActivities(filters);
      let filtered = activitiesData;
      if (publishedFilter === 'published') {
        filtered = activitiesData.filter((a: any) => a.is_published !== false);
      } else if (publishedFilter === 'draft') {
        filtered = activitiesData.filter((a: any) => a.is_published === false);
      }
      setActivities(filtered);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la récupération des activités';
      setError(message);
    }
  };

  const handleUpdateSuccess = async () => {
    setEditModalOpen(false);
    setSelectedActivity(null);
    // Rafraîchir la liste
    try {
      const filters: ActivityFilters = {
        search: search || undefined,
        categoryId: categoryFilter ? Number(categoryFilter) : undefined,
      };
      const activitiesData = await getActivities(filters);
      let filtered = activitiesData;
      if (publishedFilter === 'published') {
        filtered = activitiesData.filter((a: any) => a.is_published !== false);
      } else if (publishedFilter === 'draft') {
        filtered = activitiesData.filter((a: any) => a.is_published === false);
      }
      setActivities(filtered);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la récupération des activités';
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
            Gestion des activités
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: colors.secondaryGrey,
              mb: 2,
            }}
          >
            Créez, modifiez et gérez toutes les activités du parc Zombieland. Total : {activities.length} activité{activities.length > 1 ? 's' : ''}
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
          Nouvelle activité
        </Button>
      </Box>

      {/* Barre de recherche */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher une activité..."
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

      {/* Liste des activités */}
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
              Chargement des activités...
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
        ) : activities.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
            }}
          >
            <Typography variant="body1" sx={{ color: colors.white }}>
              Aucune activité trouvée.
            </Typography>
          </Box>
        ) : (
          <Fade in={!isLoading} timeout={500}>
            <Box>
              <Grid container spacing={2}>
                {activities.map((activity) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={activity.id}>
                    <ActivityCard
                      activity={activity}
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
      <CreateActivityModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <UpdateActivityModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedActivity(null);
        }}
        activity={selectedActivity}
        onUpdateSuccess={handleUpdateSuccess}
      />

      <ActivityDetailsModal
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedActivity(null);
        }}
        activity={selectedActivity}
      />

      <DeleteActivityModal
        deleteDialogOpen={deleteDialogOpen}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        handleConfirmDelete={handleConfirmDelete}
        activityToDelete={activityToDelete}
        isDeleting={isDeleting}
        error={deleteError}
        success={deleteSuccess}
      />
    </Box>
  );
};
