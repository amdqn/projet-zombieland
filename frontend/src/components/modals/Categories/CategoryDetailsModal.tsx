import { Box, Modal, Typography, Chip, Stack, Button, CircularProgress, Grid, Card, CardContent } from '@mui/material';
import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { colors } from '../../../theme';
import type { Category } from '../../../@types/categorie';
import { getCategoryById } from '../../../services/categories';
import { resolveImageUrl, DEFAULT_ACTIVITY_IMAGE } from '../../../utils/imageUtils';

interface CategoryDetailsModalProps {
  open: boolean;
  onClose: () => void;
  category: Category | null;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
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

export const CategoryDetailsModal = ({
  open,
  onClose,
  category,
  onEdit,
  onDelete,
}: CategoryDetailsModalProps) => {
  const [detailedCategory, setDetailedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && category) {
      const fetchDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const details = await getCategoryById(category.id);
          setDetailedCategory(details);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Erreur lors du chargement des détails';
          setError(message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    }
  }, [open, category]);

  const handleEdit = () => {
    if (detailedCategory && onEdit) {
      onEdit(detailedCategory);
    }
  };

  const handleDelete = () => {
    if (detailedCategory && onDelete) {
      onDelete(detailedCategory);
    }
  };

  if (!category) return null;

  const activitiesCount = detailedCategory?._count?.activities || category._count?.activities || 0;
  const attractionsCount = detailedCategory?._count?.attractions || category._count?.attractions || 0;

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
          Détails de la catégorie
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
                  label={`${activitiesCount} activité${activitiesCount > 1 ? 's' : ''}`}
                  sx={{
                    backgroundColor: activitiesCount > 0 ? colors.primaryGreen : colors.secondaryGrey,
                    color: colors.secondaryDark,
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label={`${attractionsCount} attraction${attractionsCount > 1 ? 's' : ''}`}
                  sx={{
                    backgroundColor: attractionsCount > 0 ? colors.primaryGold : colors.secondaryGrey,
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
                {category.name}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  color: colors.secondaryGrey,
                  lineHeight: 1.6,
                }}
              >
                {category.description}
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
                  <Typography sx={{ color: colors.secondaryGrey }}>Date de création:</Typography>
                  <Typography sx={{ color: colors.white, fontWeight: 600 }}>
                    {new Date(category.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: colors.secondaryGrey }}>Dernière modification:</Typography>
                  <Typography sx={{ color: colors.white, fontWeight: 600 }}>
                    {new Date(category.updated_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Related Activities */}
            {detailedCategory?.activities && detailedCategory.activities.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    color: colors.primaryGreen,
                    fontWeight: 600,
                  }}
                >
                  Activités associées ({detailedCategory.activities.length})
                </Typography>
                <Grid container spacing={2}>
                  {detailedCategory.activities.map((activity) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={activity.id}>
                      <Card
                        sx={{
                          backgroundColor: colors.secondaryDarkAlt,
                          border: `1px solid ${colors.secondaryGrey}`,
                        }}
                      >
                        <Box
                          sx={{
                            width: '100%',
                            height: '120px',
                            backgroundImage: `url(${resolveImageUrl(activity.image_url, DEFAULT_ACTIVITY_IMAGE)})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                        <CardContent>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: colors.white,
                              fontWeight: 600,
                              mb: 0.5,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {activity.name}
                          </Typography>
                          {activity.description && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: colors.secondaryGrey,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                              }}
                            >
                              {activity.description}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Related Attractions */}
            {detailedCategory?.attractions && detailedCategory.attractions.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    color: colors.primaryGold,
                    fontWeight: 600,
                  }}
                >
                  Attractions associées ({detailedCategory.attractions.length})
                </Typography>
                <Grid container spacing={2}>
                  {detailedCategory.attractions.map((attraction) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={attraction.id}>
                      <Card
                        sx={{
                          backgroundColor: colors.secondaryDarkAlt,
                          border: `1px solid ${colors.secondaryGrey}`,
                        }}
                      >
                        <Box
                          sx={{
                            width: '100%',
                            height: '120px',
                            backgroundImage: `url(${resolveImageUrl(attraction.image_url, DEFAULT_ACTIVITY_IMAGE)})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                        <CardContent>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: colors.white,
                              fontWeight: 600,
                              mb: 0.5,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {attraction.name}
                          </Typography>
                          {attraction.description && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: colors.secondaryGrey,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                              }}
                            >
                              {attraction.description}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
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
