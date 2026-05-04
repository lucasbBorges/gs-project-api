import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

import { ApiErrorResponse } from '../types/api-error-response.type';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;

    const body: ApiErrorResponse = {
      statusCode,
      message: this.resolveMessage(exceptionResponse, exception),
      error: this.resolveError(exceptionResponse, statusCode),
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(statusCode).json(body);
  }

  private resolveMessage(exceptionResponse: unknown, exception: unknown): string | string[] {
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const message = (exceptionResponse as { message?: string | string[] }).message;
      if (message) {
        return message;
      }
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Internal server error';
  }

  private resolveError(exceptionResponse: unknown, statusCode: number): string {
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const error = (exceptionResponse as { error?: string }).error;
      if (error) {
        return error;
      }
    }

    return HttpStatus[statusCode] ?? 'Error';
  }
}
