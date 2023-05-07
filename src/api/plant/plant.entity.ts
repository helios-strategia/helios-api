import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CalendarEvent } from '../calendar-event/calendar-event.entity';
import { PlantDocument } from '@/api/plant-document/plant-document.entity';
import { Employee } from '../employee/employee.entity';
import { User } from '../user/user.entity';
import { BaseEntity } from '../base.entity';
import { Expose } from 'class-transformer';
import { PlantStatus } from '@/api/plant/plant-status.enum';
import { PlantProductivityDeclineRate } from '@/api/plant/plant-types';
import { PlantEquipmentsStatus } from '@/api/plant-equipments-status/plant-equipments-status.entity';
import { PlantStatusHistory } from '@/api/plant-status-history/plant-status-history.entity';

@Index(['ascmePlantCode'], { unique: true })
@Entity('plants')
export class Plant extends BaseEntity {
  @Column('integer', { name: 'ac_power', nullable: true })
  acPower: number | null;

  @Column('integer', { name: 'dc_power', nullable: true })
  dcPower: number | null;

  @Column('float8', {
    name: 'pvsyst_generation_plan',
    nullable: true,
    array: true,
  })
  pvsystGenerationPlan: number[] | null;

  @Column('double precision', { name: 'area', nullable: true })
  area: number | null;

  @Column('bigint', { name: 'ascme_plant_code', nullable: true, unique: true })
  ascmePlantCode: string | null;

  @Column('timestamp without time zone', {
    name: 'exploitation_start',
    nullable: true,
  })
  exploitationStart: Date | null;

  @Column('text', { name: 'name', nullable: true })
  name: string | null;

  @Column('text', { name: 'status', nullable: true })
  status: PlantStatus | null;

  @OneToMany(() => CalendarEvent, (calendarEvent) => calendarEvent.plant, {
    createForeignKeyConstraints: false,
  })
  calendarEvents: CalendarEvent[];

  @OneToMany(() => PlantDocument, (document) => document.plant, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    createForeignKeyConstraints: false,
  })
  documents: PlantDocument[];

  @ManyToMany(() => Employee, (employee) => employee.plants, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: 'plant_employee',
    joinColumn: { name: 'plant_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'employee_id', referencedColumnName: 'id' },
  })
  public readonly employees: Employee[];

  @Column('jsonb', { nullable: true })
  public readonly location?: { lat: number; lon: number };

  @ManyToOne(() => User, (user) => user.plants, {
    onDelete: 'NO ACTION',
    createForeignKeyConstraints: false,
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  public readonly user: User;

  @Column('jsonb', {
    name: 'plant_productivity_decline_rate',
    nullable: true,
  })
  public readonly plantProductivityDeclineRate: PlantProductivityDeclineRate;

  @OneToMany(
    () => PlantEquipmentsStatus,
    (plantEquipmentsStatus) => plantEquipmentsStatus.plant,
    {
      createForeignKeyConstraints: false,
    },
  )
  public readonly plantEquipmentsStatus: PlantEquipmentsStatus[];

  @OneToMany(
    () => PlantStatusHistory,
    (plantStatusHistory) => plantStatusHistory.plant,
    {
      createForeignKeyConstraints: false,
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    },
  )
  public readonly plantStatusHistory: PlantStatusHistory[];

  @Column({
    type: 'varchar',
    length: 255,
    name: 'contact_person_name',
    nullable: true,
  })
  public readonly contactPersonName: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'contact_person_phone',
    nullable: true,
  })
  public readonly contactPersonPhone: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'contact_person_email',
    nullable: true,
  })
  public readonly contactPersonEmail: string;
}
