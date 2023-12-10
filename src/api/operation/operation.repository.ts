import { DataSource, Repository } from 'typeorm';
import { Operation } from '@/api/operation/operation.entity';
import { Injectable } from '@nestjs/common';
import { DateString } from '@/types';

@Injectable()
export class OperationRepository extends Repository<Operation> {
  constructor(private readonly dataSource: DataSource) {
    super(Operation, dataSource.createEntityManager());
  }

  public findAllByPlantAndStartAtAndEndAt({
    plantId,
    startDate,
    endDate,
  }: {
    plantId: number;
    startDate?: DateString;
    endDate?: DateString;
  }) {
    const query = this.createQueryBuilder().where('plant_id = :plantId', {
      plantId,
    });

    if (startDate && endDate) {
      query
        .andWhere('start_date >= :startDate', { startDate })
        .andWhere('end_date <= :endDate', { endDate });
    } else if (startDate) {
      query.andWhere('start_date >= :startDate', { startDate });
    } else if (endDate) {
      query.andWhere('end_date <= :endDate', { endDate });
    }

    return query.getMany();
  }
}
