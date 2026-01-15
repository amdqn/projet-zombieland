import { Box } from '@mui/material';
import CloudAnimation from './CloudAnimation.tsx';

interface SunnyAnimationProps {
  includesClouds?: boolean;
}

export default function SunnyAnimation({ includesClouds = true }: SunnyAnimationProps) {
  const rayCount = 12;

  return (
    <>
      {/* Sun with rays */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          right: '15%',
          width: '120px',
          height: '120px',
          zIndex: 0
        }}
      >
        {/* Sun core */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, #FFD700 0%, #FFA500 100%)',
            borderRadius: '50%',
            boxShadow: `
              0 0 20px rgba(255, 215, 0, 0.8),
              0 0 40px rgba(255, 215, 0, 0.6),
              0 0 60px rgba(255, 215, 0, 0.4)
            `,
            zIndex: 1
          }}
        />

        {/* Rotating rays */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '200px',
            height: '200px',
            transform: 'translate(-50%, -50%)',
            animation: 'rotateSunRays 60s linear infinite',
            zIndex: 0
          }}
        >
          {Array.from({ length: rayCount }).map((_, i) => (
            <Box
              key={`ray-${i}`}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '4px',
                height: '50px',
                background: 'linear-gradient(to bottom, rgba(255, 215, 0, 0.6), transparent)',
                transformOrigin: 'center top',
                transform: `translate(-50%, 0) rotate(${i * (360 / rayCount)}deg)`,
                borderRadius: '2px'
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Optional light clouds */}
      {includesClouds && (
        <>
          <CloudAnimation
            position={{ top: '30%', left: '-15%' }}
            size="small"
            speed={35}
            opacity={0.08}
          />
          <CloudAnimation
            position={{ top: '50%', right: '-20%' }}
            size="medium"
            speed={40}
            direction="right-to-left"
            opacity={0.06}
          />
        </>
      )}
    </>
  );
}
