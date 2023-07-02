import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantEquipmentsEventsImage } from '@/api/plant-equipments-events-images/plant-equipments-events-images.entity';
import { PlantEquipmentsEventsImagesRepository } from '@/api/plant-equipments-events-images/plant-equipments-events-images.repository';
import { PlantEquipmentsEventsImagesService } from '@/api/plant-equipments-events-images/plant-equipments-events-images.service';
import { ServiceModule } from '@/service/service.module';
import { PlantEquipmentsEventsImagesProfile } from '@/api/plant-equipments-events-images/plant-equipments-events-images.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlantEquipmentsEventsImage]),
    ServiceModule,
  ],
  providers: [
    PlantEquipmentsEventsImagesRepository,
    PlantEquipmentsEventsImagesService,
    PlantEquipmentsEventsImagesProfile,
  ],
  exports: [PlantEquipmentsEventsImagesService],
})
export class PlantEquipmentsEventsImagesModule {}
