import { BaseEntity } from '@/api/base-entity/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Plant } from '@/api/plant/plant.entity';
import { AutoMap } from '@automapper/classes';
import { QuarterEnum } from '@/consts/api';
import type { Quarter } from '@/types/generation-tariff/quarter';

@Index('year_quarter_plant_index', ['year', 'quarter', 'plant'], {
  unique: true,
})
@Entity({ name: 'generation_tariffs' })
export class GenerationTariff extends BaseEntity {
  @AutoMap(() => Number)
  @Column({ type: 'smallint', nullable: false })
  public readonly year: number;

  @AutoMap()
  @Column({ type: 'enum', enum: QuarterEnum, nullable: false })
  public readonly quarter: Quarter;

  @AutoMap(() => Number)
  @Column({
    type: 'double precision',
    name: 'cost_per_kilowatt_hour',
    nullable: false,
  })
  public readonly costPerKilowattHour: number;

  @AutoMap(() => Number)
  @Column('bigint', {
    nullable: false,
    name: 'plant_id',
  })
  public readonly plantId: number;

  @AutoMap(() => Plant)
  @ManyToOne(() => Plant, (plant) => plant.generationTariffs)
  @JoinColumn({ name: 'plant_id' })
  public readonly plant: Plant;
}
