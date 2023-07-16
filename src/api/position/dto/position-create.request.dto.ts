import { PositionCreateRequestDto as PositionCreateRequestDtoType } from '@/types';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class PositionCreateRequestDto implements PositionCreateRequestDtoType {
  @IsNotEmpty()
  @IsString()
  @Length(255)
  public readonly name: string;

  @IsOptional()
  @IsString()
  @Length(2000)
  public readonly description?: string;
}
