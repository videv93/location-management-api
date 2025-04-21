import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';

import { LocationsModule } from './locations/locations.module';
import { LoggerModule } from './common/logging/logger.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { databaseConfig } from './config/database.config';
import { envConfig } from './config/env.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    
    // Database
    TypeOrmModule.forRoot(databaseConfig),
    
    // Application modules
    LocationsModule,
    LoggerModule,
  ],
  providers: [
    // Global exception filter
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
