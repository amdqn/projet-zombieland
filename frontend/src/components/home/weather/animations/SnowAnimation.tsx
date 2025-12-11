import { Box } from '@mui/material';
import type { BaseAnimationProps } from '../types/weatherTypes';

const INTENSITY_CONFIG = {
  light: { count: 40, speedVariation: 3 },
  medium: { count: 70, speedVariation: 2.5 },
  heavy: { count: 100, speedVariation: 2 }
};

export default function SnowAnimation({ intensity = 'medium' }: BaseAnimationProps) {
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
      {Array.from({ length: config.count }).map((_, i) => {
        const size = 3 + (i % 5);
        const fallDuration = 5 + (i % 6) * config.speedVariation;
        const swayDuration = 3 + (i % 4);

        return (
          <Box
            key={`snow-${i}`}
            sx={{
              position: 'absolute',
              top: '-20px',
              left: `${(i * 1.3) % 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '50%',
              filter: 'blur(1px)',
              animation: `snowFall ${fallDuration}s linear infinite, snowSway ${swayDuration}s ease-in-out infinite`,
              animationDelay: `${(i % 10) * 0.5}s, ${(i % 5) * 0.3}s`
            }}
          />
        );
      })}
    </Box>
  );
}
