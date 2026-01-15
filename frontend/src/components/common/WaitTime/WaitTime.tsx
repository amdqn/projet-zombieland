import { Box, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { colors } from '../../../theme';

interface WaitTimeProps {
  minutes: number;
  variant?: 'chip' | 'inline' | 'full';
  showLabel?: boolean;
}

const getWaitTimeColor = (minutes: number): string => {
  if (minutes < 15) return colors.primaryGreen;
  if (minutes <= 30) return colors.warning;
  return colors.primaryRed;
};

const getWaitTimeLabel = (minutes: number): string => {
  if (minutes < 15) return 'Faible affluence';
  if (minutes <= 30) return 'Affluence modérée';
  return 'Forte affluence';
};

export const WaitTime = ({ minutes, variant = 'chip', showLabel = false }: WaitTimeProps) => {
  const color = getWaitTimeColor(minutes);

  if (variant === 'chip') {
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          bgcolor: `${color}20`,
          border: `1px solid ${color}`,
          borderRadius: '4px',
          px: 1,
          py: 0.5,
        }}
      >
        <AccessTimeIcon sx={{ fontSize: 16, color }} />
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color }}>
          {minutes} min
        </Typography>
      </Box>
    );
  }

  if (variant === 'inline') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <AccessTimeIcon sx={{ fontSize: 14, color }} />
        <Typography sx={{ fontSize: 12, color, fontWeight: 'bold' }}>
          {minutes} min
        </Typography>
      </Box>
    );
  }

  // variant === 'full'
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccessTimeIcon sx={{ fontSize: 32, color }} />
        <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: colors.white }}>
          {minutes} min
        </Typography>
      </Box>
      {showLabel && (
        <Typography sx={{ fontSize: '0.9rem', color, mt: 0.5 }}>
          {getWaitTimeLabel(minutes)}
        </Typography>
      )}
    </Box>
  );
};
