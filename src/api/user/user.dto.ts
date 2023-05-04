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
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@/api/user/user-role.enum';
import { Plant } from '@/api/plant/plant.entity';

export class UserCreateRequestDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  @IsFile()
  // 5 Mb = 5e6 bytes
  @MaxFileSize(5e6)
  @HasMimeType(['image/jpeg', 'image/png'])
  public readonly avatar: MemoryStoredFile;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  public readonly name: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  public readonly password: string;

  @ApiProperty()
  @IsString()
  public readonly phone: string;

  @ApiProperty({ enum: Object.values(UserRole) })
  @IsString()
  @IsEnum(UserRole, {
    message: `role must be one of ${Object.values(UserRole).join(', ')}`,
  })
  public readonly role: UserRole;

  @ApiProperty()
  @IsEmail()
  public readonly email: string;
}

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

export class UserUpdateRequestDto {
  @IsOptional()
  @IsString()
  @IsEnum(UserRole, {
    message: `role must be one of ${Object.values(UserRole)}`,
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

export class UserResponseDto {
  @ApiProperty({ minimum: 1 })
  @AutoMap()
  public readonly id: number;

  @ApiProperty()
  @AutoMap()
  public readonly avatarUrl: string;

  @ApiProperty()
  @AutoMap()
  public readonly name: string;

  @ApiProperty()
  @AutoMap()
  public readonly phone: string;

  @ApiProperty({ enum: Object.values(UserRole) })
  @AutoMap()
  public readonly role: UserRole;

  @ApiProperty()
  @AutoMap()
  public readonly email: string;

  @ApiProperty({ type: [Plant] })
  @AutoMap(() => [Plant])
  public readonly plants: Plant[];
}
