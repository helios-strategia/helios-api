import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Plant } from '../plant/plant.entity';
import { RefreshToken } from '../refresh-token/refresh-token.entity';
import { BaseEntity } from '../base.entity';
import { Exclude } from 'class-transformer';
import { AutoMap } from '@automapper/classes';
import { UserRole } from '@/api/user/user-role.enum';

@Index('user_email_index', ['email'], { unique: true })
@Entity('users')
export class User extends BaseEntity {
  @AutoMap()
  @Column('text', {
    name: 'avatar_url',
    nullable: true,
  })
  avatarUrl: string | null;

  @AutoMap()
  @Column('text', {
    name: 'email',
    nullable: true,
    unique: true,
  })
  email: string | null;

  @AutoMap()
  @Column('text', { name: 'name', nullable: true })
  name: string | null;

  @Column('text', {
    name: 'password',
    nullable: true,
  })
  @Exclude()
  password: string | null;

  @AutoMap()
  @Column('text', { name: 'phone', nullable: true })
  phone: string | null;

  @AutoMap()
  @Column('enum', {
    enum: UserRole,
    name: 'role',
    nullable: true,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  public lastLoginAt: Date | null;

  @AutoMap(() => Plant)
  @OneToMany(() => Plant, (plants) => plants.user, {
    createForeignKeyConstraints: false,
  })
  plants: Plant[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    createForeignKeyConstraints: false,
  })
  refreshTokens: RefreshToken[];
}
