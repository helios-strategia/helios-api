import { BaseEntity as BaseEntityType } from '@/types/base-entity';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class BaseEntityResponseDto implements BaseEntityType {
  @ApiProperty({ minimum: 1 })
  @AutoMap()
  readonly id: number;

  @ApiProperty()
  @AutoMap()
  readonly createdAt: Date;

  @ApiProperty()
  @AutoMap()
  readonly updatedAt: Date;
}
