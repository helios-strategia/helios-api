import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ValidationError } from '@/error/validation.error';
import { Response } from 'express';
import { match, P } from 'ts-pattern';
import { getApiErrorResponse } from '@/utils';
import { DBConflictError } from '@/error/d-b-conflict.error';
import { ApiErrorResponse } from '@/types/common';
import { NoDataFoundError } from '@/error/no-data-found.error';

@Catch()
export class GenericErrorFilter implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const [status, body] = match<unknown, [HttpStatus, ApiErrorResponse]>(error)
      .with(P.instanceOf(ValidationError), (_, value) => [
        HttpStatus.BAD_REQUEST,
        getApiErrorResponse({
          message: value.message,
          statusCode: HttpStatus.BAD_REQUEST,
          data: value.data,
        }),
      ])
      .with(P.instanceOf(DBConflictError), (_, value) => [
        HttpStatus.CONFLICT,
        getApiErrorResponse({
          message: value.message,
          statusCode: HttpStatus.CONFLICT,
        }),
      ])
      .with(P.instanceOf(NoDataFoundError), (_, value) => [
        HttpStatus.BAD_REQUEST,
        getApiErrorResponse({
          message: value.message,
          statusCode: HttpStatus.BAD_REQUEST,
          data: {
            id: value.id,
            entity: value.entity['prototype'].constructor.name,
          },
        }),
      ])
      .with(P.instanceOf(Error), (_, value) => {
        Logger.error('Unhandled error', {
          error: value,
        });

        return [
          HttpStatus.INTERNAL_SERVER_ERROR,
          getApiErrorResponse({
            message: 'Internal Server Error',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            // TODO: only during dev, after finish must be removed!!
            data: {
              errorMessage: value.message,
              errorStack: value.stack,
              errorName: value.name,
            },
          }),
        ];
      })
      .otherwise(() => {
        Logger.error('Unhandled unknown error', {
          error,
        });

        return [
          HttpStatus.INTERNAL_SERVER_ERROR,
          getApiErrorResponse({
            message: 'Internal Server Error',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            // TODO: only during dev, after finish must be removed!!
            data: {
              message: 'unknown throw',
            },
          }),
        ];
      });

    response.status(status).json(body);
  }
}
