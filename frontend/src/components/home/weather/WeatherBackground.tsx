import { Box } from '@mui/material';
import type { WeatherData } from './types/weatherTypes';
import { weatherGradients } from './backgrounds/weatherGradients.ts';
import RainAnimation from './animations/RainAnimation.tsx';
import SnowAnimation from './animations/SnowAnimation.tsx';
import SunnyAnimation from './animations/SunnyAnimation.tsx';
import CloudAnimation from './animations/CloudAnimation.tsx';

interface WeatherBackgroundProps {
  weather: WeatherData;
}

export default function WeatherBackground({ weather }: WeatherBackgroundProps) {
  const gradient = weatherGradients[weather.condition]?.gradient || weatherGradients.pluvieux.gradient;

  const renderWeatherAnimation = () => {
    switch (weather.condition) {
      case 'pluvieux':
        return (
          <>
            <CloudAnimation position={{ top: '10%', left: '-20%' }} size="large" speed={20} />
            <CloudAnimation position={{ top: '25%', right: '-15%' }} size="medium" speed={25} direction="right-to-left" />
            <RainAnimation intensity="medium" />
          </>
        );
      case 'ensoleille':
        return <SunnyAnimation includesClouds />;
      case 'neige':
        return (
          <>
            {/* Soleil d'hiver */}
            <Box
              sx={{
                position: 'absolute',
                top: '10%',
                right: '10%',
                width: '60px',
                height: '60px',
                background: 'radial-gradient(circle, #FFD700 0%, #FFA500 100%)',
                borderRadius: '50%',
                boxShadow: '0 0 15px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.4)',
                zIndex: 0
              }}
            />
            <SnowAnimation intensity="medium" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Sky gradient background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: gradient,
          zIndex: 0
        }}
      />

      {/* Weather animations */}
      {renderWeatherAnimation()}
    </>
  );
}
