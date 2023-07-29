import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '@/api/base-entity/base.service';
import { OperationPause } from '@/api/operation-pause/operation-pause.entity';
import { OperationPauseCreateRequestDto } from '@/api/operation-pause/dto/operation-pause-create.request.dto';
import { OperationService } from '@/api/operation/operation.service';
import { isNil } from 'lodash';
import { Operation } from '@/api/operation/operation.entity';
import { isBefore, isAfter } from 'date-fns';
import { ValidationError } from '@/error/validation.error';
import { RouteNoDataFoundError } from '@/error/route-no-data-found.error';
import { OperationPauseRepository } from '@/api/operation-pause/operation-pause.repository';
import { differenceInHours, addHours } from 'date-fns';

@Injectable()
export class OperationPauseService extends BaseService<OperationPause> {
  constructor(
    @Inject(OperationService)
    private readonly operationService: OperationService,
    @Inject(OperationPauseRepository)
    private readonly operationPauseRepository: OperationPauseRepository,
  ) {
    super(OperationPause);
  }

  public async create(
    operationPauseCreateRequestDto: OperationPauseCreateRequestDto,
    operationId: number,
  ) {
    const { startAt, endAt } = operationPauseCreateRequestDto;

    const operation = await this.operationService.findById(operationId);

    if (isNil(operation)) {
      throw new RouteNoDataFoundError(Operation);
    }

    if (isBefore(operation.endDate, new Date())) {
      throw new ValidationError(`pause can't be applied to ended operation`);
    }

    if (
      isBefore(startAt, operation.startDate) ||
      (endAt && isAfter(endAt, operation.endDate))
    ) {
      throw new ValidationError(
        'startAt and endAt must be in operation time range',
      );
    }

    const [hasPresentActivePause, activePauses] = await this.hasActivePauses(
      operationId,
    );

    if (hasPresentActivePause) {
      throw new ValidationError(
        `operation [${operationId}] already have active pauses [${activePauses.map(
          ({ id }) => id,
        )}]`,
      );
    }

    if (startAt && endAt) {
      const alreadyDoneOperationHours = differenceInHours(
        operation.startDate,
        startAt,
      );
      const pauseHours = differenceInHours(startAt, endAt);

      const updatedOperation = await this.operationService.update(operationId, {
        endDate: addHours(
          operation.endDate,
          pauseHours - alreadyDoneOperationHours,
        ),
      });

      this.operationPauseRepository.create({
        ...operationPauseCreateRequestDto,
        operation: updatedOperation,
      });
    }

    return this.operationPauseRepository.create({
      ...operationPauseCreateRequestDto,
      operation,
    });
  }

  public async hasActivePauses(
    operationId: number,
  ): Promise<[boolean, OperationPause[]]> {
    const dateNow = new Date();

    const [pauses, count] = await this.operationPauseRepository
      .createQueryBuilder()
      .select()
      .where(
        'operationId = :operationId AND ( endAt IS NULL OR ( startAt < :dateNow AND endAt > :dateNow ))',
        { operationId, dateNow },
      )
      .getManyAndCount();

    return [!!count, pauses];
  }
}
