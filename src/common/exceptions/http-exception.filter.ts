import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global HTTP exception filter to handle and format all exceptions
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    // Log the error
    this.logger.error(
      `HTTP ${status} - ${request.method} ${request.url}`,
      exception.stack,
      {
        errorResponse,
        request: {
          body: request.body,
          query: request.query,
          params: request.params,
        },
      },
    );

    // Format the error response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof errorResponse === 'object' 
        ? (errorResponse as any).message || 'Internal server error'
        : errorResponse,
      error: HttpStatus[status],
    });
  }
}
