import { Box } from '@mui/material';

import renderWeatherAnimation from "./RenderAnimationWeather.tsx";
import type {WeatherCondition, WeatherData} from "../types/weatherTypes.ts";
import {weatherGradients} from "../backgrounds/weatherGradients.ts";

interface WeatherBackgroundProps {
  weather: WeatherData;
}

export default function WeatherBackground({ weather }: WeatherBackgroundProps) {
    // Vérification de sécurité
    if (!weather?.weather?.[0]?.main) {
        return null;
    }

    const test = "Mist"
    const gradient = weatherGradients[test]?.gradient;
    //const gradient = weatherGradients[weather.weather[0].main]?.gradient;
    //const condition = weather.weather[0].main as WeatherCondition;

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
            {renderWeatherAnimation(test)}
        </>
    );
}
