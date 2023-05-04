import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { PlantDocumentType } from '@/api/plant-document/plant-document-type.enum';
import { IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

export class PlantDocumentCreateRequestDto {
  @ApiProperty({ enum: PlantDocumentType })
  @IsString()
  @IsEnum(PlantDocumentType, {
    message: `document type must one of ${Object.values(PlantDocumentType).join(
      ', ',
    )}`,
  })
  public readonly documentType: PlantDocumentType;

  @IsFile()
  @MaxFileSize(20e6)
  public readonly file: MemoryStoredFile;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly name?: string;

  @ApiProperty()
  @IsNumberString()
  public readonly plantId: number;
}
