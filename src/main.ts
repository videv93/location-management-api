import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomLoggerService } from './common/logging/logger.service';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Create logs directory if it doesn't exist
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }

  // Create NestJS application
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  
  // Use custom logger service
  const logger = app.get(CustomLoggerService);
  app.useLogger(logger);
  
  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not defined in DTOs
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
      transform: true, // Transform incoming data to instance of DTO class
      transformOptions: {
        enableImplicitConversion: true, // Auto-convert primitive types
      },
    }),
  );
  
  // Enable CORS
  app.enableCors();
  
  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Location Management API')
    .setDescription('A RESTful API for managing locations')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  // Get application port from config
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  
  // Start the server
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
  logger.log(`Swagger documentation is available at: http://localhost:${port}/api`, 'Bootstrap');
}

bootstrap();
