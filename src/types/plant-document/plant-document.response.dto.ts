import { PlantDocumentType } from '@/types/plant-document/plant-document-type.enum';
import { PlantResponseDto } from '@/types/plant';
import { BaseEntity } from '@/types/base-entity';

export interface PlantDocumentResponseDto extends BaseEntity {
  readonly documentType: PlantDocumentType;
  readonly url: string;
  readonly name: string;
  readonly plant?: PlantResponseDto;
}
