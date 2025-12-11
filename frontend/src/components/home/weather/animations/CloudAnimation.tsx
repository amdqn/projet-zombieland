import { Box } from '@mui/material';

interface CloudPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

interface CloudAnimationProps {
  position: CloudPosition;
  size: 'small' | 'medium' | 'large';
  speed: number;
  direction?: 'left-to-right' | 'right-to-left';
  opacity?: number;
}

const SIZE_CONFIG = {
  small: { width: 120, height: 50 },
  medium: { width: 150, height: 60 },
  large: { width: 200, height: 80 }
};

export default function CloudAnimation({
  position,
  size,
  speed,
  direction = 'left-to-right',
  opacity = 0.1
}: CloudAnimationProps) {
  const dimensions = SIZE_CONFIG[size];
  const animationName = direction === 'left-to-right' ? 'cloudMoveRight' : 'cloudMoveLeft';

  return (
    <Box
      sx={{
        position: 'absolute',
        ...position,
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        background: `rgba(255, 255, 255, ${opacity})`,
        borderRadius: '50px',
        boxShadow: `
          ${dimensions.width * 0.25}px 0 0 -10px rgba(255, 255, 255, ${opacity}),
          ${dimensions.width * 0.125}px -${dimensions.height * 0.375}px 0 -20px rgba(255, 255, 255, ${opacity}),
          ${dimensions.width * 0.375}px -${dimensions.height * 0.375}px 0 -20px rgba(255, 255, 255, ${opacity}),
          ${dimensions.width * 0.6}px 0 0 -10px rgba(255, 255, 255, ${opacity})
        `,
        animation: `${animationName} ${speed}s linear infinite`,
        zIndex: 0,
        pointerEvents: 'none',
        '@keyframes cloudMoveRight': {
          '0%': { left: '-20%' },
          '100%': { left: '120%' }
        },
        '@keyframes cloudMoveLeft': {
          '0%': { right: '-20%' },
          '100%': { right: '120%' }
        }
      }}
    />
  );
}
