import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class UserProfileUpdateRequestDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  @IsFile()
  // 5 Mb = 5e6 bytes
  @MaxFileSize(5e6)
  @HasMimeType(['image/jpeg', 'image/png'])
  public readonly avatar: MemoryStoredFile;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  public readonly name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(8)
  public readonly password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public readonly phone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  public readonly email: string;
}
