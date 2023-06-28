import { PlantResponseDto } from '@/api/plant/dto';
import { AutoMap } from '@automapper/classes';
import { BaseEntityResponseDto } from '@/api/base-entity/base-entity.response.dto';
import { PlantDocumentType } from '@/types/plant-document';
import { PlantDocumentResponseDto as PlantDocumentResponseDtoType } from '@/types/plant-document';

export class PlantDocumentResponseDto
  extends BaseEntityResponseDto
  implements PlantDocumentResponseDtoType
{
  @AutoMap()
  public readonly documentType: PlantDocumentType;
  @AutoMap()
  public readonly url: string;
  @AutoMap()
  public readonly name: string;
  @AutoMap(() => PlantResponseDto)
  public readonly plant?: PlantResponseDto;
}
