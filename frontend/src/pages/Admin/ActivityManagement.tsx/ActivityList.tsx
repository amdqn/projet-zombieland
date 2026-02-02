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
import type { Activity } from '../../../@types/activity';
import { getActivities, deleteActivity, type ActivityFilters } from '../../../services/activities';
import { getCategories } from '../../../services/categories';
import type { Category } from '../../../@types/categorie';
import { ActivityCard } from '../../../components/cards/Activity/ActivityCard.tsx';
import { CreateActivityModal } from '../../../components/modals/Activity/CreateActivityModal.tsx';
import { UpdateActivityModal } from '../../../components/modals/Activity/UpdateActivityModal.tsx';
import { ActivityDetailsModal } from '../../../components/modals/Activity/ActivityDetailsModal.tsx';
import { DeleteActivityModal } from '../../../components/modals/Activity/DeleteActivityModal.tsx';
import { useTranslation } from 'react-i18next';

export const ActivityList = () => {
  const { t } = useTranslation();
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

        // Trier les activités
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

        setActivities(sorted);
      } catch (err) {
        const message = err instanceof Error ? err.message : t('admin.activities.errorLoading');
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
      toast.success(t('admin.activities.successDelete'));
      setActivities(activities.filter((a) => a.id !== activityToDelete.id));
      setDeleteDialogOpen(false);
      setActivityToDelete(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('admin.activities.errorDelete');
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
            {t('admin.activities.title')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: colors.secondaryGrey,
              mb: 2,
            }}
          >
            {t('admin.activities.description', { count: activities.length })}
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
          {t('admin.activities.createButton')}
        </Button>
      </Box>

      {/* Barre de recherche */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('admin.activities.searchPlaceholder')}
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
              <InputLabel sx={{ color: colors.secondaryGrey }}>{t('admin.activities.filterCategory')}</InputLabel>
              <Select
                value={categoryFilter}
                label={t('admin.activities.filterCategory')}
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
                <MenuItem value="">{t('admin.activities.allCategories')}</MenuItem>
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
              <InputLabel sx={{ color: colors.secondaryGrey }}>{t('admin.activities.filterPublished')}</InputLabel>
              <Select
                value={publishedFilter}
                label={t('admin.activities.filterPublished')}
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
                <MenuItem value="">{t('admin.activities.allStatus')}</MenuItem>
                <MenuItem value="published">{t('admin.activities.published')}</MenuItem>
                <MenuItem value="draft">{t('admin.activities.draft')}</MenuItem>
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
              {t('admin.activities.resetFilters')}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Filtre de tri */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl sx={{ minWidth: '250px' }}>
          <InputLabel sx={{ color: colors.secondaryGrey }}>{t('admin.activities.sortBy')}</InputLabel>
          <Select
            value={sortBy}
            label={t('admin.activities.sortBy')}
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
            <MenuItem value="created_desc">{t('admin.activities.sortOptions.createdDesc')}</MenuItem>
            <MenuItem value="created_asc">{t('admin.activities.sortOptions.createdAsc')}</MenuItem>
            <MenuItem value="updated_desc">{t('admin.activities.sortOptions.updatedDesc')}</MenuItem>
            <MenuItem value="updated_asc">{t('admin.activities.sortOptions.updatedAsc')}</MenuItem>
            <MenuItem value="name_asc">{t('admin.activities.sortOptions.nameAsc')}</MenuItem>
            <MenuItem value="name_desc">{t('admin.activities.sortOptions.nameDesc')}</MenuItem>
          </Select>
        </FormControl>
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
              {t('admin.activities.loading')}
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
              {t('admin.activities.errorLoading')}: {error}
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
              {t('admin.activities.noActivities')}
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
