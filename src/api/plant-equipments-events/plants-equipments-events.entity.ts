import { BaseEntity } from '@/api/base-entity/base.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PlantEquipmentEventGenerationAffects } from '@/types/plant-equipments-events';
import { PlantEquipments } from '@/api/plant-equipments/plant-equipments.entity';
import { PlantEquipmentsEventsImages } from '@/api/plant-equipments-events-images/plant-equipments-events-images.entity';
import { AutoMap } from '@automapper/classes';

@Entity('plants_equipments_events')
export class PlantsEquipmentsEvents extends BaseEntity {
  @AutoMap()
  @Column('text', {
    name: 'location',
    nullable: true,
  })
  public readonly location: string | null;

  @AutoMap()
  @Column('text', {
    nullable: false,
  })
  public readonly description: string;

  @AutoMap()
  @Column('timestamp without time zone', {
    nullable: false,
    name: 'started_at',
  })
  public readonly startedAt: Date;

  @AutoMap()
  @Column('timestamp without time zone', {
    name: 'expectation_end_at',
    nullable: true,
  })
  public readonly expectationEndAt: Date | null;

  @AutoMap()
  @Column('enum', {
    enum: PlantEquipmentEventGenerationAffects,
    name: 'generation_affects_type',
    default: PlantEquipmentEventGenerationAffects.NotAffectsGeneration,
  })
  public readonly generationAffectsType: PlantEquipmentEventGenerationAffects;

  @AutoMap(() => PlantEquipments)
  @ManyToOne(
    () => PlantEquipments,
    (plantEquipments) => plantEquipments.plantsEquipmentsEvents,
    {
      createForeignKeyConstraints: false,
    },
  )
  @JoinColumn([{ name: 'plant_equipment_id', referencedColumnName: 'id' }])
  public readonly plantEquipment: PlantEquipments;

  @AutoMap(() => [PlantEquipmentsEventsImages])
  @OneToMany(
    () => PlantEquipmentsEventsImages,
    (plantEquipmentsEventsImages) =>
      plantEquipmentsEventsImages.plantEquipmentEvent,
    {
      createForeignKeyConstraints: false,
    },
  )
  public readonly plantEquipmentsEventsImages: PlantEquipmentsEventsImages[];

  @AfterInsert()
  public afterInsertHandler() {
    return this;
  }

  @AfterUpdate()
  public afterUpdateHandler() {
    return this;
  }

  @AfterRemove()
  public afterRemoveHandler() {
    return this;
  }
}
