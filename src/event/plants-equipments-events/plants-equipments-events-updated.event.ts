import {
  Events,
  PlantsEquipmentsEventsUpdatedEvent as PlantsEquipmentsEventsUpdatedEventType,
} from '@/types/events';
import { BaseEvent } from '@/event/base.event';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { PlantEquipmentsEvents } from '@/api/plant-equipments-events/plants-equipments-events.entity';

export class PlantsEquipmentsEventsUpdatedEvent
  extends BaseEvent
  implements PlantsEquipmentsEventsUpdatedEventType
{
  constructor(
    public readonly updatedFields: ObjectLiteral,
    public readonly plantEquipmentEvent: PlantEquipmentsEvents,
  ) {
    super(Events.PlantsEquipmentsEventsUpdated);
  }
}
