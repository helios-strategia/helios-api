import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { enumValidationMessage } from '@/utils';
import {
  UserCreateRequestDto as UserCreateRequestDtoType,
  UserRole,
} from '@/types/user';

export class UserCreateRequestDto implements UserCreateRequestDtoType {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  @IsFile()
  // 5 Mb = 5e6 bytes
  @MaxFileSize(5e6)
  @HasMimeType(['image/jpeg', 'image/png'])
  public readonly avatar?: MemoryStoredFile;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  public readonly name: string;

  @ApiProperty({ minLength: 8 })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  public readonly password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly phone?: string;

  @ApiProperty({ enum: Object.values(UserRole) })
  @IsOptional()
  @IsString()
  @IsEnum(UserRole, {
    message: enumValidationMessage('role', UserRole),
  })
  public readonly role?: UserRole;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  public readonly email: string;
}
