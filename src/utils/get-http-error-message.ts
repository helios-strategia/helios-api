import { isEmpty, isNil } from 'lodash';
import { HttpStatus } from '@nestjs/common';
import { HttpErrorMessage } from '@/types/common';

export const getHttpErrorMessage = ({
  message,
  statusCode,
  data,
}: {
  message: string;
  statusCode: HttpStatus;
  data?: Record<string, unknown>;
}): HttpErrorMessage => {
  if (isNil(data) || isEmpty(data)) {
    return {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
    };
  }

  return {
    message,
    statusCode,
    timestamp: new Date().toISOString(),
    data,
  };
};
