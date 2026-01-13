import { Box } from '@mui/material';
import type { BaseAnimationProps } from '../types/weatherTypes';

const INTENSITY_CONFIG = {
    light: { count: 40, maxDelay: 20 },
    medium: { count: 60, maxDelay: 15 },
    heavy: { count: 80, maxDelay: 12 }
};

export default function DrizzleAnimation({ intensity = 'medium' }: BaseAnimationProps) {
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
            pointerEvents: 'none',
            '@keyframes drizzleFall': {
            'from': {
                transform: 'translateY(0)'
            },
            'to': {
                transform: 'translateY(calc(100vh + 50px))'
            }
        }
    }}
>
    {Array.from({ length: config.count }).map((_, i) => (
        <Box
            key={`drizzle-${i}`}
        sx={{
        position: 'absolute',
            top: '-20px',
            left: `${(i * 1.5) % 100}%`,
            width: '1px',
            height: `${8 + (i % 8)}px`,
            background: `linear-gradient(to bottom, transparent, rgba(173, 216, 230, ${0.3 + (i % 3) * 0.1}))`,
            animation: 'drizzleFall linear infinite',
            animationDuration: `${1.5 + (i % 8) * 0.2}s`,
            animationDelay: `${(i % config.maxDelay) * 0.05}s`
    }}
        />
    ))}
    </Box>
);
}