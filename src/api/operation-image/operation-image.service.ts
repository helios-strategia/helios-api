import { Inject, Injectable, Logger } from '@nestjs/common';

import { MinioFileService } from '@/library/file-serivce/minio-file-service';
import { MemoryStoredFile } from 'nestjs-form-data';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { OperationImageRepository } from '@/api/operation-image/operation-image.repository';
import { Operation } from '@/api/operation/operation.entity';
import { OperationImage } from '@/api/operation-image/operation-image.entity';
import { OperationImageResponseDto } from '@/api/operation-image/dto';

@Injectable()
export class OperationImageService {
  @Inject(OperationImageRepository)
  private readonly calendarEventImageRepository: OperationImageRepository;
  @Inject(MinioFileService)
  private readonly fileService: MinioFileService;
  @InjectMapper()
  private readonly classMapper: Mapper;

  public async create({
    url,
    name,
    operation,
  }: {
    url: string;
    name: string;
    operation: Operation;
  }) {
    return this.calendarEventImageRepository.save({
      url,
      name,
      operation: operation,
    });
  }

  public async bulkCreate(...images: MemoryStoredFile[]) {
    const imagesSaved = await Promise.all(
      images.map(async (image) => {
        const url = await this.fileService.upload(image);

        return this.calendarEventImageRepository.save(
          {
            url,
            name: image.originalName,
          },
          { transaction: false },
        );
      }),
    );

    Logger.log('CalendarEventImageService#bulkCreate', {
      imagesSaved,
    });

    return this.classMapper.mapArray(
      imagesSaved,
      OperationImage,
      OperationImageResponseDto,
    );
  }

  public async delete(id: number) {
    const deleteResult = await this.calendarEventImageRepository.delete({ id });

    Logger.log('CalendarEventImageService#delete', {
      affected: deleteResult.affected,
    });

    return deleteResult;
  }

  public async findById(id: number) {
    return this.calendarEventImageRepository.findOne({
      where: { id },
    });
  }

  public async findByName(imageName: string) {
    return this.calendarEventImageRepository.findOne({
      where: { name: imageName },
    });
  }
}
