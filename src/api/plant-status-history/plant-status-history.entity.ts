import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlantStatus } from '@/api/plant/plant-status.enum';
import { AutoMap } from '@automapper/classes';
import { Type } from 'class-transformer';
import { Plant } from '@/api/plant/plant.entity';

@Entity('plant_status_history')
export class PlantStatusHistory {
  @AutoMap()
  @Type(() => Number)
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @AutoMap()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @AutoMap()
  @Column('enum', {
    enum: PlantStatus,
    nullable: true,
    name: 'previous_status',
  })
  public readonly previousStatus: PlantStatus | null;

  @AutoMap()
  @Column('enum', {
    enum: PlantStatus,
    nullable: false,
    name: 'current_status',
  })
  public readonly currentStatus: PlantStatus;

  @AutoMap(() => Plant)
  @ManyToOne(() => Plant, (plant) => plant.plantStatusHistory, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn([{ name: 'plant_id', referencedColumnName: 'id' }])
  public readonly plant: Plant;
}
