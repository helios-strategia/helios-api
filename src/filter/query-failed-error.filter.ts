import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch(QueryFailedError)
export class QueryFailedErrorFilter implements ExceptionFilter {
  constructor(private readonly fieldsToMatch: Record<string, any>) {}

  public catch(exception: QueryFailedError, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (
      Object.entries(this.fieldsToMatch).every(
        ([key, value]) => exception.driverError[key] === value,
      )
    ) {
      response.status(409).json({
        message: exception.driverError?.detail || exception.message,
        statusCode: 409,
        timestamp: new Date().toISOString(),
      });
    } else {
      throw exception;
    }
  }
}
