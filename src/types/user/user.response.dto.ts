import { BaseEntity } from '@/types/base-entity';
import { UserRole } from '@/types/user';
import { PlantResponseDto } from '@/types/plant';

export interface UserResponseDto extends BaseEntity {
  readonly email: string;
  readonly role: UserRole;
  readonly name: string;
  readonly phone: string | null;
  readonly avatarUrl: string | null;
  readonly plants: PlantResponseDto[];
}
