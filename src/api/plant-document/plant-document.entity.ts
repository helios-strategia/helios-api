import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Plant } from '../plant/plant.entity';
import { BaseEntity } from '../base-entity/base.entity';
import { AutoMap } from '@automapper/classes';
import { PlantDocumentType } from '@/types/plant-document';

@Entity('plant_documents', { schema: 'public' })
export class PlantDocument extends BaseEntity {
  @AutoMap()
  @Column({
    type: 'enum',
    enum: PlantDocumentType,
    name: 'document_type',
    default: PlantDocumentType.OTHER,
  })
  documentType: PlantDocumentType;

  @AutoMap()
  @Column('text', { name: 'name', nullable: false })
  name: string;

  @AutoMap()
  @Column('text', { name: 'url', nullable: false })
  url: string;

  @AutoMap(() => Plant)
  @ManyToOne(() => Plant, (plant) => plant.documents, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn([{ name: 'plant_id', referencedColumnName: 'id' }])
  plant: Plant;
}
