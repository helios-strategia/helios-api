import { isEmpty, isNil } from 'lodash';
import { HttpStatus } from '@nestjs/common';
import { ApiErrorResponse } from '@/types/common';

export const getApiErrorResponse = ({
  message,
  statusCode,
  data,
}: {
  message: string;
  statusCode: HttpStatus;
  data?: Record<string, unknown>;
}): ApiErrorResponse => {
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
