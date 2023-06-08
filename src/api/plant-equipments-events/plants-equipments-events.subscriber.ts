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
import { PlantsEquipmentsEventsUpdatedEvent } from '@/event/plants-equipments-events/plants-equipments-events-updated.event';

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

  public afterUpdate(event: UpdateEvent<PlantsEquipmentsEvents>): void {
    Logger.log('PlantsEquipmentsEventsSubscriber#afterUpdate', {
      databaseEntity: event.databaseEntity?.id,
      entity: event.entity,
      updatedColumns: event.updatedColumns,
    });

    this.eventEmitterService.emit(
      Events.PlantsEquipmentsEventsUpdated,
      new PlantsEquipmentsEventsUpdatedEvent(
        event.entity,
        event.databaseEntity,
      ),
    );
  }

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
