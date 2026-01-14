import { Box, Modal, Typography, Chip, Stack } from '@mui/material';
import { colors } from '../../../theme';
import type { Activity } from '../../../@types/activity';
import { resolveImageUrl, DEFAULT_ACTIVITY_IMAGE } from '../../../utils/imageUtils.ts';

interface ActivityDetailsModalProps {
  open: boolean;
  onClose: () => void;
  activity: Activity | null;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600 },
  maxHeight: '90vh',
  overflow: 'auto',
  bgcolor: colors.secondaryDark,
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

export const ActivityDetailsModal = ({
  open,
  onClose,
  activity,
}: ActivityDetailsModalProps) => {
  if (!activity) return null;

  const image = resolveImageUrl(activity.image_url, DEFAULT_ACTIVITY_IMAGE);
  const isPublished = (activity as any).is_published !== false;

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
          Détails de l'activité
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              width: '100%',
              height: '300px',
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 2,
              mb: 2,
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip
              label={activity.category?.name || 'Activité'}
              sx={{
                backgroundColor: colors.primaryGreen,
                color: colors.secondaryDark,
                fontWeight: 600,
              }}
            />
            {!isPublished && (
              <Chip
                label="Brouillon"
                sx={{
                  backgroundColor: colors.warning,
                  color: colors.secondaryDark,
                  fontWeight: 600,
                }}
              />
            )}
          </Stack>

          <Typography
            variant="h4"
            sx={{
              mb: 2,
              color: colors.white,
              fontWeight: 600,
            }}
          >
            {activity.name}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 3,
              color: colors.secondaryGrey,
              lineHeight: 1.6,
            }}
          >
            {activity.description}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            backgroundColor: colors.secondaryDarkAlt,
            borderRadius: 2,
            mb: 2,
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
            {activity.thrill_level && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: colors.secondaryGrey }}>Niveau de frisson:</Typography>
                <Typography sx={{ color: colors.white, fontWeight: 600 }}>
                  {activity.thrill_level}/5
                </Typography>
              </Box>
            )}

            {activity.duration && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: colors.secondaryGrey }}>Durée:</Typography>
                <Typography sx={{ color: colors.white, fontWeight: 600 }}>
                  {activity.duration} minutes
                </Typography>
              </Box>
            )}

            {(activity as any).min_age && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: colors.secondaryGrey }}>Âge minimum:</Typography>
                <Typography sx={{ color: colors.white, fontWeight: 600 }}>
                  {(activity as any).min_age} ans
                </Typography>
              </Box>
            )}

            {(activity as any).accessibility && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: colors.secondaryGrey }}>Accessibilité:</Typography>
                <Typography sx={{ color: colors.white, fontWeight: 600 }}>
                  {(activity as any).accessibility}
                </Typography>
              </Box>
            )}

            {activity.attraction && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: colors.secondaryGrey }}>Attraction liée:</Typography>
                <Typography sx={{ color: colors.white, fontWeight: 600 }}>
                  {activity.attraction.name}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>

        {(activity as any).related_activities && (activity as any).related_activities.length > 0 && (
          <Box
            sx={{
              p: 2,
              backgroundColor: colors.secondaryDarkAlt,
              borderRadius: 2,
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
              Activités liées
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {(activity as any).related_activities.map((rel: any) => (
                <Chip
                  key={rel.id}
                  label={rel.name || `Activité #${rel.id}`}
                  sx={{
                    backgroundColor: colors.secondaryGrey,
                    color: colors.white,
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Modal>
  );
};
