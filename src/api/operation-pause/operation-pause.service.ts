import { Inject, Injectable, Logger } from '@nestjs/common';
import { BaseService } from '@/api/base-entity/base.service';
import { OperationPause } from '@/api/operation-pause/operation-pause.entity';
import { OperationService } from '@/api/operation/operation.service';
import { isNil } from 'lodash';
import { add, differenceInDays, isBefore } from 'date-fns';
import { ValidationError } from '@/error/validation.error';
import { OperationPauseRepository } from '@/api/operation-pause/operation-pause.repository';
import { TransactionPerformer } from '@/library/transaction-performer';

@Injectable()
export class OperationPauseService extends BaseService<OperationPause> {
  constructor(
    @Inject(OperationService)
    private readonly operationService: OperationService,
    @Inject(OperationPauseRepository)
    private readonly operationPauseRepository: OperationPauseRepository,
    @Inject(TransactionPerformer)
    private readonly transactionPerformer: TransactionPerformer,
  ) {
    super(OperationPause);
  }

  public async create(operationId: number) {
    const operation = await this.operationService.findByIdOrElseThrow(
      operationId,
    );

    if (isBefore(operation.endDate, new Date())) {
      throw new ValidationError(`pause can't be applied to ended operation`);
    }

    if (operation.pauses?.some(({ endAt }) => !isNil(endAt))) {
      throw new ValidationError(
        `operation [${operationId}] already have active pause`,
      );
    }

    const operationPause = await this.operationPauseRepository.save({
      operation,
      startAt: new Date(),
    });

    Logger.log(`${this.className}#create`, {
      operationPause,
    });

    return operationPause;
  }

  public async end(operationId: number) {
    const operation = await this.operationService.findByIdOrElseThrow(
      operationId,
    );
    const activePause = operation.pauses?.find(({ endAt }) => isNil(endAt));

    if (isNil(activePause)) {
      throw new ValidationError(
        `operation [${operationId}] haven't active pauses`,
      );
    }

    const {
      data: [updateResult, updatedOperation] = [],
      success,
      error,
    } = await this.transactionPerformer.perform({
      callback: async () => {
        const endAt = new Date();

        return Promise.all([
          this.operationPauseRepository.update(activePause.id, {
            endAt,
          }),
          this.operationService.update(operationId, {
            endDate: add(operation.endDate, {
              days: differenceInDays(endAt, operation.startDate),
            }),
          }),
        ]);
      },
    });

    if (!success) {
      throw error;
    }

    Logger.log(`${this.className}#end`, {
      operationPauseId: activePause.id,
      updateResult,
      updatedOperation,
    });
  }
}
