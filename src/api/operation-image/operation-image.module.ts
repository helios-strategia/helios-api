import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryModule } from '@/library/library.module';
import { OperationImage } from '@/api/operation-image/operation-image.entity';
import { OperationImageRepository } from '@/api/operation-image/operation-image.repository';
import { OperationImageService } from '@/api/operation-image/operation-image.service';
import { OperationImageProfile } from '@/api/operation-image/operation-image.profile';

@Module({
  imports: [TypeOrmModule.forFeature([OperationImage]), LibraryModule],
  providers: [
    OperationImageRepository,
    OperationImageService,
    OperationImageProfile,
  ],
  exports: [OperationImageService],
})
export class OperationImageModule {}
