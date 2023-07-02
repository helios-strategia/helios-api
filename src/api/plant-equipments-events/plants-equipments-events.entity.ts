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
import { PlantEquipmentsEventsImage } from '@/api/plant-equipments-events-images/plant-equipments-events-images.entity';
import { AutoMap } from '@automapper/classes';

@Entity('plant_equipments_events')
export class PlantEquipmentsEvents extends BaseEntity {
  @AutoMap()
  @Column('text', {
    name: 'location',
    nullable: true,
  })
  public readonly location: string | null;

  @AutoMap()
  @Column('text', {
    nullable: false,
    name: 'defect_description',
  })
  public readonly defectDescription: string;

  @AutoMap()
  @Column('text', {
    nullable: false,
    name: 'specification_description',
  })
  public readonly specificationDescription: string;

  @AutoMap()
  @Column('timestamp with time zone', {
    nullable: false,
    name: 'started_at',
  })
  public readonly startedAt: Date;

  @AutoMap()
  @Column('timestamp with time zone', {
    name: 'expectation_end_at',
    nullable: true,
  })
  public readonly expectationEndAt: Date | null;

  @AutoMap()
  @Column('enum', {
    enum: PlantEquipmentEventGenerationAffects,
    name: 'generation_affects_type',
    default: PlantEquipmentEventGenerationAffects.AffectsEquipment,
  })
  public readonly generationAffectsType: PlantEquipmentEventGenerationAffects;

  @AutoMap(() => Number)
  @Column('bigint', {
    name: 'plant_equipment_id',
    nullable: false,
  })
  public readonly plantEquipmentId: number;

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

  @AutoMap(() => [PlantEquipmentsEventsImage])
  @OneToMany(
    () => PlantEquipmentsEventsImage,
    (plantEquipmentsEventsImages) =>
      plantEquipmentsEventsImages.plantEquipmentEvent,
    {
      createForeignKeyConstraints: false,
    },
  )
  public readonly plantEquipmentsEventsImages: PlantEquipmentsEventsImage[];

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
