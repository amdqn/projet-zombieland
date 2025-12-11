export const weatherGradients = {
  pluvieux: {
    gradient: 'linear-gradient(to bottom, #546e7a 0%, #607d8b 50%, #455a64 100%)',
    description: 'Light stormy grey sky'
  },
  ensoleille: {
    gradient: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #B0E0E6 100%)',
    description: 'Bright sunny blue sky'
  },
  neige: {
    gradient: 'linear-gradient(to bottom, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)',
    description: 'Bright sunny winter sky with snow'
  }
} as const;

export type WeatherGradientKey = keyof typeof weatherGradients;
