import {
  OperationResponseDto as OperationResponseDtoType,
  OperationType,
} from 'src/types/operation';
import { OperationPauseResponseDto } from '@/api/operation-pause/dto/operation-pause-response.dto';
import { OperationImageResponseDto } from '@/api/operation-image/dto';
import { BaseEntityResponseDto } from '@/api/base-entity/base-entity.response.dto';
import { AutoMap } from '@automapper/classes';

export class OperationResponseDto
  extends BaseEntityResponseDto
  implements OperationResponseDtoType
{
  @AutoMap()
  public readonly operationType: OperationType;

  @AutoMap()
  public readonly description: string | null;

  @AutoMap()
  public readonly endDate: Date;

  @AutoMap()
  public readonly startDate: Date;

  @AutoMap()
  public readonly title: string;

  @AutoMap(() => Number)
  public readonly plantId: number;

  @AutoMap(() => [OperationPauseResponseDto])
  public readonly pauses?: OperationPauseResponseDto[];

  @AutoMap(() => [OperationImageResponseDto])
  public readonly images?: OperationImageResponseDto[];
}
