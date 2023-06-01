import {
  Events,
  PlantsEquipmentsEventsDeletedEvent as PlantsEquipmentsEventsDeletedEventType,
} from '@/types/events';
import { BaseEvent } from '@/event/base.event';

export class PlantsEquipmentsEventsDeletedEvent
  extends BaseEvent
  implements PlantsEquipmentsEventsDeletedEventType
{
  constructor(public readonly id: number, public readonly deletedAt: string) {
    super(Events.PlantsEquipmentsEventsDeleted);
  }
}
