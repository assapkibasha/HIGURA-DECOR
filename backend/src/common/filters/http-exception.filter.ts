import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const httpException = exception instanceof HttpException ? exception : null;

    const status = httpException
      ? httpException.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = httpException
      ? httpException.getResponse()
      : { message: 'Internal server error' };

    const message = this.extractMessage(errorResponse);

    response.status(status).json({
      success: false,
      error: message,
      code: httpException ? undefined : 'INTERNAL_SERVER_ERROR',
    });
  }

  private extractMessage(errorResponse: unknown): string {
    if (typeof errorResponse === 'string') return errorResponse;

    if (errorResponse && typeof errorResponse === 'object') {
      const asAny = errorResponse as any;
      const msg = asAny.message;

      if (Array.isArray(msg)) return msg.join(', ');
      if (typeof msg === 'string') return msg;

      if (typeof asAny.error === 'string') return asAny.error;
    }

    return 'Unexpected error';
  }
}
