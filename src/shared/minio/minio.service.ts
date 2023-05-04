import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions } from 'minio';

@Injectable()
export class MinioConfigService {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  public create(): ClientOptions {
    return {
      endPoint: this.configService.get<string>('file_storage.minio.end_point'),
      port: this.configService.get<number>('file_storage.minio.port'),
      useSSL: this.configService.get<boolean>('file_storage.minio.use_ssl'),
      accessKey: this.configService.get<string>('file_storage.minio.root_user'),
      secretKey: this.configService.get<string>(
        'file_storage.minio.root_password',
      ),
    };
  }
}
