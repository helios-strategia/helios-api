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
import { isBefore, isEqual, isAfter } from 'date-fns';
import { ValidationError } from '@/error/validation.error';
import { DBConflictError } from '@/error/d-b-conflict.error';
import { DateString, UserRole } from '@/types';

@Injectable()
export class OperationService extends BaseService<Operation> {
  @Inject(OperationRepository)
  private readonly operationRepository: OperationRepository;
  @Inject(PlantService)
  private readonly plantService: PlantService;
  @Inject(OperationImageService)
  private readonly operationImageService: OperationImageService;
  @Inject(TransactionPerformer)
  private readonly transactionPerformer: TransactionPerformer;

  constructor() {
    super(Operation);
  }

  public async create(operationCreateRequestDto: OperationCreateRequestDto) {
    const { images, plantId, ...restOperationCreateRequestDto } =
      operationCreateRequestDto;
    const { startDate, title } = restOperationCreateRequestDto;
    const plant = await this.plantService.findByIdOrElseThrowNotFoundError(
      plantId,
    );

    if (isAfter(new Date(), operationCreateRequestDto.startDate)) {
      throw new ValidationError(`Can't create operation in past`);
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
      const {
        success,
        data: operation,
        error,
      } = await this.transactionPerformer.perform({
        callback: async () => {
          const operationImages = await this.operationImageService.bulkCreate(
            ...images,
          );

          return this.operationRepository.save(
            {
              ...restOperationCreateRequestDto,
              images: operationImages,
              plant,
            },
            { transaction: false },
          );
        },
      });

      if (!success) {
        throw error;
      }

      Logger.log(`${this.className}#create`, {
        operation,
      });

      return operation;
    }

    const operation = await this.operationRepository.save({
      ...restOperationCreateRequestDto,
      plant,
    });

    Logger.log(`${this.className}#create`, {
      operation,
    });

    return operation;
  }

  public async update(
    id: number,
    operationUpdateRequestDto: OperationUpdateRequestDto,
  ) {
    const oldOperation = await this.findByIdOrElseThrow(id);
    const updateResult = await this.operationRepository.update(
      id,
      operationUpdateRequestDto,
    );

    Logger.log(`${this.className}#update`, {
      ...this.getLogMeta,
      operationUpdateRequestDto,
      updateResult,
      oldOperation,
    });

    return this.operationRepository.findOne({ where: { id } });
  }

  public async findAllByPlantAndStartAtAndEndAt({
    plantId,
    startDate,
    endDate,
  }: {
    plantId: number;
    startDate?: DateString;
    endDate?: DateString;
  }) {
    if (this.requestContextService.getUser.role === UserRole.CLIENT) {
      const userPlants = await this.plantService.findAllByUserId(
        this.requestContextService.getUserId,
      );

      if (!userPlants.some(({ id }) => id === plantId)) {
        throw new RouteNoDataFoundError(Plant, plantId);
      }
    }

    return this.operationRepository.findAllByPlantAndStartAtAndEndAt({
      plantId,
      startDate,
      endDate,
    });
  }

  public async findByIdOrElseThrow(id: number) {
    const operation = await this.operationRepository.findOne({
      where: { id },
      relations: { pauses: true, images: true },
    });

    if (isNil(operation)) {
      throw new RouteNoDataFoundError(Operation, id);
    }

    return operation;
  }

  public findById(id: number) {
    return this.operationRepository.findOne({ where: { id } });
  }

  public async delete(id: number) {
    const operationToDelete = await this.findByIdOrElseThrow(id);
    const deleteResult = await this.operationRepository.delete(id);

    Logger.log(`${this.className}#delete`, {
      ...this.getLogMeta,
      id,
      calendarEventToDelete: operationToDelete,
      deleteResult,
    });

    return getDeleteApiResponse(Operation, id);
  }
}
