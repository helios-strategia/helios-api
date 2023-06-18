import { DataSource, Repository } from 'typeorm';
import { Model_30917 } from '@/api/model-30917/model-30917.entity';
import { Injectable } from '@nestjs/common';
import { SourcePoint } from '@/api/source-point/source-point.entity';
import { Plant } from '../plant/plant.entity';
import { isEmpty } from 'lodash';
import { Model30917Channel } from '@/types/model-30917';

export type GetDayKvtPerHalfHourByChannelResult = {
  m_channel: Model30917Channel;
  kvt_per_half_hour: number[];
  source_point_code: number;
}[];
export type GetDaysSumByChannelResult = {
  m_channel: Model30917Channel;
  sum: number[];
}[];

@Injectable()
export class Model30917Repository extends Repository<Model_30917> {
  constructor(private dataSource: DataSource) {
    super(Model_30917, dataSource.createEntityManager());
  }

  public async getDaysSumByChannel(
    plantId: number,
    channels: Model30917Channel[],
    startDay: string,
    endDay: string,
    excludeSourcePoints?: number[],
  ): Promise<GetDaysSumByChannelResult> {
    const queryBuilder = this.createQueryBuilder('m')
      .select('m.channel')
      .addSelect('sum(m.sum)')
      .innerJoin(SourcePoint, 'sp', 'm.source_point_id = sp.id')
      .innerJoin(Plant, 'p', 'p.ascme_plant_code = m.company_code')
      .where('p.id = :plantId', { plantId })
      .andWhere('m.channel IN (:...channels)', { channels })
      .andWhere('date between :startDay and :endDay', { startDay, endDay });

    if (!isEmpty(excludeSourcePoints)) {
      queryBuilder.andWhere(
        'sp.source_point_code NOT IN (:...excludeSourcePoints)',
        { excludeSourcePoints },
      );
    }

    return queryBuilder
      .andWhere('sp.is_commercial')
      .groupBy('m.channel')
      .getRawMany();
  }

  public async getDayKvtPerHalfHourByChannel(
    plantId: number,
    channels: Model30917Channel[],
    day: string,
    excludeSourcePoints?: number[],
  ): Promise<GetDayKvtPerHalfHourByChannelResult> {
    const queryBuilder = this.createQueryBuilder('m')
      .select('m.channel')
      .addSelect('m.kvt_per_half_hour')
      .addSelect('sp.source_point_code')
      .innerJoin(SourcePoint, 'sp', 'm.source_point_id = sp.id')
      .innerJoin(Plant, 'p', 'p.ascme_plant_code = m.company_code')
      .where('p.id = :plantId', { plantId })
      .andWhere('m.channel IN (:...channels)', { channels })
      .andWhere('date = :day', { day });

    if (!isEmpty(excludeSourcePoints)) {
      queryBuilder.andWhere(
        'sp.source_point_code NOT IN (:...excludeSourcePoints)',
        { excludeSourcePoints },
      );
    }

    return queryBuilder.andWhere('sp.is_commercial').getRawMany();
  }
}
