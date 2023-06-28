import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseEntity } from '@/api/base-entity/base.entity';
import { BaseEntityResponseDto } from '@/api/base-entity/base-entity.response.dto';
import { Plant } from '@/api/plant/plant.entity';

export abstract class BaseService<
  TEntity extends BaseEntity & { type: TEntity; name: string },
  TResponseDto extends BaseEntityResponseDto,
  TRepository extends Repository<TEntity>,
> {
  protected constructor(
    @InjectDataSource() protected readonly dataSource: DataSource,
  ) {}

  protected abstract get entity(): TEntity;
  protected abstract get entityResponseDto(): TResponseDto;

  protected save() {
    this.dataSource.getRepository(this.entity);
  }
}
