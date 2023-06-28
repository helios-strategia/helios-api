import { Module } from '@nestjs/common';
import { PlantController } from './plant.controller';
import { PlantService } from './plant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plant } from './plant.entity';
import { PlantRepository } from '@/api/plant/plant.repository';
import { PlantDocumentModule } from '@/api/plant-document/plant-document.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UserModule } from '@/api/user/user.module';
import { PlantStatusHistoryModule } from '@/api/plant-status-history/plant-status-history.module';
import { PlantEquipmentsModule } from '@/api/plant-equipments/plant-equipments.module';
import { PlantFilesService } from '@/api/plant/plant-files.service';
import { PlantImagesModule } from '@/api/plant-images/plant-images.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plant]),
    PlantDocumentModule,
    NestjsFormDataModule,
    UserModule,
    PlantStatusHistoryModule,
    PlantEquipmentsModule,
    PlantImagesModule,
  ],
  controllers: [PlantController],
  providers: [PlantService, PlantRepository, PlantFilesService],
  exports: [PlantService],
})
export class PlantModule {}
