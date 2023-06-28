import { BaseEntity } from '@/api/base-entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Plant } from '@/api/plant/plant.entity';
import { Quarter } from '@/types/common';

@Entity({ name: 'generation_tariffs' })
export class GenerationTariff extends BaseEntity {
  @Column({ type: 'smallint', nullable: false })
  public readonly year: number;

  @Column({ type: 'enum', enum: Quarter, nullable: false })
  public readonly quarter: Quarter;

  @Column({
    type: 'double precision',
    name: 'cost_per_kilowatt_hour',
    nullable: false,
  })
  public readonly costPerKilowattHour: number;

  @ManyToOne(() => Plant, (plant) => plant.generationTariffs)
  @JoinColumn({ name: 'plant_id' })
  public readonly plant: Plant;
}
