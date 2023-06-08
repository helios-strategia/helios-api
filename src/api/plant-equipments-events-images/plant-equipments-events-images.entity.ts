import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@/api/base-entity/base.entity';
import { PlantsEquipmentsEvents } from '@/api/plant-equipments-events/plants-equipments-events.entity';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'plants_equipments_events_images' })
@Index(['url'], { unique: false })
@Index(['name'], { unique: false })
export class PlantEquipmentsEventsImages extends BaseEntity {
  @AutoMap()
  @Column({
    name: 'url',
    type: 'varchar',
    nullable: false,
  })
  public readonly url: string;

  @AutoMap()
  @Column({
    name: 'name',
    type: 'text',
    nullable: true,
  })
  public readonly name: string;

  @ManyToOne(
    () => PlantsEquipmentsEvents,
    (plantEquipmentEvent) => plantEquipmentEvent.plantEquipmentsEventsImages,
    {
      createForeignKeyConstraints: false,
    },
  )
  @JoinColumn([
    { name: 'plant_equipment_event_id', referencedColumnName: 'id' },
  ])
  public readonly plantEquipmentEvent: PlantsEquipmentsEvents;
}
