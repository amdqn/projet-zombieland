import { Card, CardContent, CardMedia, Chip, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { colors } from '../../theme/theme';
import { Link } from 'react-router-dom';

const StyledActivityCard = styled(Card)({
  backgroundColor: colors.secondaryDark,
  border: `1px solid ${colors.secondaryGrey}`,
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: colors.primaryGreen,
    transform: 'translateY(-5px)',
    boxShadow: `0 5px 20px ${colors.primaryGreen}40`,
  },
  '& .MuiCardContent-root': {
    padding: '1rem',
  },
});

interface ActivityCardProps {
  id: number;
  name: string;
  category: string;
  image?: string;
  thrill?: number;
  duration?: string;
  description?: string;
  isAttraction?: boolean;
  isRestaurant?: boolean;
}

export const ActivityCard = ({
  id,
  name,
  category,
  image,
  thrill,
  duration,
  description,
  isAttraction = false,
  isRestaurant = false,
}: ActivityCardProps) => {
  const detailPath = isRestaurant
    ? `/restaurants/${id}`
    : isAttraction
    ? `/attractions/${id}`
    : `/activities/${id}`;

  return (
    <Link to={detailPath} style={{ textDecoration: 'none', width: '100%' }}>
      <StyledActivityCard>
        {image && (
          <CardMedia
            component="img"
            height="200"
            image={image}
            alt={name}
            sx={{
              objectFit: 'cover',
              filter: 'brightness(0.7)',
            }}
          />
        )}
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {(thrill !== undefined || duration) && (
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Chip
                label={category.toUpperCase()}
                size="small"
                sx={{
                  backgroundColor: colors.secondaryGrey,
                  color: colors.white,
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                }}
              />
              {thrill !== undefined && (
                <Chip
                  label={`Frisson ${thrill}/5`}
                  size="small"
                  sx={{
                    backgroundColor: colors.primaryRed,
                    color: colors.white,
                    fontWeight: 700,
                  }}
                />
              )}
              {duration && (
                <Chip
                  label={duration}
                  size="small"
                  sx={{
                    backgroundColor: colors.secondaryGrey,
                    color: colors.white,
                    fontWeight: 700,
                  }}
                />
              )}
            </Stack>
          )}
          {!thrill && !duration && (
            <Chip
              label={category.toUpperCase()}
              size="small"
              sx={{
                backgroundColor: colors.secondaryGrey,
                color: '#FFFFFF',
                fontFamily: "'Lexend Deca', sans-serif",
                fontSize: { xs: '0.65rem', md: '0.75rem' },
                fontWeight: 600,
              }}
            />
          )}
          <Typography
            variant="h5"
            sx={{ fontSize: { xs: '1.15rem', md: '1.35rem' }, lineHeight: 1.2 }}
          >
            {name}
          </Typography>
          {description && (
            <Typography
              variant="body2"
              sx={{
                color: colors.secondaryGrey,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {description}
            </Typography>
          )}
        </CardContent>
      </StyledActivityCard>
    </Link>
  );
};
