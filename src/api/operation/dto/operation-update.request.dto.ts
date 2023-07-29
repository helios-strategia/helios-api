import {
  OperationUpdateRequestDto as OperationUpdateRequestDtoType,
  OperationType,
} from 'src/types/operation';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { enumValidationMessage } from '@/utils';
import { ApiProperty } from '@nestjs/swagger';
import { OperationTypeEnum } from '@/consts';

export class OperationUpdateRequestDto
  implements OperationUpdateRequestDtoType
{
  @IsOptional()
  @IsEnum(OperationTypeEnum, {
    message: enumValidationMessage('operationType', OperationTypeEnum),
  })
  public readonly operationType?: OperationType;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  public readonly description?: string;

  @IsOptional()
  @IsDateString()
  public readonly endDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  public readonly startDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(254)
  public readonly title?: string;
}
