import { forwardRef, Module } from '@nestjs/common';
import { OperationController } from './operation.controller';
import { OperationService } from './operation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operation } from './operation.entity';
import { OperationRepository } from '@/api/operation/operation.repository';
import { LibraryModule } from '@/library/library.module';
import { PlantModule } from '@/api/plant/plant.module';
import { OperationImageModule } from '@/api/operation-image/operation-image.module';
import { OperationProfile } from '@/api/operation/operation.profile';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { RequestContextModule } from '@/request-context/request-context.module';
import { OperationPauseModule } from '@/api/operation-pause/operation-pause.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Operation]),
    LibraryModule,
    PlantModule,
    OperationImageModule,
    NestjsFormDataModule,
    RequestContextModule,
    forwardRef(() => OperationPauseModule),
  ],
  controllers: [OperationController],
  providers: [OperationService, OperationRepository, OperationProfile],
  exports: [OperationService],
})
export class OperationModule {}
