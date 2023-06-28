import { Module } from '@nestjs/common';
import { GenerationTariffService } from './generation-tariff.service';
import { GenerationTariffController } from './generation-tariff.controller';

@Module({
  providers: [GenerationTariffService],
  controllers: [GenerationTariffController],
})
export class GenerationTariffModule {}
