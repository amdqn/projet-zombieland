import { Box, Modal, Typography, Chip, Stack, Button, CircularProgress, Card, CardContent } from '@mui/material';
import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import { colors } from '../../../theme';
import type { User } from '../../../@types/users';
import { getUserById, getUserReservations, getUserAuditLogs, type UserAuditLog } from '../../../services/users';

interface UserDetailsModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 700 },
  maxHeight: '90vh',
  overflow: 'auto',
  bgcolor: colors.secondaryDark,
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

export const UserDetailsModal = ({
  open,
  onClose,
  user,
  onEdit,
  onDelete,
}: UserDetailsModalProps) => {
  const [detailedUser, setDetailedUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<UserAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && user) {
      const fetchDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const details = await getUserById(user.id);
          setDetailedUser(details);
          const userReservations = await getUserReservations(user.id);
          setReservations(userReservations);
          const logs = await getUserAuditLogs(user.id);
          setAuditLogs(logs);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Erreur lors du chargement des détails';
          setError(message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    }
  }, [open, user]);

  const handleEdit = () => {
    if (detailedUser && onEdit) {
      onEdit(detailedUser);
    }
  };

  const handleDelete = () => {
    if (detailedUser && onDelete) {
      onDelete(detailedUser);
    }
  };

  if (!user) return null;

  const userData = detailedUser || user;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title">
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h5"
          component="h2"
          sx={{
            mb: 3,
            color: colors.primaryGreen,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Détails de l'utilisateur
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: colors.primaryGreen }} />
          </Box>
        ) : error ? (
          <Box sx={{ py: 4 }}>
            <Typography sx={{ color: colors.primaryRed, textAlign: 'center' }}>
              {error}
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip
                  label={userData.role}
                  sx={{
                    backgroundColor: userData.role === 'ADMIN' ? colors.primaryRed : colors.primaryGreen,
                    color: colors.secondaryDark,
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label={`${reservations.length} réservation${reservations.length > 1 ? 's' : ''}`}
                  sx={{
                    backgroundColor: colors.primaryGold,
                    color: colors.secondaryDark,
                    fontWeight: 600,
                  }}
                />
              </Stack>

              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                  color: colors.white,
                  fontWeight: 600,
                }}
              >
                {userData.pseudo}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  color: colors.secondaryGrey,
                  lineHeight: 1.6,
                }}
              >
                {userData.email}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                backgroundColor: colors.secondaryDarkAlt,
                borderRadius: 2,
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: colors.primaryGreen,
                  fontWeight: 600,
                }}
              >
                Informations
              </Typography>

              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: colors.secondaryGrey }}>Date d'inscription:</Typography>
                  <Typography sx={{ color: colors.white, fontWeight: 600 }}>
                    {new Date(userData.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: colors.secondaryGrey }}>Dernière modification:</Typography>
                  <Typography sx={{ color: colors.white, fontWeight: 600 }}>
                    {new Date(userData.updated_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Réservations */}
            {reservations.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    color: colors.primaryGreen,
                    fontWeight: 600,
                  }}
                >
                  Réservations ({reservations.length})
                </Typography>
                <Stack spacing={2}>
                  {reservations.map((reservation) => (
                    <Card
                      key={reservation.id}
                      sx={{
                        backgroundColor: colors.secondaryDarkAlt,
                        border: `1px solid ${colors.secondaryGrey}`,
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: colors.white,
                            fontWeight: 600,
                            mb: 1,
                          }}
                        >
                          Réservation #{reservation.id}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: colors.secondaryGrey,
                          }}
                        >
                          Date: {reservation.date?.jour ? new Date(reservation.date.jour).toLocaleDateString('fr-FR') : 'N/A'}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: colors.secondaryGrey,
                          }}
                        >
                          Statut: {reservation.status}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Historique des modifications */}
            {auditLogs.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    color: colors.primaryGreen,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <HistoryIcon />
                  Historique des modifications ({auditLogs.length})
                </Typography>
                <Stack spacing={1.5}>
                  {auditLogs.map((log) => {
                    const getActionLabel = (action: string) => {
                      switch (action) {
                        case 'UPDATE':
                          return 'Modification';
                        case 'ACTIVATE':
                          return 'Activation';
                        case 'DEACTIVATE':
                          return 'Désactivation';
                        case 'DELETE':
                          return 'Suppression';
                        default:
                          return action;
                      }
                    };

                    const getFieldLabel = (field: string | null) => {
                      switch (field) {
                        case 'pseudo':
                          return 'Pseudo';
                        case 'email':
                          return 'Email';
                        case 'role':
                          return 'Rôle';
                        case 'is_active':
                          return 'Statut';
                        default:
                          return field || 'N/A';
                      }
                    };

                    const parseValue = (value: string | null, fieldName: string | null) => {
                      if (!value) return 'N/A';
                      try {
                        const parsed = JSON.parse(value);
                        // Pour is_active, afficher un label lisible
                        if (fieldName === 'is_active') {
                          return parsed === true || parsed === 'true' ? 'Actif' : 'Inactif';
                        }
                        return parsed;
                      } catch {
                        return value;
                      }
                    };

                    return (
                      <Card
                        key={log.id}
                        sx={{
                          backgroundColor: colors.secondaryDarkAlt,
                          border: `1px solid ${colors.secondaryGrey}`,
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: colors.primaryGreen,
                                fontWeight: 600,
                              }}
                            >
                              {getActionLabel(log.action)}
                              {log.field_name && ` - ${getFieldLabel(log.field_name)}`}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: colors.secondaryGrey,
                              }}
                            >
                              {new Date(log.created_at).toLocaleString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Typography>
                          </Box>
                          {log.field_name && (
                            <Box sx={{ mt: 1 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: colors.secondaryGrey,
                                  mb: 0.5,
                                }}
                              >
                                <strong style={{ color: colors.white }}>Ancienne valeur:</strong> {parseValue(log.old_value, log.field_name)}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: colors.secondaryGrey,
                                }}
                              >
                                <strong style={{ color: colors.white }}>Nouvelle valeur:</strong> {parseValue(log.new_value, log.field_name)}
                              </Typography>
                            </Box>
                          )}
                          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: `1px solid ${colors.secondaryGrey}` }}>
                            <Typography
                              variant="caption"
                              sx={{
                                color: colors.secondaryGrey,
                                fontStyle: 'italic',
                              }}
                            >
                              Modifié par: {log.modified_by?.pseudo || 'N/A'} ({log.modified_by?.email || 'N/A'})
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Stack>
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
              <Button
                onClick={onClose}
                variant="outlined"
                sx={{
                  color: colors.white,
                  borderColor: colors.secondaryGrey,
                  '&:hover': {
                    borderColor: colors.primaryGreen,
                    backgroundColor: `${colors.primaryGreen}20`,
                  },
                }}
              >
                Fermer
              </Button>
              {onEdit && (
                <Button
                  onClick={handleEdit}
                  variant="contained"
                  startIcon={<EditIcon />}
                  sx={{
                    backgroundColor: colors.primaryGreen,
                    color: colors.secondaryDark,
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: colors.primaryGreen,
                      opacity: 0.9,
                    },
                  }}
                >
                  Modifier
                </Button>
              )}
              {onDelete && (
                <Button
                  onClick={handleDelete}
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  sx={{
                    backgroundColor: colors.primaryRed,
                    color: colors.white,
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: colors.primaryRed,
                      opacity: 0.9,
                    },
                  }}
                >
                  Supprimer
                </Button>
              )}
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};
