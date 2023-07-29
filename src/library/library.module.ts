import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TimeServiceModule } from '@/library/time-service/time-service.module';
import { FileServiceModule } from './file-serivce/file-service.module';
import { TransactionPerformer } from '@/library/transaction-performer';

@Global()
@Module({
  imports: [HttpModule, FileServiceModule, TimeServiceModule],
  exports: [FileServiceModule, TimeServiceModule, TransactionPerformer],
  providers: [TransactionPerformer],
})
export class LibraryModule {}
