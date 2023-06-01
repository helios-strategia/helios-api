import { BaseEntity } from '@/api/base-entity/base.entity';
import {
  AfterInsert,
  AfterRemove,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { PlantEquipmentEventGenerationAffects } from '@/types/plant-equipments-events';
import { PlantEquipments } from '@/api/plant-equipments/plant-equipments.entity';

@Entity('plants_equipments_events')
export class PlantsEquipmentsEvents extends BaseEntity {
  @Column('text', {
    name: 'location',
    nullable: true,
  })
  public readonly location: string | null;

  @Column('text', {
    name: 'image_urls',
    array: true,
    nullable: true,
  })
  public readonly imageUrls: string[];

  @Column('text', {
    nullable: false,
  })
  public readonly description: string;

  @Column('timestamp without time zone', {
    nullable: false,
    name: 'started_at',
  })
  public readonly startedAt: Date;

  @Column('timestamp without time zone', {
    name: 'expectation_end_at',
    nullable: true,
  })
  public readonly expectationEndAt: Date | null;

  @Column('enum', {
    enum: PlantEquipmentEventGenerationAffects,
    name: 'generation_affects_type',
    default: PlantEquipmentEventGenerationAffects.NotAffectsGeneration,
  })
  public readonly generationAffectsType: PlantEquipmentEventGenerationAffects;

  @ManyToOne(
    () => PlantEquipments,
    (plantEquipments) => plantEquipments.plantsEquipmentsEvents,
    {
      createForeignKeyConstraints: false,
    },
  )
  @JoinColumn([{ name: 'plant_equipment_id', referencedColumnName: 'id' }])
  public readonly plantEquipment: PlantEquipments;

  @AfterInsert()
  public afterInsertHandler() {
    return this;
  }

  @AfterRemove()
  public afterRemoveHandler() {
    return this;
  }
}
