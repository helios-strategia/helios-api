import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import {
  GetDayKvtPerHalfHourByChannelResult,
  GetDaysSumByChannelResult,
  Model30917Repository,
} from '@/api/model-30917/model-30917.repository';
import { PlantService } from '@/api/plant/plant.service';
import { NoDataFoundError } from '@/error/no-data-found.error';
import { Plant } from '@/api/plant/plant.entity';
import { zip } from 'lodash';
import { RequestContextService } from '@/request-context/request-context.service';
import { UserRole } from '@/types/user';
import {
  DayKvtPerHalfHourByChannelResponseDto,
  DaysSumByChannelResponseDto,
} from '@/types/ascme';
import { Model30917Channel } from '@/types/model-30917';

@Injectable()
export class AscmeService {
  @Inject(Model30917Repository)
  private readonly model30917Repository: Model30917Repository;
  @Inject()
  private readonly plantService: PlantService;
  @Inject()
  private readonly requestContextService: RequestContextService;

  public async getDaysSumByChannel({
    plantId,
    channels,
    dayEnd,
    dayStart,
    excludeSourcePoints,
  }: {
    plantId: number;
    channels: Model30917Channel[];
    dayStart: string;
    dayEnd: string;
    excludeSourcePoints?: number[];
  }) {
    if (!(await this.plantService.isPresent(plantId))) {
      throw new NoDataFoundError(Plant, plantId);
    }

    return this.fetchByRole<DaysSumByChannelResponseDto>(
      async () =>
        this.mapRowsToSumByChannel(
          await this.model30917Repository.getDaysSumByChannel(
            plantId,
            channels,
            dayStart,
            dayEnd,
            excludeSourcePoints,
          ),
        ),
      plantId,
    );
  }

  public async getDayKvtPerHalfHourByChannel({
    plantId,
    channels,
    day,
    excludeSourcePoints,
  }: {
    plantId: number;
    channels: Model30917Channel[];
    day: string;
    excludeSourcePoints?: number[];
  }) {
    if (!(await this.plantService.isPresent(plantId))) {
      throw new NoDataFoundError(Plant, plantId);
    }

    return this.fetchByRole<DayKvtPerHalfHourByChannelResponseDto>(
      async () =>
        this.mapRowsToSumByChannelAndSourcePoint(
          await this.model30917Repository.getDayKvtPerHalfHourByChannel(
            plantId,
            channels,
            day,
            excludeSourcePoints,
          ),
        ),
      plantId,
    );
  }

  private async fetchByRole<T>(
    fetchCallback: () => Promise<T>,
    plantId: number,
  ) {
    switch (this.requestContextService.getUser.role) {
      case UserRole.ADMIN:
        return fetchCallback();
      case UserRole.CLIENT:
        const userPlantIds = await this.plantService
          .findAllByUserId(this.requestContextService.getUserId)
          .then((plants) => plants.map(({ id }) => id));

        if (!userPlantIds.includes(plantId)) {
          throw new ForbiddenException();
        }

        return fetchCallback();
      default:
        throw new Error('Mismatch role');
    }
  }

  private mapRowsToSumByChannelAndSourcePoint(
    rows: GetDayKvtPerHalfHourByChannelResult,
  ) {
    return rows.reduce(
      (result, val) => ({
        ...result,
        [val.m_channel]: {
          ...result[val.m_channel],
          sum: result?.[val.m_channel]?.['sum']
            ? zip(result?.[val.m_channel]?.['sum'], val.kvt_per_half_hour).map(
                ([a, b]: [number, number]) => a + b,
              )
            : val.kvt_per_half_hour,
          [val.source_point_code]: val.kvt_per_half_hour,
        },
      }),
      {} as DayKvtPerHalfHourByChannelResponseDto,
    );
  }

  private mapRowsToSumByChannel(rows: GetDaysSumByChannelResult) {
    return rows.reduce(
      (acc, val) => ({
        ...acc,
        [val.m_channel]: val.sum,
      }),
      {} as DaysSumByChannelResponseDto,
    );
  }
}
