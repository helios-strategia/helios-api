import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PlantImagesCreateRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/png'])
  @MaxFileSize(15e6)
  public readonly image: MemoryStoredFile;
}
