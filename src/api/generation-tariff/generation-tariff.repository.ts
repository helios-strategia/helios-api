import { DataSource, Repository } from 'typeorm';
import { GenerationTariff } from '@/api/generation-tariff/generation-tariff.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerationTariffRepository extends Repository<GenerationTariff> {
  constructor(private dataSource: DataSource) {
    super(GenerationTariff, dataSource.createEntityManager());
  }
}
