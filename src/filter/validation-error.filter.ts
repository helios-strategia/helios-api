import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ValidationError } from '@/error/validation.error';
import { Response } from 'express';

@Catch(ValidationError)
export class ValidationErrorFilter implements ExceptionFilter<ValidationError> {
  catch(exception: ValidationError, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 400;

    response.status(status).json({
      message: exception.message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      data: exception.data,
    });
  }
}
