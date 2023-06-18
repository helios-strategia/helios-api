import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { PlantsEquipmentsEvents } from '@/api/plant-equipments-events/plants-equipments-events.entity';
import { BaseImageEntity } from '@/api/base-image-entity/base-image.entity';

@Entity({ name: 'plants_equipments_events_images' })
@Index(['url'], { unique: false })
@Index(['name'], { unique: false })
export class PlantEquipmentsEventsImages extends BaseImageEntity {
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
