import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { DBConflictError } from '@/error/d-b-conflict.error';
import { Response } from 'express';
import { getHttpErrorMessage } from '@/utils';

@Catch(DBConflictError)
export class DbConflictErrorFilter implements ExceptionFilter<DBConflictError> {
  catch(exception: DBConflictError, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.CONFLICT;

    response.status(status).json(
      getHttpErrorMessage({
        message: exception.message,
        statusCode: HttpStatus.CONFLICT,
      }),
    );
  }
}
