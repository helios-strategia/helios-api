import { BaseEvent } from '@/types/events';
import { ObjectLiteral } from '@/types/common';
import { PlantEquipmentsEvents } from '@/api/plant-equipments-events/plants-equipments-events.entity';

export interface PlantsEquipmentsEventsUpdatedEvent extends BaseEvent {
  readonly updatedFields: ObjectLiteral;
  readonly plantEquipmentEvent: PlantEquipmentsEvents;
}
