import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { UserResponseDto as UserResponseDtoType, UserRole } from '@/types/user';
import { BaseEntityResponseDto } from '@/api/base-entity/base-entity.response.dto';
import { PlantResponseDto } from '@/api/plant/dto';

export class UserResponseDto
  extends BaseEntityResponseDto
  implements UserResponseDtoType
{
  @ApiProperty()
  @AutoMap()
  public readonly avatarUrl: string | null;

  @ApiProperty()
  @AutoMap()
  public readonly name: string;

  @ApiProperty()
  @AutoMap()
  public readonly phone: string | null;

  @ApiProperty({ enum: Object.values(UserRole) })
  @AutoMap()
  public readonly role: UserRole;

  @ApiProperty()
  @AutoMap()
  public readonly email: string;

  @ApiProperty({ type: [PlantResponseDto] })
  @AutoMap(() => [PlantResponseDto])
  public readonly plants: PlantResponseDto[];
}
