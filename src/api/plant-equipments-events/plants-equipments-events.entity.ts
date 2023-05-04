import { BaseEntity } from '@/api/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PlantEquipmentEventGenerationAffectsTypeEnum } from '@/api/plant-equipments-events/plant-equipment-event-generation-affects-type.enum';
import { PlantEquipmentsStatus } from '@/api/plant-equipments-status/plant-equipments-status.entity';

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
  })
  public readonly imageUrls: string[];

  @Column('text', {
    nullable: true,
  })
  public readonly description: string | null;

  @Column('timestamp without time zone', {
    nullable: true,
    name: 'started_at',
  })
  public readonly startedAt: Date | null;

  @Column('timestamp without time zone', {
    name: 'expectation_end_at',
    nullable: true,
  })
  public readonly expectationEndAt: Date | null;

  @Column('enum', {
    enum: PlantEquipmentEventGenerationAffectsTypeEnum,
    name: 'generation_affects_type',
    default: PlantEquipmentEventGenerationAffectsTypeEnum.NotAffectsGeneration,
  })
  public readonly generationAffectsType: PlantEquipmentEventGenerationAffectsTypeEnum;

  @ManyToOne(
    () => PlantEquipmentsStatus,
    (plantEquipmentsStatus) => plantEquipmentsStatus.plantsEquipmentsEvents,
    {
      createForeignKeyConstraints: false,
    },
  )
  @JoinColumn([
    { name: 'plant_equipments_status_id', referencedColumnName: 'id' },
  ])
  public readonly plantEquipmentsStatus: PlantEquipmentsStatus;
}
