import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { Operation } from '@/api/operation/operation.entity';
import { BaseImageEntity } from '@/api/base-image-entity/base-image.entity';
import { defaultRelationOptions } from '@/consts';

@Entity({ name: 'operation_images' })
@Index(['url'], { unique: false })
@Index(['name'], { unique: false })
export class OperationImage extends BaseImageEntity {
  @ManyToOne(
    () => Operation,
    (operation) => operation.images,
    defaultRelationOptions,
  )
  @JoinColumn([{ name: 'operation_id', referencedColumnName: 'id' }])
  public readonly operation: Operation;
}
