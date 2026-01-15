import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { colors } from '../../../theme';
import { useNavigate } from 'react-router-dom';

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

interface ActivityCardPublicProps {
  id: number;
  name: string;
  category: string;
  image: string;
  thrill?: number;
  duration?: string;
  description?: string;
  isAttraction?: boolean;
  isRestaurant?: boolean;
}

export const ActivityCardPublic = ({
  id,
  name,
  category,
  image,
  thrill,
  duration,
  description,
  isAttraction = false,
  isRestaurant = false,
}: ActivityCardPublicProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (isRestaurant) {
      navigate(`/restaurants/${id}`);
    } else if (isAttraction) {
      navigate(`/attractions/${id}`);
    } else {
      navigate(`/activities/${id}`);
    }
  };

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
        <Chip
          label={category}
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
          {name}
        </Typography>

        {description && (
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
            {description}
          </Typography>
        )}

        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          {thrill !== undefined && !isRestaurant && (
            <Chip
              label={`Frisson: ${thrill}/5`}
              size="small"
              sx={{
                backgroundColor: colors.secondaryDarkAlt,
                color: colors.white,
                fontSize: '0.75rem',
              }}
            />
          )}
          {duration && !isRestaurant && (
            <Chip
              label={duration}
              size="small"
              sx={{
                backgroundColor: colors.secondaryDarkAlt,
                color: colors.white,
                fontSize: '0.75rem',
              }}
            />
          )}
        </Stack>
      </CardContent>
    </StyledActivityCard>
  );
};
