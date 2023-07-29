import { Inject, Injectable, Logger } from '@nestjs/common';
import { OperationCreateRequestDto } from '@/api/operation/dto/operation-create.request.dto';
import { OperationRepository } from '@/api/operation/operation.repository';
import { PlantService } from '@/api/plant/plant.service';
import { isNil } from 'lodash';
import { NoDataFoundError } from '@/error/no-data-found.error';
import { Plant } from '@/api/plant/plant.entity';
import { TransactionPerformer } from '@/library/transaction-performer';
import { OperationImageService } from '@/api/operation-image/operation-image.service';
import { Operation } from '@/api/operation/operation.entity';
import { OperationUpdateRequestDto } from '@/api/operation/dto/operation-update.request.dto';
import { RouteNoDataFoundError } from '@/error/route-no-data-found.error';
import { getDeleteApiResponse } from '@/utils';
import { BaseService } from '@/api/base-entity/base.service';
import { isBefore, isEqual } from 'date-fns';
import { ValidationError } from '@/error/validation.error';
import { DBConflictError } from '@/error/d-b-conflict.error';

@Injectable()
export class OperationService extends BaseService<Operation> {
  @Inject(OperationRepository)
  private readonly operationRepository: OperationRepository;
  @Inject(PlantService)
  private readonly plantService: PlantService;
  @Inject(OperationImageService)
  private readonly calendarEventImageService: OperationImageService;
  @Inject(TransactionPerformer)
  private readonly transactionPerformer: TransactionPerformer;

  constructor() {
    super(Operation);
  }

  public async create(operationCreateRequestDto: OperationCreateRequestDto) {
    const { images, plantId, ...restCalendarEventCreateRequestDto } =
      operationCreateRequestDto;
    const { startDate, title } = restCalendarEventCreateRequestDto;
    const plant = await this.plantService.findByIdOrElseThrowNotFoundError(
      plantId,
    );

    if (isNil(plant)) {
      throw new NoDataFoundError(Plant, plantId);
    }

    if (
      isEqual(
        operationCreateRequestDto.startDate,
        operationCreateRequestDto.endDate,
      ) ||
      isBefore(
        operationCreateRequestDto.endDate,
        operationCreateRequestDto.startDate,
      )
    ) {
      throw new ValidationError(
        'endData must not equal or less than startDate',
      );
    }

    if (
      await this.operationRepository.count({
        where: { plantId, startDate, title },
      })
    ) {
      throw new DBConflictError(
        'Operation for this plant and date already exists',
      );
    }

    if (images?.length) {
      const trxResult = await this.transactionPerformer.perform({
        callback: async () => {
          const calendarEventImages =
            await this.calendarEventImageService.bulkCreate(...images);

          return this.operationRepository.save(
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

      Logger.log(`${this.className}#create`, {
        calendarEvent: trxResult.data,
      });

      return trxResult.data;
    }

    const calendarEvent = await this.operationRepository.save({
      ...restCalendarEventCreateRequestDto,
      plant,
    });

    Logger.log(`${this.className}#create`, {
      calendarEvent,
    });

    return calendarEvent;
  }

  public async update(
    id: number,
    calendarEventUpdateRequest: OperationUpdateRequestDto,
  ) {
    const oldCalendarEvent = await this.findByIdOrElseThrow(id);
    const updateResult = await this.operationRepository.update(
      id,
      calendarEventUpdateRequest,
    );

    Logger.log(`${this.className}#update`, {
      ...this.getLogMeta,
      calendarEventUpdateRequest,
      updateResult,
      oldCalendarEvent,
    });

    return this.operationRepository.findOne({ where: { id } });
  }

  public async findAllByPlantAndStartAtAndEndAt({
    plantId,
    startDate,
    endDate,
  }: {
    plantId: number;
    startDate?: Date;
    endDate?: Date;
  }) {
    const userPlants = await this.plantService.findAllByUserId(
      this.requestContextService.getUserId,
    );

    if (!userPlants.some(({ id }) => id === plantId)) {
      throw new RouteNoDataFoundError(Plant, plantId);
    }

    return this.operationRepository.findAllByPlantAndStartAtAndEndAt({
      plantId,
      startDate,
      endDate,
    });
  }

  public async findByIdOrElseThrow(id: number) {
    const calendarEvent = await this.operationRepository.findOne({
      where: { id },
      relations: { pauses: true, images: true },
    });

    if (isNil(calendarEvent)) {
      throw new RouteNoDataFoundError(Operation, id);
    }

    return calendarEvent;
  }

  public findById(id: number) {
    return this.operationRepository.findOne({ where: { id } });
  }

  public async delete(id: number) {
    const calendarEventToDelete = await this.findByIdOrElseThrow(id);
    const deleteResult = await this.operationRepository.delete(id);

    Logger.log('OperationService#delete', {
      ...this.getLogMeta,
      id,
      calendarEventToDelete,
      deleteResult,
    });

    return getDeleteApiResponse(Operation, id);
  }
}
