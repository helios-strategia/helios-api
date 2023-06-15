import { Inject, Injectable, Logger } from '@nestjs/common';

import { MinioFileService } from '@/service/file-serivce/minio-file-service';
import { MemoryStoredFile } from 'nestjs-form-data';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { CalendarEventImageRepository } from "@/api/calendar-event-images/calendar-event-image.repository";
import { CalendarEvent } from "@/api/calendar-event/calendar-event.entity";
import { CalendarEventImage } from "@/api/calendar-event-images/calendar-event-image.entity";
import { CalendarEventImageResponseDto } from "@/api/calendar-event-images/dto";

@Injectable()
export class CalendarEventImageService {
  @Inject(CalendarEventImageRepository)
  private readonly calendarEventImageRepository: CalendarEventImageRepository;
  @Inject(MinioFileService)
  private readonly fileService: MinioFileService;
  @InjectMapper()
  private readonly classMapper: Mapper;

  public async create({
    url,
    name,
    calendarEvent,
  }: {
    url: string;
    name: string;
    calendarEvent: CalendarEvent;
  }) {
    return this.calendarEventImageRepository.save({
      url,
      name,
      calendarEvent,
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
      CalendarEventImage,
      CalendarEventImageResponseDto,
    );
  }

  public async delete(id: number) {
    const deleteResult =
      await this.calendarEventImageRepository.delete({ id });

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
