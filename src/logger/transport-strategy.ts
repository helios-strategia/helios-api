import { format, transports } from 'winston';
import { myFormat } from '@/logger/format';

export const TransportsStrategy = (env: string) => {
  switch (env) {
    case 'production':
      return [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.timestamp(),
            myFormat,
          ),
        }),
        new transports.File({
          filename: 'logs/log.txt',
          format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            format.align(),
            format.json(),
            myFormat,
          ),
        }),
        new transports.File({
          level: 'error',
          filename: 'logs/error.txt',
          format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            format.align(),
            format.json(),
            myFormat,
          ),
        }),
      ];
    default:
      return [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.timestamp(),
            myFormat,
          ),
        }),
      ];
  }
};
