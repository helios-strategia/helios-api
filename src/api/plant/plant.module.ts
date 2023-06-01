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

@Module({
  imports: [
    TypeOrmModule.forFeature([Plant]),
    PlantDocumentModule,
    NestjsFormDataModule,
    UserModule,
    PlantStatusHistoryModule,
    PlantEquipmentsModule,
  ],
  controllers: [PlantController],
  providers: [PlantService, PlantRepository],
  exports: [PlantService],
})
export class PlantModule {}
