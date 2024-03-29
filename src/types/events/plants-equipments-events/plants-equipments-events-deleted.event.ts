import { BaseEvent } from '@/types/events';
import { PlantEquipmentsEvents } from '@/api/plant-equipments-events/plants-equipments-events.entity';

export interface PlantsEquipmentsEventsDeletedEvent extends BaseEvent {
  readonly id: number;
  readonly deletedAt: string;
}
