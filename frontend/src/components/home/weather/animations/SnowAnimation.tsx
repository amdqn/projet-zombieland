import { Box } from '@mui/material';
import type { BaseAnimationProps } from '../types/weatherTypes';

const INTENSITY_CONFIG = {
    light: { count: 50, maxDelay: 15 },
    medium: { count: 80, maxDelay: 10 },
    heavy: { count: 120, maxDelay: 7 }
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
                zIndex: 2,
                overflow: 'hidden',
                pointerEvents: 'none',
                '@keyframes snowFall': {
                    '0%': {
                        transform: 'translateY(0)'
                    },
                    '100%': {
                        transform: 'translateY(100vh)'
                    }
                }
            }}
        >
            {Array.from({ length: config.count }).map((_, i) => {
                const size = 3 + (i % 4);
                const duration = 5 + (i % 6);

                return (
                    <Box
                        key={`snow-${i}`}
                        sx={{
                            position: 'absolute',
                            top: '-20px',
                            left: `${(i * 1.3) % 100}%`,
                            width: `${size}px`,
                            height: `${size}px`,
                            background: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '50%',
                            animation: 'snowFall linear infinite',
                            animationDuration: `${duration}s`,
                            animationDelay: `${(i % config.maxDelay) * 0.2}s`
                        }}
                    />
                );
            })}
        </Box>
    );
}