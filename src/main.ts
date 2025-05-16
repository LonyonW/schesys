import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    //origin: ['https://sage-frontend-3dek.onrender.com'], // PRODUCCION
    origin: true, // Para pruebas mientras el front no este desplegado
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true, // para los tokens
  });
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false, transform: true, whitelist: true})); //  404
  await app.listen(3000, '0.0.0.0'); 
}
bootstrap();
