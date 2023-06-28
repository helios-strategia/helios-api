import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';
import { PlantDocumentType } from '@/types/plant-document';
import { enumValidationMessage } from '@/utils';
import { PlantDocumentCreateRequestDto as PlantDocumentCreateRequestDtoType } from '@/types/plant-document';

export class PlantDocumentCreateRequestDto
  implements PlantDocumentCreateRequestDtoType
{
  @ApiProperty({ enum: PlantDocumentType })
  @IsString()
  @IsEnum(PlantDocumentType, {
    message: enumValidationMessage('documentType', PlantDocumentType),
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
