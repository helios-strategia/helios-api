import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TimeService } from '@/service/time-service/time.service';
import { TimeServiceModule } from '@/service/time-service/time-service.module';
import { FileService } from '@/service/file-serivce/file-service';
import { MinioFileService } from './file-serivce/minio-file-service';
import { FileServiceModule } from './file-serivce/file-service.module';

@Global()
@Module({
  imports: [HttpModule, FileServiceModule, TimeServiceModule],
  exports: [FileServiceModule, TimeServiceModule],
})
export class ServiceModule {}
