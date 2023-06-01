import { MemoryStoredFile } from 'nestjs-form-data';
import { UserRole } from './user-role.enum';

export interface UserCreateRequestDto {
  readonly name: string;
  readonly password: string;
  readonly email: string;
  readonly role?: UserRole;
  readonly avatar?: MemoryStoredFile;
  readonly phone?: string;
}
