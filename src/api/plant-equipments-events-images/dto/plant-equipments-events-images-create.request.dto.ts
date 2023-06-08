import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class PlantEquipmentsEventsImagesCreateRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/png'])
  @MaxFileSize(15e6)
  public readonly image: MemoryStoredFile;
}
