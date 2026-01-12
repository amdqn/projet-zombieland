// Animation brume, sable etc

import { Box } from '@mui/material';
import type { BaseAnimationProps } from '../types/weatherTypes';

const INTENSITY_CONFIG = {
    light: { layers: 3, opacity: 0.4, speed: 50, particles: 20 },
    medium: { layers: 4, opacity: 0.6, speed: 40, particles: 30 },
    heavy: { layers: 5, opacity: 0.8, speed: 30, particles: 40 }
};

export default function MistAnimation({ intensity = 'medium' }: BaseAnimationProps) {
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
                '@keyframes mistFloat': {
                    '0%': {
                        transform: 'translateX(-50%)',
                        opacity: 0
                    },
                    '15%': {
                        opacity: 1
                    },
                    '85%': {
                        opacity: 1
                    },
                    '100%': {
                        transform: 'translateX(150%)',
                        opacity: 0
                    }
                },
                '@keyframes mistPulse': {
                    '0%, 100%': {
                        opacity: 0.5
                    },
                    '50%': {
                        opacity: 1
                    }
                },
                '@keyframes mistRise': {
                    '0%': {
                        transform: 'translateY(0) translateX(0)',
                        opacity: 0.8
                    },
                    '100%': {
                        transform: 'translateY(-20%) translateX(30%)',
                        opacity: 0
                    }
                }
            }}
        >
            {/* Couches de brume superposées avec effet de profondeur */}
            {Array.from({ length: config.layers }).map((_, layerIndex) => (
                <Box key={`mist-layer-${layerIndex}`}>
                    {/* Bandes de brume horizontales */}
                    {Array.from({ length: 4 }).map((_, bandIndex) => {
                        const delay = (layerIndex * 4 + bandIndex) * 1.5;
                        const height = 30 + (bandIndex * 12);
                        const topPosition = 15 + (bandIndex * 20);
                        const duration = config.speed + (layerIndex * 8) + (bandIndex * 3);
                        const blur = 20 + layerIndex * 8;

                        return (
                            <Box
                                key={`mist-band-${layerIndex}-${bandIndex}`}
                                sx={{
                                    position: 'absolute',
                                    top: `${topPosition}%`,
                                    left: 0,
                                    width: '250%',
                                    height: `${height}%`,
                                    background: `linear-gradient(
                                        to right,
                                        transparent 0%,
                                        rgba(220, 220, 220, ${config.opacity * 0.3}) 15%,
                                        rgba(200, 200, 200, ${config.opacity * 0.5}) 30%,
                                        rgba(180, 180, 180, ${config.opacity * 0.7}) 45%,
                                        rgba(170, 170, 170, ${config.opacity * 0.8}) 50%,
                                        rgba(180, 180, 180, ${config.opacity * 0.7}) 55%,
                                        rgba(200, 200, 200, ${config.opacity * 0.5}) 70%,
                                        rgba(220, 220, 220, ${config.opacity * 0.3}) 85%,
                                        transparent 100%
                                    )`,
                                    filter: `blur(${blur}px)`,
                                    animation: `
                                        mistFloat ${duration}s linear infinite,
                                        mistPulse ${10 + layerIndex * 3}s ease-in-out infinite
                                    `,
                                    animationDelay: `${delay}s, ${layerIndex * 2}s`,
                                    zIndex: layerIndex,
                                    opacity: 1 - (layerIndex * 0.15)
                                }}
                            />
                        );
                    })}
                </Box>
            ))}

            {/* Grandes masses de brume flottantes */}
            {Array.from({ length: config.particles }).map((_, i) => {
                const size = 150 + (i % 8) * 80;
                const top = (i * 11) % 90;
                const duration = 35 + (i % 12) * 5;
                const delay = (i % 15) * 2;
                const blur = 25 + (i % 5) * 8;

                return (
                    <Box
                        key={`mist-particle-${i}`}
                        sx={{
                            position: 'absolute',
                            top: `${top}%`,
                            left: '-30%',
                            width: `${size}px`,
                            height: `${size}px`,
                            background: `radial-gradient(
                                ellipse at center,
                                rgba(230, 230, 230, ${config.opacity * 0.4}) 0%,
                                rgba(210, 210, 210, ${config.opacity * 0.3}) 20%,
                                rgba(190, 190, 190, ${config.opacity * 0.2}) 40%,
                                rgba(180, 180, 180, ${config.opacity * 0.1}) 60%,
                                transparent 80%
                            )`,
                            borderRadius: '50%',
                            filter: `blur(${blur}px)`,
                            animation: `mistFloat ${duration}s linear infinite`,
                            animationDelay: `${delay}s`,
                            zIndex: config.layers + (i % 3)
                        }}
                    />
                );
            })}

            {/* Brume montante du sol */}
            {Array.from({ length: 8 }).map((_, i) => {
                const width = 200 + (i % 5) * 100;
                const left = (i * 12) % 100;
                const duration = 20 + (i % 6) * 4;
                const delay = (i % 8) * 2.5;

                return (
                    <Box
                        key={`mist-rise-${i}`}
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: `${left}%`,
                            width: `${width}px`,
                            height: '40%',
                            background: `linear-gradient(
                                to top,
                                rgba(200, 200, 200, ${config.opacity * 0.6}) 0%,
                                rgba(210, 210, 210, ${config.opacity * 0.4}) 30%,
                                rgba(220, 220, 220, ${config.opacity * 0.2}) 60%,
                                transparent 100%
                            )`,
                            filter: `blur(${30 + (i % 4) * 10}px)`,
                            animation: `mistRise ${duration}s ease-out infinite`,
                            animationDelay: `${delay}s`,
                            zIndex: config.layers + 2
                        }}
                    />
                );
            })}
        </Box>
    );
}