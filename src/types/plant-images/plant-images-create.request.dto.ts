import { MemoryStoredFile } from 'nestjs-form-data';

export interface PlantImagesCreateRequestDto {
  readonly image: MemoryStoredFile;
}
