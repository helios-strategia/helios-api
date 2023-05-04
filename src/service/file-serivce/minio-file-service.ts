import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { MemoryStoredFile } from 'nestjs-form-data';
import { ConfigService } from '@nestjs/config';
import { FileService } from './file-service.types';

@Injectable()
export class MinioFileService implements FileService, OnApplicationBootstrap {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  constructor(private readonly minio: MinioService) {}

  async onApplicationBootstrap() {
    if (process.env.NODE_ENV === 'development') {
      if (!(await this.minio.client.bucketExists('public'))) {
        await this.minio.client.makeBucket('public');
      }
    }
  }

  public async delete(
    fileName: string,
    bucketName = this.configService.get<string>(
      'file_storage.minio.default_public_bucket',
    ),
  ) {
    await this.minio.client.removeObject(bucketName, fileName);

    Logger.log('MinioFileService#delete', {
      fileName,
      bucketName,
    });
  }

  public async upload(
    file: MemoryStoredFile,
    bucketName = this.configService.get<string>(
      'file_storage.minio.default_public_bucket',
    ),
  ) {
    const metaData = {
      'Content-Type': file.mimetype,
    };

    const fileName = file.originalName;

    await this.minio.client.putObject(
      bucketName,
      fileName,
      file.buffer,
      metaData,
    );

    Logger.log('MinioFileService#upload', {
      fileName,
      size: file.size,
    });

    return this.fileUrlResolver({ bucketName, fileName });
  }

  private fileUrlResolver({
    bucketName,
    fileName,
  }: {
    bucketName: string;
    fileName: string;
  }) {
    const endPoint = this.configService.get<string>(
      'file_storage.minio.end_point',
    );

    switch (endPoint) {
      case 'localhost':
      case 'storage':
        return `localhost:9010/${bucketName}/${fileName}`;
      default:
        return `${endPoint}:${this.configService.get<string>(
          'file_storage.minio.port',
        )}/${bucketName}/${fileName}`;
    }
  }
}
