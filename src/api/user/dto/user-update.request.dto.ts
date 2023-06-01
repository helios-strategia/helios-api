import {
  IsEmail,
  IsEnum,
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
import { UserRole } from '@/types/user';
import { enumValidationMessage } from '@/utils';

export class UserUpdateRequestDto {
  @IsOptional()
  @IsString()
  @IsEnum(UserRole, {
    message: enumValidationMessage('role', UserRole),
  })
  public readonly role: UserRole;

  @IsOptional()
  @IsFile()
  // 5 Mb = 5e6 bytes
  @MaxFileSize(5e6)
  @HasMimeType(['image/jpeg', 'image/png'])
  public readonly avatar: MemoryStoredFile;

  @IsOptional()
  @IsString()
  @MinLength(2)
  public readonly name: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  public readonly password: string;

  @IsOptional()
  @IsString()
  public readonly phone: string;

  @IsOptional()
  @IsEmail()
  public readonly email: string;
}
