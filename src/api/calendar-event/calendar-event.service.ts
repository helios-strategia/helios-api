import { Inject, Injectable, Logger } from '@nestjs/common';
import { CalendarEventCreateRequestDto } from '@/api/calendar-event/dto/calendar-event-create.request.dto';
import { CalendarEventRepository } from '@/api/calendar-event/calendar-event.repository';
import { PlantService } from '@/api/plant/plant.service';
import { isNil } from 'lodash';
import { NoDataFoundError } from '@/error/no-data-found.error';
import { Plant } from '@/api/plant/plant.entity';
import { TransactionPerformer } from '@/service/transaction-performer';
import { CalendarEventImageService } from '@/api/calendar-event-images/calendar-event-image.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { CalendarEvent } from '@/api/calendar-event/calendar-event.entity';
import { CalendarEventUpdateRequestDto } from '@/api/calendar-event/dto/calendar-event-update.request.dto';
import { RouteNoDataFoundError } from '@/error/route-no-data-found.error';
import { getDeleteApiResponse } from '@/utils';
import { CalendarEventResponseDto } from '@/api/calendar-event/dto/calendar-event.response.dto';

@Injectable()
export class CalendarEventService {
  @Inject(CalendarEventRepository)
  private readonly calendarEventRepository: CalendarEventRepository;
  @Inject(PlantService)
  private readonly plantService: PlantService;
  @Inject(CalendarEventImageService)
  private readonly calendarEventImageService: CalendarEventImageService;
  @Inject(TransactionPerformer)
  private readonly transactionPerformer: TransactionPerformer;
  @InjectMapper()
  private readonly classMapper: Mapper;

  public async create(
    calendarEventCreateRequest: CalendarEventCreateRequestDto,
  ) {
    const { images, plantId, ...restCalendarEventCreateRequestDto } =
      calendarEventCreateRequest;
    const plant = await this.plantService.findByIdOrElseThrowNotFoundError(
      plantId,
    );

    if (isNil(plant)) {
      throw new NoDataFoundError(Plant, plantId);
    }

    if (images?.length) {
      const trxResult = await this.transactionPerformer.perform({
        callback: async () => {
          const calendarEventImages =
            await this.calendarEventImageService.bulkCreate(...images);

          return this.calendarEventRepository.save(
            {
              ...restCalendarEventCreateRequestDto,
              images: calendarEventImages,
              plant,
            },
            { transaction: false },
          );
        },
      });

      if (!trxResult.success) {
        throw trxResult.error;
      }

      Logger.log('CalendarEventService#create', {
        calendarEvent: trxResult.data,
      });

      return this.classMapper.map(trxResult.data, CalendarEvent, CalendarEvent);
    }

    const calendarEvent = await this.calendarEventRepository.save({
      ...restCalendarEventCreateRequestDto,
      plant,
    });

    Logger.log('CalendarEventService#create', {
      calendarEvent,
    });

    return this.classMapper.map(
      calendarEvent,
      CalendarEvent,
      CalendarEventResponseDto,
    );
  }

  public async update(
    id: number,
    calendarEventUpdateRequest: CalendarEventUpdateRequestDto,
  ) {
    const oldCalendarEvent = await this.getById(id);
    const updateResult = await this.calendarEventRepository.update(
      id,
      calendarEventUpdateRequest,
    );

    Logger.log('CalendarEventService#update', {
      calendarEventUpdateRequest,
      updateResult,
      oldCalendarEvent,
    });

    return this.classMapper.map(
      await this.calendarEventRepository.findOne({ where: { id } }),
      CalendarEvent,
      CalendarEventResponseDto,
    );
  }

  private async findAllByPlantAndStartAtAndEndAt({
    plantId,
    startDate,
    endDate,
  }: {
    plantId: number;
    startDate?: Date;
    endDate?: Date;
  }) {
    return this.classMapper.mapArray(
      await this.calendarEventRepository.findAllByPlantAndStartAtAndEndAt({
        plantId,
        startDate,
        endDate,
      }),
      CalendarEvent,
      CalendarEventResponseDto,
    );
  }

  private async getById(id: number) {
    const calendarEvent = await this.calendarEventRepository.findOne({
      where: { id },
      relations: { pauses: true, images: true },
    });

    if (isNil(calendarEvent)) {
      throw new RouteNoDataFoundError(CalendarEvent, id);
    }

    return calendarEvent;
  }

  public async delete(id: number) {
    const calendarEventToDelete = await this.getById(id);
    const deleteResult = await this.calendarEventRepository.delete(id);

    Logger.log('CalendarEventService#delete', {
      id,
      calendarEventToDelete,
      deleteResult,
    });

    return getDeleteApiResponse(CalendarEvent, id);
  }
}
