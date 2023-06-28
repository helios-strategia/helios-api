import { PlantDocumentType } from '@/types/plant-document/plant-document-type.enum';
import { MemoryStoredFile } from 'nestjs-form-data';

export interface PlantDocumentCreateRequestDto {
  readonly documentType: PlantDocumentType;
  readonly file: MemoryStoredFile;
  readonly name?: string;
  readonly plantId: number;
}
