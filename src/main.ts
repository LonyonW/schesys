import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173'], // ← habilita ese origen
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true, // si estás usando cookies o headers con auth
  });
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false, transform: true, whitelist: true})); // if user doesn't exist return a 404
  //await app.listen(3000, '192.168.1.9' || 'localhost');
  //await app.listen(3000, '192.168.1.9'); // en local
  await app.listen(3000, '0.0.0.0'); // para dockerizar
}
bootstrap();
