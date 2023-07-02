import { PlantEquipmentsEvents } from '@/api/plant-equipments-events/plants-equipments-events.entity';
import {
  Events,
  PlantsEquipmentsEventsCreatedEvent as PlantsEquipmentsEventsCreateEventType,
} from '@/types/events';
import { BaseEvent } from '@/event/base.event';

export class PlantsEquipmentsEventsCreatedEvent
  extends BaseEvent
  implements PlantsEquipmentsEventsCreateEventType
{
  constructor(public readonly plantsEquipmentsEvent: PlantEquipmentsEvents) {
    super(Events.PlantsEquipmentsEventsCreated);
  }
}
