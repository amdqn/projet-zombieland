import { Box, Card, CardContent, Chip, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { colors } from '../../theme';
import type { Attraction } from '../../@types/attraction';
import { resolveImageUrl, DEFAULT_ACTIVITY_IMAGE } from '../../utils/imageUtils';
import { useTranslation } from 'react-i18next';

const StyledAttractionCard = styled(Card)(({ theme }) => ({
  backgroundColor: colors.secondaryDark,
  border: `1px solid ${colors.secondaryGrey}`,
  height: '100%',
  minWidth: '280px',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    borderColor: colors.primaryGreen,
    transform: 'translateY(-3px)',
    boxShadow: `0 5px 20px ${colors.primaryGreen}40`,
  },
  '& .MuiCardContent-root': {
    padding: '1.5rem',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: '100%',
  },
}));

interface AttractionCardProps {
  attraction: Attraction;
  onEdit?: (attraction: Attraction) => void;
  onDelete?: (attraction: Attraction) => void;
  onClick?: (attraction: Attraction) => void;
}

export const AttractionCard = ({ attraction, onEdit, onDelete, onClick }: AttractionCardProps) => {
  const { t } = useTranslation();
  const image = resolveImageUrl(attraction.image_url, DEFAULT_ACTIVITY_IMAGE);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(attraction);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(attraction);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(attraction);
    }
  };

  const isPublished = attraction.is_published !== false;

  return (
    <StyledAttractionCard onClick={handleCardClick}>
      {/* Image */}
      <Box
        sx={{
          width: '100%',
          height: '200px',
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        {!isPublished && (
          <Chip
            label="Brouillon"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: colors.warning,
              color: colors.secondaryDark,
              fontWeight: 600,
            }}
          />
        )}
        <Chip
          label={attraction.category?.name || 'Attraction'}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: colors.primaryGreen,
            color: colors.secondaryDark,
            fontWeight: 600,
          }}
        />
      </Box>

      <CardContent>
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            color: colors.white,
            fontWeight: 600,
            fontSize: '1.1rem',
          }}
        >
          {attraction.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: colors.secondaryGrey,
            mb: 2,
            flexGrow: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {attraction.description}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          {attraction.thrill_level && (
            <Chip
              label={`${t('cards.thrill')}: ${attraction.thrill_level}/5`}
              size="small"
              sx={{
                backgroundColor: colors.secondaryDarkAlt,
                color: colors.white,
                fontSize: '0.75rem',
              }}
            />
          )}
          {attraction.duration && (
            <Chip
              label={`${attraction.duration} min`}
              size="small"
              sx={{
                backgroundColor: colors.secondaryDarkAlt,
                color: colors.white,
                fontSize: '0.75rem',
              }}
            />
          )}
          {attraction.activities && attraction.activities.length > 0 && (
            <Chip
              label={`${attraction.activities.length} activité(s)`}
              size="small"
              sx={{
                backgroundColor: colors.primaryGold,
                color: colors.secondaryDark,
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            />
          )}
          {attraction.related_attractions && attraction.related_attractions.length > 0 && (
            <Chip
              label={`${attraction.related_attractions.length} attraction(s) liée(s)`}
              size="small"
              sx={{
                backgroundColor: colors.primaryGold,
                color: colors.secondaryDark,
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            />
          )}
        </Stack>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <IconButton
            size="small"
            aria-label={t('common.view')}
            onClick={handleCardClick}
            sx={{
              color: colors.primaryGreen,
              '&:hover': {
                backgroundColor: `${colors.primaryGreen}20`,
              },
            }}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            size="small"
            aria-label={t('common.edit')}
            onClick={handleEdit}
            sx={{
              color: colors.primaryGreen,
              '&:hover': {
                backgroundColor: `${colors.primaryGreen}20`,
              },
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            aria-label={t('common.delete')}
            onClick={handleDelete}
            sx={{
              color: colors.primaryRed,
              '&:hover': {
                backgroundColor: `${colors.primaryRed}20`,
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      </CardContent>
    </StyledAttractionCard>
  );
};
