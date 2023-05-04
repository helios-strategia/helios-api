import { BaseEntity } from '@/api/base.entity';
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
export enum EquipmentType {
  ExternalPowerSupply,
  DCCircuit,
}

@Entity('plant_equipments_status')
@Index(['equipmentType', 'plant'], { unique: true })
export class PlantEquipmentsStatus extends BaseEntity {
  @Column('enum', {
    name: 'equipment_type',
    enum: EquipmentType,
  })
  public readonly equipmentType: EquipmentType;

  @OneToMany(
    () => PlantsEquipmentsEvents,
    (plantsEquipmentsEvents) => plantsEquipmentsEvents.plantEquipmentsStatus,
    {
      createForeignKeyConstraints: false,
    },
  )
  public readonly plantsEquipmentsEvents: PlantsEquipmentsEvents[];

  @ManyToOne(() => Plant, (plant) => plant.plantEquipmentsStatus, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn([{ name: 'plant_id', referencedColumnName: 'id' }])
  public readonly plant: Plant;
}
