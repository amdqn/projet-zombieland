import { Box, Card, CardContent, Chip, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { colors } from '../../../theme';
import type { Activity } from '../../../@types/activity';
import { resolveImageUrl, DEFAULT_ACTIVITY_IMAGE } from '../../../utils/imageUtils.ts';
import { useTranslation } from 'react-i18next';

const StyledActivityCard = styled(Card)(({ theme }) => ({
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

interface ActivityCardProps {
  activity: Activity;
  onEdit?: (activity: Activity) => void;
  onDelete?: (activity: Activity) => void;
  onClick?: (activity: Activity) => void;
}

export const ActivityCard = ({ activity, onEdit, onDelete, onClick }: ActivityCardProps) => {
  const { t } = useTranslation();
  const image = resolveImageUrl(activity.image_url, DEFAULT_ACTIVITY_IMAGE);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(activity);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(activity);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(activity);
    }
  };

  const isPublished = (activity as any).is_published !== false;

  return (
    <StyledActivityCard onClick={handleCardClick}>
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
          label={activity.category?.name || 'Activité'}
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
          {activity.name}
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
          {activity.description}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          {activity.thrill_level && (
            <Chip
              label={`${t('cards.thrill')}: ${activity.thrill_level}/5`}
              size="small"
              sx={{
                backgroundColor: colors.secondaryDarkAlt,
                color: colors.white,
                fontSize: '0.75rem',
              }}
            />
          )}
          {activity.duration && (
            <Chip
              label={`${activity.duration} min`}
              size="small"
              sx={{
                backgroundColor: colors.secondaryDarkAlt,
                color: colors.white,
                fontSize: '0.75rem',
              }}
            />
          )}
          {(activity as any).related_activities && (activity as any).related_activities.length > 0 && (
            <Chip
              label={`${(activity as any).related_activities.length} activité(s) liée(s)`}
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
    </StyledActivityCard>
  );
};
