import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PlantDocument } from '@/api/plant-document/plant-document.entity';

@Injectable()
export class PlantDocumentRepository extends Repository<PlantDocument> {
  constructor(private dataSource: DataSource) {
    super(PlantDocument, dataSource.createEntityManager());
  }
}
