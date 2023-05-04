import { format, LoggerOptions, transports } from 'winston';

const myFormat = format.printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message} `;
  if (metadata) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

const TransportsStrategy = (env: string) => {
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

export const loggerOptions: LoggerOptions = {
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.timestamp(), myFormat),
    }),
  ],
};
