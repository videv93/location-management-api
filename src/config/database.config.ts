import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Location } from '../locations/entities/location.entity';

/**
 * Database configuration for TypeORM
 */
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'location_management',
  entities: [Location],
  synchronize: process.env.NODE_ENV !== 'production', // Auto-sync in non-production
  logging: process.env.DB_LOGGING === 'true',
};
