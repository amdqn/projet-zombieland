export type WeatherCondition = 'ensoleille' | 'pluvieux' | 'neige';

export interface WeatherData {
  city: string;
  temperature: number;
  condition: WeatherCondition;
  icon: string;
}

export type AnimationIntensity = 'light' | 'medium' | 'heavy';

export interface BaseAnimationProps {
  intensity?: AnimationIntensity;
}
