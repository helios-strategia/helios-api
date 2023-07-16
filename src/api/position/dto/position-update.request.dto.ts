import { PositionUpdateRequestDto as PositionUpdateRequestDtoType } from '@/types';
import { IsOptional, IsString, Length } from 'class-validator';

export class PositionUpdateRequestDto implements PositionUpdateRequestDtoType {
  @IsOptional()
  @IsString()
  @Length(255)
  public readonly name?: string;

  @IsOptional()
  @IsString()
  @Length(2000)
  public readonly description?: string;
}
