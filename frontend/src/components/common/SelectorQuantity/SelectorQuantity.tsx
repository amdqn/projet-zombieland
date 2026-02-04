import { Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { colors } from '../../../theme/theme';

interface SelectorQuantityProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  variant?: 'compact' | 'large';
}

export const SelectorQuantity = ({
  value,
  min = 0,
  max = 99,
  onChange,
  variant = 'compact',
}: SelectorQuantityProps) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  // Style large pour la page de sélection de quantité
  if (variant === 'large') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <IconButton
          aria-label="Diminuer la quantité"
          onClick={handleDecrement}
          disabled={value <= min}
          sx={{
            border: `2px solid ${colors.primaryGreen}`,
            backgroundColor: 'transparent',
            color: colors.primaryGreen,
            width: 56,
            height: 56,
            borderRadius: '50%',
            '&:hover': {
              backgroundColor: colors.primaryGreen,
              color: colors.secondaryDark,
            },
            '&.Mui-disabled': {
              borderColor: colors.secondaryGrey,
              color: colors.secondaryGrey,
              opacity: 0.3,
            },
          }}
        >
          <RemoveIcon sx={{ fontSize: '2rem' }} />
        </IconButton>

        <Typography
          sx={{
            fontFamily: "'Creepster', cursive",
            fontSize: { xs: '3rem', md: '4rem' },
            fontWeight: 400,
            color: colors.white,
            minWidth: '80px',
            textAlign: 'center',
          }}
        >
          {value}
        </Typography>

        <IconButton
          aria-label="Augmenter la quantité"
          onClick={handleIncrement}
          disabled={value >= max}
          sx={{
            border: `2px solid ${colors.primaryGreen}`,
            backgroundColor: 'transparent',
            color: colors.primaryGreen,
            width: 56,
            height: 56,
            borderRadius: '50%',
            '&:hover': {
              backgroundColor: colors.primaryGreen,
              color: colors.secondaryDark,
            },
            '&.Mui-disabled': {
              borderColor: colors.secondaryGrey,
              color: colors.secondaryGrey,
              opacity: 0.3,
            },
          }}
        >
          <AddIcon sx={{ fontSize: '2rem' }} />
        </IconButton>
      </Box>
    );
  }

  // Style compact par défaut 
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <IconButton
        aria-label="Diminuer la quantité"
        onClick={handleDecrement}
        disabled={value <= min}
        sx={{
          backgroundColor: colors.secondaryGrey,
          color: colors.white,
          width: 32,
          height: 32,
          '&:hover': {
            backgroundColor: colors.primaryGreen,
            color: colors.secondaryDark,
          },
          '&.Mui-disabled': {
            backgroundColor: colors.secondaryGrey,
            opacity: 0.3,
          },
        }}
      >
        <RemoveIcon fontSize="small" />
      </IconButton>

      <Typography
        sx={{
          fontFamily: "'Lexend Deca', sans-serif",
          fontSize: { xs: '1.2rem', md: '1.5rem' },
          fontWeight: 700,
          minWidth: '40px',
          textAlign: 'center',
        }}
      >
        {value}
      </Typography>

      <IconButton
        aria-label="Augmenter la quantité"
        onClick={handleIncrement}
        disabled={value >= max}
        sx={{
          backgroundColor: colors.secondaryGrey,
          color: colors.white,
          width: 32,
          height: 32,
          '&:hover': {
            backgroundColor: colors.primaryGreen,
            color: colors.secondaryDark,
          },
          '&.Mui-disabled': {
            backgroundColor: colors.secondaryGrey,
            opacity: 0.3,
          },
        }}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};
