import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { PlantEquipmentsEvents } from '@/api/plant-equipments-events/plants-equipments-events.entity';
import { BaseImageEntity } from '@/api/base-image-entity/base-image.entity';

@Entity({ name: 'plant_equipments_events_images' })
@Index(['url'], { unique: false })
@Index(['name'], { unique: false })
export class PlantEquipmentsEventsImage extends BaseImageEntity {
  @ManyToOne(
    () => PlantEquipmentsEvents,
    (plantEquipmentEvent) => plantEquipmentEvent.plantEquipmentsEventsImages,
    {
      createForeignKeyConstraints: false,
    },
  )
  @JoinColumn([
    { name: 'plant_equipment_event_id', referencedColumnName: 'id' },
  ])
  public readonly plantEquipmentEvent: PlantEquipmentsEvents;
}
