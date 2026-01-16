import { Box, Card, CardContent, Chip, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { colors } from '../../theme';
import type { Category } from '../../@types/categorie';
import { useTranslation } from 'react-i18next';

const StyledCategoryCard = styled(Card)(({ theme }) => ({
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

interface CategoryCardProps {
  category: Category;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onClick?: (category: Category) => void;
}

export const CategoryCard = ({ category, onEdit, onDelete, onClick }: CategoryCardProps) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(category);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(category);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(category);
    }
  };

  const activitiesCount = category._count?.activities || 0;
  const attractionsCount = category._count?.attractions || 0;
  const totalUsage = activitiesCount + attractionsCount;

  return (
    <StyledCategoryCard onClick={handleCardClick}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            color: colors.primaryGreen,
            fontWeight: 600,
            fontSize: '1.2rem',
          }}
        >
          {category.name}
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
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            minHeight: '60px',
          }}
        >
          {category.description}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label={activitiesCount > 1 ? t('admin.categories.card.activitiesPlural', { count: activitiesCount }) : t('admin.categories.card.activities', { count: activitiesCount })}
            size="small"
            sx={{
              backgroundColor: activitiesCount > 0 ? colors.primaryGreen : colors.secondaryGrey,
              color: colors.secondaryDark,
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          />
          <Chip
            label={attractionsCount > 1 ? t('admin.categories.card.attractionsPlural', { count: attractionsCount }) : t('admin.categories.card.attractions', { count: attractionsCount })}
            size="small"
            sx={{
              backgroundColor: attractionsCount > 0 ? colors.primaryGold : colors.secondaryGrey,
              color: colors.secondaryDark,
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          />
          {totalUsage === 0 && (
            <Chip
              label={t('admin.categories.card.notUsed')}
              size="small"
              sx={{
                backgroundColor: colors.secondaryDarkAlt,
                color: colors.secondaryGrey,
                fontSize: '0.75rem',
              }}
            />
          )}
        </Stack>

        <Box sx={{ mb: 1.5 }}>
          <Typography
            variant="caption"
            sx={{
              color: colors.secondaryGrey,
              fontSize: '0.7rem',
            }}
          >
            {t('admin.categories.card.createdOn')} {new Date(category.created_at).toLocaleDateString(locale)}
          </Typography>
        </Box>

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
    </StyledCategoryCard>
  );
};
