import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Creating a nest app
  const app = await NestFactory.create(AppModule);

  // Setting up a global-scoped validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Enable Cross-origin resource sharing (CORS)
  app.enableCors();

  // Setting up app port
  await app.listen(3000);
}
bootstrap();