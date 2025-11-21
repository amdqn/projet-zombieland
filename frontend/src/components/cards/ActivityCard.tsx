import { Card, CardContent, CardMedia, Chip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { colors } from '../../theme/theme';
import { Link } from 'react-router-dom';

const StyledActivityCard = styled(Card)({
  backgroundColor: colors.secondaryDark,
  border: `1px solid ${colors.secondaryGrey}`,
  height: '100%',
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
}

export const ActivityCard = ({ id, name, category, image }: ActivityCardProps) => {
  return (
    <Link to={`/activities/${id}`} style={{ textDecoration: 'none' }}>
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
        <CardContent>
          <Typography
            variant="h5"
            sx={{
              mb: 1,
              fontSize: { xs: '1.1rem', md: '1.5rem' },
            }}
          >
            {name}
          </Typography>
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
        </CardContent>
      </StyledActivityCard>
    </Link>
  );
};
