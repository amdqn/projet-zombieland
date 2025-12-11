import { Box } from '@mui/material';
import type { BaseAnimationProps } from '../types/weatherTypes';

const INTENSITY_CONFIG = {
  light: { count: 60, maxDelay: 15 },
  medium: { count: 100, maxDelay: 10 },
  heavy: { count: 150, maxDelay: 7 }
};

export default function RainAnimation({ intensity = 'medium' }: BaseAnimationProps) {
  const config = INTENSITY_CONFIG[intensity];

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    >
      {Array.from({ length: config.count }).map((_, i) => (
        <Box
          key={`rain-${i}`}
          sx={{
            position: 'absolute',
            top: '-30px',
            left: `${(i * 1) % 100}%`,
            width: '2px',
            height: `${20 + (i % 15)}px`,
            background: `linear-gradient(to bottom, transparent, rgba(173, 216, 230, ${0.5 + (i % 3) * 0.15}))`,
            animation: 'rainFall linear infinite',
            animationDuration: `${0.5 + (i % 5) * 0.1}s`,
            animationDelay: `${(i % config.maxDelay) * 0.03}s`
          }}
        />
      ))}
    </Box>
  );
}
