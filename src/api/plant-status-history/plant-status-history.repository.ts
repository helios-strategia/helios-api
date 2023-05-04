import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PlantStatusHistory } from '@/api/plant-status-history/plant-status-history.entity';

@Injectable()
export class PlantStatusHistoryRepository extends Repository<PlantStatusHistory> {
  constructor(private dataSource: DataSource) {
    super(PlantStatusHistory, dataSource.createEntityManager());
  }
}
