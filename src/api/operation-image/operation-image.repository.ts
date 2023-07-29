import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { OperationImage } from '@/api/operation-image/operation-image.entity';

@Injectable()
export class OperationImageRepository extends Repository<OperationImage> {
  public constructor(private readonly dataSource: DataSource) {
    super(OperationImage, dataSource.createEntityManager());
  }
}
