import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Events } from '@/types/events';
import { PlantsEquipmentsEventsCreatedEvent } from '@/event/plants-equipments-events/plants-equipments-events-created.event';
import { PlantsEquipmentsEventsDeletedEvent } from '@/event/plants-equipments-events/plants-equipments-events-deleted.event';
import { PlantsEquipmentsEventsUpdatedEvent } from '@/event/plants-equipments-events/plants-equipments-events-updated.event';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PlantsEquipmentsEventsGateway
  implements OnGatewayConnection, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  @OnEvent(Events.PlantsEquipmentsEventsCreated)
  public plantsEquipmentsEventsCreated(
    event: PlantsEquipmentsEventsCreatedEvent,
  ) {
    Logger.log('PlantsEquipmentsEventsGateway#plantsEquipmentsEventsCreate');

    this.server.emit(Events.PlantsEquipmentsEventsCreated, event);
  }

  @OnEvent(Events.PlantsEquipmentsEventsDeleted)
  public plantsEquipmentsEventsDeleted(
    event: PlantsEquipmentsEventsDeletedEvent,
  ) {
    Logger.log('PlantsEquipmentsEventsGateway#plantsEquipmentsEventsDeleted');

    this.server.emit(Events.PlantsEquipmentsEventsDeleted, event);
  }

  @OnEvent(Events.PlantsEquipmentsEventsUpdated)
  public PlantsEquipmentsEventsUpdated(
    event: PlantsEquipmentsEventsUpdatedEvent,
  ) {
    Logger.log('PlantsEquipmentsEventsGateway#PlantsEquipmentsEventsUpdated');

    this.server.emit(Events.PlantsEquipmentsEventsUpdated, event);
  }

  public afterInit(server: any) {
    Logger.log('PlantsEquipmentsEventsGateway#afterInit');
  }

  public handleConnection(client: any, ...args: any[]): any {
    Logger.log('PlantsEquipmentsEventsGateway#handleConnection', {
      args,
    });
  }
}
