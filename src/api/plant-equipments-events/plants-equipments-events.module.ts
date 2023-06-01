import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantsEquipmentsEvents } from '@/api/plant-equipments-events/plants-equipments-events.entity';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { PlantsEquipmentsEventsController } from '@/api/plant-equipments-events/plants-equipments-events.controller';
import { PlantsEquipmentsEventsService } from '@/api/plant-equipments-events/plants-equipments-events.service';
import { ServiceModule } from '@/service/service.module';
import { PlantModule } from '@/api/plant/plant.module';
import { PlantEquipmentsModule } from '@/api/plant-equipments/plant-equipments.module';
import { PlantsEquipmentsEventsRepository } from '@/api/plant-equipments-events/plants-equipments-events.repository';
import { PlantsEquipmentsEventsSubscriber } from '@/api/plant-equipments-events/plants-equipments-events.subscriber';
import { EventsModule } from '@/event/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlantsEquipmentsEvents]),
    PlantModule,
    PlantEquipmentsModule,
    ServiceModule,
    NestjsFormDataModule,
    EventsModule,
  ],
  controllers: [PlantsEquipmentsEventsController],
  providers: [
    PlantsEquipmentsEventsService,
    PlantsEquipmentsEventsRepository,
    PlantsEquipmentsEventsSubscriber,
  ],
  exports: [PlantsEquipmentsEventsService],
})
export class PlantsEquipmentsEventsModule {}
