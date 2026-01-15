export const weatherGradients = {
  Clear: {
    gradient: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #B0E0E6 100%)',
    description: 'Bright sunny blue sky'
  },
  Clouds: {
    gradient: 'linear-gradient(to bottom, #B0C4DE 0%, #D3D3D3 50%, #A9A9A9 100%)',
    description: 'Cloudy grey sky'
  },
  Rain: {
    gradient: 'linear-gradient(to bottom, #546e7a 0%, #607d8b 50%, #455a64 100%)',
    description: 'Rainy stormy grey sky'
  },
  Drizzle: {
    gradient: 'linear-gradient(to bottom, #78909c 0%, #90a4ae 50%, #546e7a 100%)',
    description: 'Light drizzle grey sky'
  },
  Thunderstorm: {
    gradient: 'linear-gradient(to bottom, #263238 0%, #37474f 50%, #455a64 100%)',
    description: 'Dark stormy sky'
  },
  Snow: {
    gradient: 'linear-gradient(to bottom, #CFD8DC 0%, #B0BEC5 50%, #90A4AE 100%)',
    description: 'Snowy winter sky'
  },
  Mist: {
    gradient: 'linear-gradient(to bottom, #CFD8DC 0%, #B0BEC5 50%, #90A4AE 100%)',
    description: 'Misty grey sky'
  },
  Fog: {
    gradient: 'linear-gradient(to bottom, #ECEFF1 0%, #CFD8DC 50%, #B0BEC5 100%)',
    description: 'Foggy sky'
  },
  Smoke: {
    gradient: 'linear-gradient(to bottom, #9E9E9E 0%, #757575 50%, #616161 100%)',
    description: 'Smoky sky'
  },
  Haze: {
    gradient: 'linear-gradient(to bottom, #BDBDBD 0%, #9E9E9E 50%, #757575 100%)',
    description: 'Hazy sky'
  },
  Dust: {
    gradient: 'linear-gradient(to bottom, #D7CCC8 0%, #BCAAA4 50%, #A1887F 100%)',
    description: 'Dusty sky'
  },
  Sand: {
    gradient: 'linear-gradient(to bottom, #EFEBE9 0%, #D7CCC8 50%, #BCAAA4 100%)',
    description: 'Sandy sky'
  },
  Ash: {
    gradient: 'linear-gradient(to bottom, #757575 0%, #616161 50%, #424242 100%)',
    description: 'Ashy volcanic sky'
  },
  Squall: {
    gradient: 'linear-gradient(to bottom, #455a64 0%, #37474f 50%, #263238 100%)',
    description: 'Violent squall sky'
  },
  Tornado: {
    gradient: 'linear-gradient(to bottom, #212121 0%, #424242 50%, #616161 100%)',
    description: 'Tornado sky'
  }
} as const;

export type WeatherGradientKey = keyof typeof weatherGradients;