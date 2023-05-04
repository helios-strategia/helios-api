import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FileService } from '@/service/file-serivce/file-service';
import { MinioFileService } from './minio-file-service';
import { MinioModule } from 'nestjs-minio-client';
import { MinioService } from 'nestjs-minio-client';
import { MinioConfigService } from '../../shared/minio/minio.service';

@Global()
@Module({
  imports: [
    HttpModule,
    MinioModule.registerAsync({ useClass: MinioConfigService }),
  ],
  providers: [FileService, MinioFileService],
  exports: [FileService, MinioFileService],
})
export class FileServiceModule {}
