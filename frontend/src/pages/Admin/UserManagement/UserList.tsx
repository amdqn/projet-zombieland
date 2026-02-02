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
  Fade,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Tooltip,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from 'react-toastify';
import { colors } from '../../../theme';
import { useEffect, useState, useRef } from 'react';
import type { User } from '../../../@types/users';
import { getUsers, updateUser, deleteUser, getUserReservations, type UserFilters } from '../../../services/users';
import { UpdateUserModal } from '../../../components/modals/Users/UpdateUserModal';
import { UserDetailsModal } from '../../../components/modals/Users/UserDetailsModal';
import { DeleteUserModal } from '../../../components/modals/Users/DeleteUserModal';
import { useTranslation } from 'react-i18next';

export const UserList = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return t('admin.users.admin');
      case 'CLIENT':
        return t('admin.users.client');
      default:
        return role;
    }
  };
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ADMIN' | 'CLIENT' | ''>('');
  const [sortBy, setSortBy] = useState('created_desc');
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const filters: UserFilters = {
          search: search || undefined,
          role: roleFilter || undefined,
        };

        const response = await getUsers(filters, page, limit);
        setUsers(response.data);
        setTotal(response.total);
        setTotalPages(Math.ceil(response.total / limit));
      } catch (err) {
        const message = err instanceof Error ? err.message : t('admin.users.errorLoading');
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
  }, [search, roleFilter, page, limit]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
    setDeleteError(null);
  };

  const handleViewDetails = async (user: User) => {
    try {
      // Charger les réservations de l'utilisateur
      const reservations = await getUserReservations(user.id);
      setSelectedUser({ ...user, reservations } as any);
      setDetailsModalOpen(true);
    } catch (err) {
      toast.error(t('admin.users.errorDetails'));
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteUser(userToDelete.id);
      toast.success(t('admin.users.successDelete'));
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      // Réajuster la page si nécessaire
      if (users.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t('admin.users.errorDelete');
      setDeleteError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleUpdateSuccess = async () => {
    setEditModalOpen(false);
    setSelectedUser(null);
    // Rafraîchir la liste
    try {
      const filters: UserFilters = {
        search: search || undefined,
        role: roleFilter || undefined,
      };
      const response = await getUsers(filters, page, limit);
      setUsers(response.data);
      setTotal(response.total);
      setTotalPages(Math.ceil(response.total / limit));
    } catch (err) {
      const message = err instanceof Error ? err.message : t('admin.users.errorLoading');
      setError(message);
    }
  };

  const handleToggleActive = async (user: User) => {
    // Empêcher l'activation/désactivation des admins
    if (user.role === 'ADMIN') {
      toast.error(t('admin.users.errorToggleStatus'));
      return;
    }

    try {
      await updateUser(user.id, { is_active: !user.is_active });
      toast.success(t('admin.users.successToggle', { status: !user.is_active ? t('admin.users.activated') : t('admin.users.deactivated') }));
      // Rafraîchir la liste
      const filters: UserFilters = {
        search: search || undefined,
        role: roleFilter || undefined,
      };
      const response = await getUsers(filters, page, limit);
      setUsers(response.data);
      setTotal(response.total);
      setTotalPages(Math.ceil(response.total / limit));
    } catch (err) {
      const message = err instanceof Error ? err.message : t('admin.users.errorUpdateStatus');
      toast.error(message);
    }
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearch('');
    setRoleFilter('');
    setSortBy('created_desc');
    setPage(1);
  };

  const hasActiveFilters = search || roleFilter || sortBy !== 'created_desc';

  // Trier les utilisateurs côté client
  const sortedUsers = [...users].sort((a, b) => {
    switch (sortBy) {
      case 'name_asc':
        return a.pseudo.localeCompare(b.pseudo);
      case 'name_desc':
        return b.pseudo.localeCompare(a.pseudo);
      case 'email_asc':
        return a.email.localeCompare(b.email);
      case 'email_desc':
        return b.email.localeCompare(a.email);
      case 'created_desc':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'created_asc':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'role_asc':
        return a.role.localeCompare(b.role);
      case 'role_desc':
        return b.role.localeCompare(a.role);
      default:
        return 0;
    }
  });

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
            {t('admin.users.title')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: colors.secondaryGrey,
              mb: 2,
            }}
          >
            {t('admin.users.description', { total })}
          </Typography>
        </Box>
      </Box>

      {/* Barre de recherche */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('admin.users.searchPlaceholder')}
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
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <FormControl fullWidth sx={{ minWidth: '200px' }}>
              <InputLabel sx={{ color: colors.secondaryGrey }}>{t('admin.users.filterRole')}</InputLabel>
              <Select
                value={roleFilter}
                label={t('admin.users.filterRole')}
                onChange={(e) => {
                  setRoleFilter(e.target.value as 'ADMIN' | 'CLIENT' | '');
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
                <MenuItem value="">{t('admin.users.all')}</MenuItem>
                <MenuItem value="ADMIN">{t('admin.users.admin')}</MenuItem>
                <MenuItem value="CLIENT">{t('admin.users.client')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
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
              {t('admin.users.resetFilters')}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Filtre de tri */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl sx={{ minWidth: '250px' }}>
          <InputLabel sx={{ color: colors.secondaryGrey }}>{t('admin.users.sortBy')}</InputLabel>
          <Select
            value={sortBy}
            label={t('admin.users.sortBy')}
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
            <MenuItem value="created_desc">{t('admin.users.sortOptions.createdDesc')}</MenuItem>
            <MenuItem value="created_asc">{t('admin.users.sortOptions.createdAsc')}</MenuItem>
            <MenuItem value="name_asc">{t('admin.users.sortOptions.nameAsc')}</MenuItem>
            <MenuItem value="name_desc">{t('admin.users.sortOptions.nameDesc')}</MenuItem>
            <MenuItem value="email_asc">{t('admin.users.sortOptions.emailAsc')}</MenuItem>
            <MenuItem value="email_desc">{t('admin.users.sortOptions.emailDesc')}</MenuItem>
            <MenuItem value="role_asc">{t('admin.users.sortOptions.roleAsc')}</MenuItem>
            <MenuItem value="role_desc">{t('admin.users.sortOptions.roleDesc')}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Liste des utilisateurs */}
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
              {t('admin.users.loading')}
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
              {t('admin.users.errorLoading')}: {error}
            </Typography>
          </Box>
        ) : sortedUsers.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
            }}
          >
            <Typography variant="body1" sx={{ color: colors.white }}>
              {t('admin.users.noUsers')}
            </Typography>
          </Box>
        ) : (
          <Fade in={!isLoading} timeout={500}>
            <Box>
              {isMobile ? (
                // Version mobile : cartes en colonne
                <Stack spacing={2}>
                  {sortedUsers.map((user) => (
                    <Card
                      key={user.id}
                      sx={{
                        backgroundColor: colors.secondaryDarkAlt,
                        border: `1px solid ${colors.secondaryGrey}`,
                        '&:hover': {
                          borderColor: colors.primaryGreen,
                        },
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{
                                color: colors.white,
                                fontWeight: 600,
                                mb: 0.5,
                              }}
                            >
                              {user.pseudo}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: colors.secondaryGrey,
                              }}
                            >
                              {user.email}
                            </Typography>
                          </Box>
                          <Chip
                            label={getRoleLabel(user.role)}
                            size="small"
                            sx={{
                              backgroundColor: user.role === 'ADMIN' ? colors.primaryRed : colors.primaryGreen,
                              color: colors.secondaryDark,
                              fontWeight: 600,
                            }}
                          />
                        </Box>

                        <Divider sx={{ my: 2, borderColor: colors.secondaryGrey }} />

                        <Stack spacing={1.5}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: colors.secondaryGrey }}>
                              {t('admin.users.mobile.status')}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Tooltip title={user.role === 'ADMIN' ? t('admin.users.errorToggleStatus') : (user.is_active !== false ? t('admin.users.active') : t('admin.users.inactive'))}>
                                <Switch
                                  checked={user.is_active !== false}
                                  onChange={() => handleToggleActive(user)}
                                  disabled={user.role === 'ADMIN'}
                                  size="small"
                                  sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                      color: colors.primaryGreen,
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                      backgroundColor: colors.primaryGreen,
                                    },
                                  }}
                                />
                              </Tooltip>
                              <Chip
                                label={user.is_active !== false ? t('admin.users.active') : t('admin.users.inactive')}
                                size="small"
                                sx={{
                                  backgroundColor: user.is_active !== false ? colors.primaryGreen : colors.primaryRed,
                                  color: colors.secondaryDark,
                                  fontWeight: 600,
                                  minWidth: '60px',
                                }}
                              />
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ color: colors.secondaryGrey }}>
                              {t('admin.users.mobile.registrationDate')}
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.white }}>
                              {new Date(user.created_at).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                              })}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ color: colors.secondaryGrey }}>
                              {t('admin.users.mobile.reservations')}
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.white, fontWeight: 600 }}>
                              {user._count?.reservations || 0}
                            </Typography>
                          </Box>
                        </Stack>

                        <Divider sx={{ my: 2, borderColor: colors.secondaryGrey }} />

                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Tooltip title={t('admin.users.viewDetails')}>
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(user)}
                              sx={{
                                color: colors.primaryGreen,
                                '&:hover': {
                                  backgroundColor: `${colors.primaryGreen}20`,
                                },
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('admin.users.editUser')}>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(user)}
                              sx={{
                                color: colors.primaryGold,
                                '&:hover': {
                                  backgroundColor: `${colors.primaryGold}20`,
                                },
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('admin.users.deleteUser')}>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(user)}
                              sx={{
                                color: colors.primaryRed,
                                '&:hover': {
                                  backgroundColor: `${colors.primaryRed}20`,
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                // Version desktop : tableau
                <TableContainer component={Paper} sx={{ backgroundColor: colors.secondaryDarkAlt, boxShadow: 'none' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: colors.white, fontWeight: 600 }}>{t('admin.users.table.name')}</TableCell>
                        <TableCell sx={{ color: colors.white, fontWeight: 600 }}>{t('admin.users.table.email')}</TableCell>
                        <TableCell sx={{ color: colors.white, fontWeight: 600 }}>{t('admin.users.table.role')}</TableCell>
                        <TableCell sx={{ color: colors.white, fontWeight: 600 }}>{t('admin.users.table.status')}</TableCell>
                        <TableCell sx={{ color: colors.white, fontWeight: 600 }}>{t('admin.users.table.registrationDate')}</TableCell>
                        <TableCell sx={{ color: colors.white, fontWeight: 600 }}>{t('admin.users.table.reservations')}</TableCell>
                        <TableCell sx={{ color: colors.white, fontWeight: 600 }} align="right">{t('admin.users.table.actions')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          sx={{
                            '&:hover': {
                              backgroundColor: `${colors.primaryGreen}10`,
                            },
                          }}
                        >
                          <TableCell sx={{ color: colors.white }}>{user.pseudo}</TableCell>
                          <TableCell sx={{ color: colors.white }}>{user.email}</TableCell>
                          <TableCell>
                            <Chip
                              label={getRoleLabel(user.role)}
                              size="small"
                              sx={{
                                backgroundColor: user.role === 'ADMIN' ? colors.primaryRed : colors.primaryGreen,
                                color: colors.secondaryDark,
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Tooltip title={user.role === 'ADMIN' ? t('admin.users.errorToggleStatus') : (user.is_active !== false ? t('admin.users.active') : t('admin.users.inactive'))}>
                                <Switch
                                  checked={user.is_active !== false}
                                  onChange={() => handleToggleActive(user)}
                                  disabled={user.role === 'ADMIN'}
                                  size="small"
                                  sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                      color: colors.primaryGreen,
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                      backgroundColor: colors.primaryGreen,
                                    },
                                  }}
                                />
                              </Tooltip>
                              <Chip
                                label={user.is_active !== false ? t('admin.users.active') : t('admin.users.inactive')}
                                size="small"
                                sx={{
                                  backgroundColor: user.is_active !== false ? colors.primaryGreen : colors.primaryRed,
                                  color: colors.secondaryDark,
                                  fontWeight: 600,
                                  minWidth: '60px',
                                }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: colors.white }}>
                            {new Date(user.created_at).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </TableCell>
                          <TableCell sx={{ color: colors.white }}>
                            {user._count?.reservations || 0}
                          </TableCell>
                          <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Tooltip title={t('admin.users.viewDetails')}>
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(user)}
                              sx={{
                                color: colors.primaryGreen,
                                '&:hover': {
                                  backgroundColor: `${colors.primaryGreen}20`,
                                },
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('admin.users.editUser')}>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(user)}
                              sx={{
                                color: colors.primaryGold,
                                '&:hover': {
                                  backgroundColor: `${colors.primaryGold}20`,
                                },
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('admin.users.deleteUser')}>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(user)}
                              sx={{
                                color: colors.primaryRed,
                                '&:hover': {
                                  backgroundColor: `${colors.primaryRed}20`,
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

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
                        backgroundColor: colors.primaryGreen,
                        color: colors.secondaryDark,
                      },
                      '& .MuiPaginationItem-root:hover': {
                        backgroundColor: `${colors.primaryGreen}40`,
                      },
                    }}
                  />
                </Box>
              )}
            </Box>
          </Fade>
        )}
      </Box>

      {/* Modals */}
      <UpdateUserModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onUpdateSuccess={handleUpdateSuccess}
      />

      <UserDetailsModal
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DeleteUserModal
        deleteDialogOpen={deleteDialogOpen}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        handleConfirmDelete={handleConfirmDelete}
        userToDelete={userToDelete}
        isDeleting={isDeleting}
        error={deleteError}
      />
    </Box>
  );
};
