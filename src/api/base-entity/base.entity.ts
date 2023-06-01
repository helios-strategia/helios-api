import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Type } from 'class-transformer';
import { BaseEntity as BaseEntityType } from '@/types/base-entity';

export abstract class BaseEntity implements BaseEntityType {
  @AutoMap()
  @Type(() => Number)
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  public readonly id: number;

  @AutoMap()
  @CreateDateColumn({ name: 'created_at' })
  public readonly createdAt: Date;

  @AutoMap()
  @UpdateDateColumn({ name: 'updated_at' })
  public readonly updatedAt: Date;
}
