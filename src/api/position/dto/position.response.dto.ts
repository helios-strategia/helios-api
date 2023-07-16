import { Employee } from '@/api/employee/employee.entity';
import { PositionResponseDto as PositionResponseDtoType } from '@/types';
import { BaseEntityResponseDto } from '@/api/base-entity/base-entity.response.dto';
import { AutoMap } from '@automapper/classes';

export class PositionResponseDto
  extends BaseEntityResponseDto
  implements PositionResponseDtoType
{
  @AutoMap()
  public readonly name: string;

  @AutoMap()
  public readonly description: string | null;

  @AutoMap()
  public readonly employees?: Employee[];
}
