import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { NoDataFoundError } from '@/error/no-data-found.error';
import { Response } from 'express';

@Catch(NoDataFoundError)
export class NoDataFoundExceptionFilter
  implements ExceptionFilter<NoDataFoundError>
{
  catch(exception: NoDataFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 400;

    response.status(status).json({
      message: exception.message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      data: {
        id: exception.id,
        entity: exception.entity.prototype.constructor.name,
      },
    });
  }
}
