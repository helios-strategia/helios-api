import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlantStatus } from '@/types/plant/plant-status.enum';
import { AutoMap } from '@automapper/classes';
import { Type } from 'class-transformer';
import { Plant } from '@/api/plant/plant.entity';

@Entity('plant_status_history')
export class PlantStatusHistory {
  @AutoMap()
  @Type(() => Number)
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  public readonly id: number;

  @AutoMap()
  @CreateDateColumn({ name: 'created_at' })
  public readonly createdAt: Date;

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

  @ManyToOne(() => Plant, (plant) => plant.plantStatusHistory, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn([{ name: 'plant_id', referencedColumnName: 'id' }])
  public readonly plant: Plant;
}
