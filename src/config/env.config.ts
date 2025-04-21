import { registerAs } from '@nestjs/config';

/**
 * Environment configuration
 */
export const envConfig = registerAs('app', () => ({
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  logLevel: process.env.LOG_LEVEL || 'info',
}));
