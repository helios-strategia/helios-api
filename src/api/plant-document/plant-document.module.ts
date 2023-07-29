import { forwardRef, Module } from '@nestjs/common';
import { PlantDocumentController } from './plant-document.controller';
import { PlantDocumentService } from './plant-document.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantDocument } from './plant-document.entity';
import { PlantDocumentRepository } from '@/api/plant-document/plant-document.repository';
import { LibraryModule } from '@/library/library.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { PlantModule } from '@/api/plant/plant.module';
import { PlantDocumentProfile } from '@/api/plant-document/plant-document.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlantDocument]),
    LibraryModule,
    NestjsFormDataModule,
    forwardRef(() => PlantModule),
  ],
  controllers: [PlantDocumentController],
  providers: [
    PlantDocumentService,
    PlantDocumentRepository,
    PlantDocumentProfile,
  ],
  exports: [PlantDocumentService],
})
export class PlantDocumentModule {}
