import { BaseEntity } from '@/api/base-entity/base.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PlantsEquipmentsEvents } from '@/api/plant-equipments-events/plants-equipments-events.entity';
import { Plant } from '@/api/plant/plant.entity';
import { PlantEquipmentsType } from 'src/types/plant-equipments';

@Entity('plant_equipments')
@Index(['equipmentType', 'plant'], { unique: true })
export class PlantEquipments extends BaseEntity {
  @Column('enum', {
    name: 'equipment_type',
    enum: PlantEquipmentsType,
  })
  public readonly equipmentType: PlantEquipmentsType;

  @OneToMany(
    () => PlantsEquipmentsEvents,
    (plantsEquipmentsEvents) => plantsEquipmentsEvents.plantEquipment,
    {
      createForeignKeyConstraints: false,
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    },
  )
  public readonly plantsEquipmentsEvents: PlantsEquipmentsEvents[];

  @ManyToOne(() => Plant, (plant) => plant.plantEquipmentsStatus, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn([{ name: 'plant_id', referencedColumnName: 'id' }])
  public readonly plant: Plant;
}
