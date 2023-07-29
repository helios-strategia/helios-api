import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationPause } from '@/api/operation-pause/operation-pause.entity';
import { OperationPauseProfile } from '@/api/operation-pause/operation-pause.profile';
import { RequestContextModule } from '@/request-context/request-context.module';
import { OperationModule } from '@/api/operation/operation.module';
import { OperationPauseService } from '@/api/operation-pause/operation-pause.service';
import { OperationPauseRepository } from '@/api/operation-pause/operation-pause.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OperationPause]),
    RequestContextModule,
    forwardRef(() => OperationModule),
  ],
  controllers: [],
  providers: [
    OperationPauseProfile,
    OperationPauseService,
    OperationPauseRepository,
  ],
  exports: [OperationPauseService],
})
export class OperationPauseModule {}
