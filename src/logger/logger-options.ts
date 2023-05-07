import { format, LoggerOptions, transports } from 'winston';
import { myFormat } from '@/logger/format';

export const loggerOptions: LoggerOptions = {
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.timestamp(), myFormat),
    }),
  ],
};
