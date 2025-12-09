import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { corsConfig } from './config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors(corsConfig);

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
  console.log(`🔗 Endpoints API : http://localhost:${process.env.PORT || 3001}/api/v1`);
}
void bootstrap();
