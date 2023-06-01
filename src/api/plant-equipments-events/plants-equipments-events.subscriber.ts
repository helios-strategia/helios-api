import {
  DataSource,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { PlantsEquipmentsEvents } from '@/api/plant-equipments-events/plants-equipments-events.entity';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitterService } from '@/event/event-emitter.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { Events } from '@/types/events';
import { PlantsEquipmentsEventsCreatedEvent } from '@/event/plants-equipments-events/plants-equipments-events-created.event';
import { PlantsEquipmentsEventsDeletedEvent } from '@/event/plants-equipments-events/plants-equipments-events-deleted.event';

@Injectable()
export class PlantsEquipmentsEventsSubscriber
  implements EntitySubscriberInterface<PlantsEquipmentsEvents>
{
  @Inject(EventEmitterService)
  private readonly eventEmitterService: EventEmitterService;

  constructor(@InjectDataSource() readonly dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  public listenTo() {
    return PlantsEquipmentsEvents;
  }

  public afterInsert(event: InsertEvent<PlantsEquipmentsEvents>): void {
    Logger.log('PlantsEquipmentsEventsSubscriber#afterInsert', {
      entity: event.entity,
    });

    this.eventEmitterService.emit(
      Events.PlantsEquipmentsEventsCreated,
      new PlantsEquipmentsEventsCreatedEvent(event.entity),
    );
  }

  public afterUpdate(event: UpdateEvent<PlantsEquipmentsEvents>): void {}

  public afterRemove(event: RemoveEvent<PlantsEquipmentsEvents>): void {
    Logger.log('PlantsEquipmentsEventsSubscriber#afterRemove', {
      entity: event.entity,
    });

    this.eventEmitterService.emit(
      Events.PlantsEquipmentsEventsDeleted,
      new PlantsEquipmentsEventsDeletedEvent(
        event.entity?.id,
        new Date().toISOString(),
      ),
    );
  }
}
