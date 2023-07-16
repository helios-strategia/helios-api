import { Module } from '@nestjs/common';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from './position.entity';
import { PositionRepository } from '@/api/position/position.repository';
import { RequestContextModule } from '@/request-context/request-context.module';

@Module({
  imports: [TypeOrmModule.forFeature([Position]), RequestContextModule],
  controllers: [PositionController],
  providers: [PositionService, PositionRepository],
  exports: [PositionService],
})
export class PositionModule {}
