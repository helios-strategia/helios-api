import { BaseImageEntity } from '@/api/base-image-entity/base-image.entity';
import { BaseEntity } from '@/api/base-entity/base.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { MinioFileService } from '@/service/file-serivce/minio-file-service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { CalendarEventImage } from '@/api/calendar-event-images/calendar-event-image.entity';
import { CalendarEvent } from '@/api/calendar-event/calendar-event.entity';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { CalendarEventImageRepository } from '@/api/calendar-event-images/calendar-event-image.repository';

type Constructor<T = any> = new (...args: any[]) => T;

export abstract class BaseImageService<
  T extends BaseImageEntity,
  R extends BaseEntity,
> {
  @InjectDataSource()
  protected readonly dataSource: DataSource;
  @Inject(MinioFileService)
  protected readonly fileService: MinioFileService;
  @InjectMapper()
  private readonly classMapper: Mapper;

  protected abstract get entityImageConstructor(): Constructor<T>;
  protected abstract get mainEntityIndentyfier(): keyof T;

  protected constructor(private readonly repository: Repository<T>) {}

  public async create({
    url,
    name,
    mainEntity,
  }: {
    url: string;
    name: string;
    mainEntity: R;
  }) {}
}
