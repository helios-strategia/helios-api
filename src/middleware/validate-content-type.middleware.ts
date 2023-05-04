import { NextFunction, Response, Request } from 'express';
import * as mime from 'mime-types';
import { NestMiddleware } from '@nestjs/common';

export class ValidateContentTypeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const contentTypeFromRequest = req.headers['content-type'];

    if (
      !contentTypeFromRequest ||
      mime.contentType(contentTypeFromRequest) !== 'multipart/form-data'
    ) {
      res
        .status(415)
        .send(`Unsupported media type. Expected 'multipart/form-data'`);
    } else {
      next();
    }
  }
}
