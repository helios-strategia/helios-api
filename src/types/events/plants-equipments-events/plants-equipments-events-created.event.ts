import { BaseEvent } from '@/types/events';
import { PlantsEquipmentsEvents } from '@/api/plant-equipments-events/plants-equipments-events.entity';

export interface PlantsEquipmentsEventsCreatedEvent extends BaseEvent {
  readonly plantsEquipmentsEvent: PlantsEquipmentsEvents;
}
