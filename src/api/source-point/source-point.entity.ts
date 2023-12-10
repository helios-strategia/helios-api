import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Model_30917 } from '../model-30917/model-30917.entity';
import { BaseEntity } from '../base-entity/base.entity';
import { Model_30817 } from '../model-30817/model-30817.entity';
import { Model_30818 } from '../model-30818/model-30818.entity';
import { Exclude } from 'class-transformer';
import { defaultRelationOptions } from '@/consts';

@Entity('source_points', { schema: 'public' })
@Index(['sourcePointCode'], { unique: true })
export class SourcePoint extends BaseEntity {
  @Column('bigint', { name: 'source_point_code', nullable: true })
  public readonly sourcePointCode: bigint | null;

  @Column('character varying', {
    name: 'source_point_name',
    nullable: true,
    length: 255,
  })
  public readonly sourcePointName: string | null;

  @Column('double precision', {
    name: 'current_transformer_coefficient',
    nullable: true,
  })
  public readonly currentTransformerCoefficient: number | null;

  @Column('double precision', {
    name: 'voltage_transformer_coefficient',
    nullable: true,
  })
  public readonly voltageTransformerCoefficient: number | null;

  @Column('boolean', { name: 'is_commercial', nullable: true, default: false })
  public readonly isCommercial: boolean;

  @Exclude()
  @OneToMany(
    () => Model_30817,
    (model_30817) => model_30817.sourcePoint,
    defaultRelationOptions,
  )
  public readonly row30817List: Model_30817[];

  @Exclude()
  @OneToMany(
    () => Model_30818,
    (model_30818) => model_30818.sourcePoint,
    defaultRelationOptions,
  )
  public readonly row30818List: Model_30818[];

  @Exclude()
  @OneToMany(
    () => Model_30917,
    (model_30917) => model_30917.sourcePoint,
    defaultRelationOptions,
  )
  public readonly row30917List: Model_30917[];
}
