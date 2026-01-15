import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsConfig: CorsOptions = {
  origin: [
    'http://localhost:5173', // Frontend Vite dev
    'http://localhost:3000', // Alternative dev port
    'http://localhost:5174', // Alternative Vite port
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
