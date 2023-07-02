import { forwardRef, Module } from '@nestjs/common';
import { GenerationTariffService } from './generation-tariff.service';
import { GenerationTariffRepository } from '@/api/generation-tariff/generation-tariff.repository';
import { GenerationTariffProfile } from '@/api/generation-tariff/generation-tariff.profile';
import { PlantModule } from '@/api/plant/plant.module';
import { RequestContextModule } from '@/request-context/request-context.module';

@Module({
  imports: [forwardRef(() => PlantModule), RequestContextModule],
  providers: [
    GenerationTariffService,
    GenerationTariffRepository,
    GenerationTariffProfile,
  ],
  exports: [GenerationTariffService],
})
export class GenerationTariffModule {}
