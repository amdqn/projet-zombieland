import { Box, Modal, Typography, Chip, Stack } from '@mui/material';
import { colors } from '../../theme';
import type { Attraction } from '../../@types/attraction';
import { resolveImageUrl, DEFAULT_ACTIVITY_IMAGE } from '../../utils/imageUtils';

interface AttractionDetailsModalProps {
  open: boolean;
  onClose: () => void;
  attraction: Attraction | null;
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

export const AttractionDetailsModal = ({
  open,
  onClose,
  attraction,
}: AttractionDetailsModalProps) => {
  if (!attraction) return null;

  const image = resolveImageUrl(attraction.image_url, DEFAULT_ACTIVITY_IMAGE);

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
          Détails de l'attraction
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
              label={attraction.category?.name || 'Attraction'}
              sx={{
                backgroundColor: colors.primaryGreen,
                color: colors.secondaryDark,
                fontWeight: 600,
              }}
            />
            <Chip
              label={attraction.is_published ? 'Publiée' : 'Brouillon'}
              sx={{
                backgroundColor: attraction.is_published ? colors.primaryGreen : colors.secondaryGrey,
                color: colors.white,
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
            {attraction.name}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 3,
              color: colors.secondaryGrey,
              lineHeight: 1.6,
            }}
          >
            {attraction.description}
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
            {attraction.thrill_level && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: colors.secondaryGrey }}>Niveau de frisson:</Typography>
                <Typography sx={{ color: colors.white, fontWeight: 600 }}>
                  {attraction.thrill_level}/5
                </Typography>
              </Box>
            )}

            {attraction.duration && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: colors.secondaryGrey }}>Durée:</Typography>
                <Typography sx={{ color: colors.white, fontWeight: 600 }}>
                  {attraction.duration} minutes
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>

        {attraction.activities && attraction.activities.length > 0 && (
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
              Activités liées
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {attraction.activities.map((activity: any) => (
                <Chip
                  key={activity.id}
                  label={activity.name || `Activité #${activity.id}`}
                  sx={{
                    backgroundColor: colors.secondaryGrey,
                    color: colors.white,
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {attraction.related_attractions && attraction.related_attractions.length > 0 && (
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
              Attractions similaires
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {attraction.related_attractions.map((relatedAttraction: any) => (
                <Chip
                  key={relatedAttraction.id}
                  label={relatedAttraction.name || `Attraction #${relatedAttraction.id}`}
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
