import { Module } from '@nestjs/common';
import { TimeService } from './time.service';

@Module({
  exports: [TimeService],
  providers: [TimeService],
})
export class TimeServiceModule {}
