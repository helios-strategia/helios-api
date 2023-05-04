import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NoDataFoundExceptionFilter } from '@/filter/no-data-found-exception.filter';
import { RequestIdInterceptor } from '@/interceptor/request-id.interceptor';
import { WinstonModule } from 'nest-winston';
import { loggerOptions } from '@/logger';
import { ValidationExceptionFilter } from '@/filter/validation-exception.filter';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerOptions),
  });
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('http.port');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Helios CRM API')
    .setDescription('Helios CRM API')
    .setVersion('1.0')
    .addTag('Helios')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api/doc', app, document);

  app.useGlobalInterceptors(new RequestIdInterceptor());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new NoDataFoundExceptionFilter());
  app.useGlobalFilters(new ValidationExceptionFilter());
  app.use(
    morgan(
      ':remote-addr :method :url :status :res[content-length] b - :response-time ms',
      {
        stream: {
          write: (text: string) => {
            Logger.log(text);
          },
        },
      },
    ),
  );

  await app.listen(port, async () => {
    Logger.log(`App start with profile: ${process.env.NODE_ENV}`);
    Logger.log(`App start in port ${port}`);
  });
}

bootstrap();
