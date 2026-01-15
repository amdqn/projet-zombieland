import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { corsConfig } from './config/cors.config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 🛡️ HELMET - Sécurise les headers HTTP
  // Protection contre XSS, clickjacking, MIME sniffing, etc.
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Nécessaire pour Swagger UI
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Nécessaire pour Swagger UI
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "data:"],
      },
    },
    crossOriginEmbedderPolicy: false, // Désactivé pour Swagger UI
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Pour les ressources statiques
  }));

  // Enable CORS
  app.enableCors(corsConfig);

  // Servir les fichiers statiques depuis le dossier public
  app.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/',
  });

  app.setGlobalPrefix('api/v1');

  const apiSpec = yaml.load(
    fs.readFileSync('./api-spec.yml', 'utf8'),
  ) as OpenAPIObject;

  SwaggerModule.setup('swagger-ui', app, apiSpec);

  await app.listen(process.env.PORT || 3001);
  console.log(`🚀 App démarrée sur le port ${process.env.PORT || 3001}`);
  console.log(
    `📚 Documentation (Swagger UI) : http://localhost:${process.env.PORT || 3001}/swagger-ui`,
  );
  console.log(
    `🔗 Endpoints API : http://localhost:${process.env.PORT || 3001}/api/v1`,
  );
}
void bootstrap();
