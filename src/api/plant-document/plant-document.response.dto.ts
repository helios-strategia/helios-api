import { PlantDocumentType } from '@/api/plant-document/plant-document-type.enum';
import { PlantResponseDto } from '@/api/plant/dto';
import { AutoMap } from '@automapper/classes';
import { BaseEntityResponseDto } from '@/api/base-entity/base-entity.response.dto';

export class PlantDocumentResponseDto extends BaseEntityResponseDto {
  @AutoMap()
  public readonly documentType: PlantDocumentType;
  @AutoMap()
  public readonly url: string;
  @AutoMap()
  public readonly name: string;
  @AutoMap(() => PlantResponseDto)
  public readonly plant?: PlantResponseDto;
}
