import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Plant } from '../plant/plant.entity';
import { RefreshToken } from '../refresh-token/refresh-token.entity';
import { BaseEntity } from '../base-entity/base.entity';
import { AutoMap } from '@automapper/classes';
import { UserRole } from '@/types/user';

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
    nullable: false,
    unique: true,
  })
  email: string;

  @AutoMap()
  @Column('text', { name: 'name', nullable: false })
  name: string;

  @Column('text', {
    name: 'password',
    nullable: false,
  })
  password: string;

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

  @AutoMap(() => [Plant])
  @OneToMany(() => Plant, (plants) => plants.user, {
    createForeignKeyConstraints: false,
  })
  plants: Plant[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    createForeignKeyConstraints: false,
  })
  refreshTokens: RefreshToken[];
}
