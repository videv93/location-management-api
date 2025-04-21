import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

/**
 * Custom logger service using Winston
 */
@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    const { combine, timestamp, printf, colorize } = winston.format;

    // Custom log format
    const logFormat = printf(({ level, message, timestamp, context, trace }) => {
      return `${timestamp} [${level}] ${context ? `[${context}]` : ''}: ${message} ${trace ? `\n${trace}` : ''}`;
    });

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: combine(
        timestamp(),
        logFormat,
      ),
      transports: [
        // Console transport
        new winston.transports.Console({
          format: combine(
            colorize(),
            timestamp(),
            logFormat,
          ),
        }),
        // File transport for errors
        new winston.transports.File({ 
          filename: 'logs/error.log', 
          level: 'error' 
        }),
        // File transport for all logs
        new winston.transports.File({ 
          filename: 'logs/combined.log' 
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
