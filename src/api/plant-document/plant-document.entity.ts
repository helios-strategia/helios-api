import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Plant } from '../plant/plant.entity';
import { BaseEntity } from '../base.entity';
import { PlantDocumentType } from '@/api/plant-document/plant-document-type.enum';

@Entity('plant_documents', { schema: 'public' })
export class PlantDocument extends BaseEntity {
  @Column({
    type: 'enum',
    enum: PlantDocumentType,
    name: 'document_type',
    default: PlantDocumentType.OTHER,
  })
  documentType: PlantDocumentType;

  @Column('text', { name: 'name', nullable: true })
  name: string | null;

  @Column('text', { name: 'url', nullable: true })
  url: string | null;

  @ManyToOne(() => Plant, (plant) => plant.documents, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn([{ name: 'plant_id', referencedColumnName: 'id' }])
  plant: Plant;
}
