import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RouteNoDataFoundError } from '@/error/route-no-data-found.error';
import { Response } from 'express';

@Catch(RouteNoDataFoundError)
export class RouteNoDataFoundErrorFilter
  implements ExceptionFilter<RouteNoDataFoundError>
{
  catch(exception: RouteNoDataFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 404;

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
