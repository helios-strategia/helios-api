import { forwardRef, Module } from '@nestjs/common';
import { PlantDocumentController } from './plant-document.controller';
import { PlantDocumentService } from './plant-document.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantDocument } from './plant-document.entity';
import { PlantDocumentRepository } from '@/api/plant-document/plant-document.repository';
import { ServiceModule } from '@/service/service.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { PlantModule } from '@/api/plant/plant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlantDocument]),
    ServiceModule,
    NestjsFormDataModule,
    forwardRef(() => PlantModule),
  ],
  controllers: [PlantDocumentController],
  providers: [PlantDocumentService, PlantDocumentRepository],
  exports: [PlantDocumentService],
})
export class PlantDocumentModule {}
