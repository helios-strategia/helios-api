import { MemoryStoredFile } from 'nestjs-form-data';

export interface PlantEquipmentsEventsImagesCreateRequestDto {
  readonly image: MemoryStoredFile;
}
