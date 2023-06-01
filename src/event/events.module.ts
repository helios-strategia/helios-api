import { Module } from '@nestjs/common';
import { PlantsEquipmentsEventsGateway } from '@/event/plants-equipments-events.gateway';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventEmitterService } from '@/event/event-emitter.service';

@Module({
  imports: [EventEmitterModule],
  providers: [PlantsEquipmentsEventsGateway, EventEmitterService],
  exports: [PlantsEquipmentsEventsGateway, EventEmitterService],
})
export class EventsModule {}
