import { Box } from '@mui/material';
import { useState, useEffect } from 'react';

interface LightningPosition {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
}

interface LightningAnimationProps {
    position?: LightningPosition;
    frequency?: number; // Fréquence des éclairs en secondes (ex: 3 = un éclair toutes les 3 secondes)
    intensity?: 'light' | 'medium' | 'heavy';
    color?: string;
}

const INTENSITY_CONFIG = {
    light: {
        width: 3,
        opacity: 0.6,
        glowIntensity: 10,
        flashDuration: 0.2
    },
    medium: {
        width: 5,
        opacity: 0.8,
        glowIntensity: 20,
        flashDuration: 0.3
    },
    heavy: {
        width: 8,
        opacity: 1,
        glowIntensity: 30,
        flashDuration: 0.4
    }
};

export default function LightningAnimation({
                                               position = { top: '10%', left: '30%' },
                                               frequency = 4,
                                               intensity = 'medium',
                                               color = '#FFFFFF'
                                           }: LightningAnimationProps) {
    const [isFlashing, setIsFlashing] = useState(false);
    const [lightningPath, setLightningPath] = useState('');

    const config = INTENSITY_CONFIG[intensity];

    // Génère un chemin d'éclair aléatoire
    const generateLightningPath = () => {
        const segments = 6 + Math.floor(Math.random() * 4); // 6-9 segments
        let path = 'M 50 0'; // Commence en haut
        let x = 50;
        let y = 0;

        for (let i = 0; i < segments; i++) {
            x += (Math.random() - 0.5) * 40; // Zigzag horizontal
            y += 100 / segments; // Descend progressivement
            path += ` L ${x} ${y}`;

            // Ajoute des branches occasionnelles
            if (Math.random() > 0.7) {
                const branchX = x + (Math.random() - 0.5) * 30;
                const branchY = y + 20;
                path += ` M ${x} ${y} L ${branchX} ${branchY} M ${x} ${y}`;
            }
        }

        return path;
    };

    useEffect(() => {
        const triggerLightning = () => {
            // Génère un nouveau chemin
            setLightningPath(generateLightningPath());
            setIsFlashing(true);

            // Flash du fond (ciel)
            setTimeout(() => {
                setIsFlashing(false);
            }, config.flashDuration * 1000);
        };

        // Premier éclair après un délai aléatoire
        const initialDelay = Math.random() * frequency * 1000;
        const initialTimeout = setTimeout(triggerLightning, initialDelay);

        // Éclairs suivants à intervalle régulier avec variation
        const interval = setInterval(() => {
            const randomDelay = (Math.random() * 0.5 + 0.75) * frequency * 1000;
            setTimeout(triggerLightning, randomDelay);
        }, frequency * 1000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, [frequency, config.flashDuration]);

    return (
        <>
            {/* Flash de fond (éclair qui illumine tout) */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    opacity: isFlashing ? 1 : 0,
                    transition: `opacity ${config.flashDuration}s ease-out`,
                    zIndex: 5,
                    pointerEvents: 'none'
                }}
            />

            {/* Éclair SVG */}
            <Box
                sx={{
                    position: 'absolute',
                    ...position,
                    width: '100px',
                    height: '200px',
                    zIndex: 6,
                    pointerEvents: 'none',
                    opacity: isFlashing ? 1 : 0,
                    transition: `opacity ${config.flashDuration}s ease-out`,
                    filter: `drop-shadow(0 0 ${config.glowIntensity}px ${color})`
                }}
            >
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 100"
                    style={{ overflow: 'visible' }}
                >
                    <path
                        d={lightningPath}
                        stroke={color}
                        strokeWidth={config.width}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={config.opacity}
                    />
                    {/* Éclair intérieur (plus brillant) */}
                    <path
                        d={lightningPath}
                        stroke={color}
                        strokeWidth={config.width * 0.4}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={1}
                    />
                </svg>
            </Box>
        </>
    );
}