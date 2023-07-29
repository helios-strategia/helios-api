import { DataSource, Repository } from 'typeorm';
import { OperationPause } from '@/api/operation-pause/operation-pause.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OperationPauseRepository extends Repository<OperationPause> {
  constructor(private readonly dataSource: DataSource) {
    super(OperationPause, dataSource.createEntityManager());
  }
}
