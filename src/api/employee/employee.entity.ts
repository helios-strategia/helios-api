import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { Plant } from '../plant/plant.entity';
import { Position } from '../position/position.entity';
import { BaseEntity } from '../base-entity/base.entity';
import { defaultRelationOptions } from '@/consts';
import { AutoMap } from '@automapper/classes';

export type ScheduleScheme = {
  fiveDaySchedule: boolean;
  workStartTimestamp: string;
  vacationsDates?: string[];
  workHours?: number;
  restHours?: number;
};

@Entity('employees', { schema: 'public' })
export class Employee extends BaseEntity {
  @AutoMap()
  @Column('character varying', {
    name: 'avatar_url',
    nullable: true,
    length: 255,
  })
  avatarUrl: string | null;

  @AutoMap()
  @Column('character varying', { name: 'name', nullable: false, length: 255 })
  name: string;

  @AutoMap()
  @Column('character varying', {
    name: 'surname',
    nullable: false,
    length: 255,
  })
  surname: string;

  @AutoMap()
  @Column('character varying', { name: 'phone', nullable: true, length: 255 })
  phone: string | null;

  @AutoMap(() => Object)
  @Column('jsonb', { name: 'schedule_scheme', nullable: true })
  scheduleScheme?: ScheduleScheme;

  @AutoMap(() => [Plant])
  @ManyToMany(() => Plant, (plant) => plant.employees, defaultRelationOptions)
  plants: Plant[];

  @ManyToOne(
    () => Position,
    (position) => position.employees,
    defaultRelationOptions,
  )
  @JoinColumn([{ name: 'position_id', referencedColumnName: 'id' }])
  position: Position;
}
