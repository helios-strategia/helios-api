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
import { BaseEntity } from '../base-entity/base.entity';
import { PlantStatus } from '@/types/plant';
import { PlantEquipments } from '@/api/plant-equipments/plant-equipments.entity';
import { PlantStatusHistory } from '@/api/plant-status-history/plant-status-history.entity';
import { PlantProductivityDeclineRate } from '@/types/plant';
import { AutoMap } from '@automapper/classes';

@Index(['ascmePlantCode'], { unique: true })
@Entity('plants')
export class Plant extends BaseEntity {
  @AutoMap()
  @Column('integer', { name: 'ac_power', nullable: true })
  public readonly acPower: number | null;

  @AutoMap()
  @Column('integer', { name: 'dc_power', nullable: true })
  public readonly dcPower: number | null;

  @AutoMap(() => [Number])
  @Column('float8', {
    name: 'pvsyst_generation_plan',
    nullable: true,
    array: true,
  })
  public readonly pvsystGenerationPlan: number[] | null;

  @AutoMap()
  @Column('double precision', { name: 'area', nullable: true })
  public readonly area: number | null;

  @AutoMap()
  @Column('bigint', { name: 'ascme_plant_code', nullable: false, unique: true })
  public readonly ascmePlantCode: string;

  @AutoMap()
  @Column('timestamp without time zone', {
    name: 'exploitation_start',
    nullable: true,
  })
  public readonly exploitationStart: Date | null;

  @AutoMap()
  @Column('text', { name: 'name', nullable: false })
  public readonly name: string;

  @AutoMap()
  @Column('text', { name: 'status', nullable: false })
  public readonly status: PlantStatus;

  @AutoMap()
  @OneToMany(() => CalendarEvent, (calendarEvent) => calendarEvent.plant, {
    createForeignKeyConstraints: false,
  })
  public readonly calendarEvents: CalendarEvent[];

  @AutoMap()
  @OneToMany(() => PlantDocument, (document) => document.plant, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    createForeignKeyConstraints: false,
  })
  public readonly documents: PlantDocument[];

  @AutoMap()
  @ManyToMany(() => Employee, (employee) => employee.plants, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: 'plant_employee',
    joinColumn: { name: 'plant_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'employee_id', referencedColumnName: 'id' },
  })
  public readonly employees: Employee[];

  @AutoMap()
  @Column('int', { nullable: true, name: 'location_latitude' })
  public readonly locationLatitude: number | null;

  @AutoMap()
  @Column('int', { nullable: true, name: 'location_longitude' })
  public readonly locationLongitude: number | null;

  @AutoMap(() => User)
  @ManyToOne(() => User, (user) => user.plants, {
    onDelete: 'NO ACTION',
    nullable: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  public readonly user: User;

  @AutoMap()
  @Column('jsonb', {
    name: 'plant_productivity_decline_rate',
    nullable: true,
  })
  public readonly plantProductivityDeclineRate: PlantProductivityDeclineRate | null;

  @AutoMap(() => [PlantEquipments])
  @OneToMany(
    () => PlantEquipments,
    (plantEquipmentsStatus) => plantEquipmentsStatus.plant,
    {
      createForeignKeyConstraints: false,
    },
  )
  public readonly plantEquipmentsStatus: PlantEquipments[];

  @AutoMap(() => [PlantStatusHistory])
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

  @AutoMap()
  @Column({
    type: 'varchar',
    length: 255,
    name: 'contact_person_name',
    nullable: true,
  })
  public readonly contactPersonName: string | null;

  @AutoMap()
  @Column({
    type: 'varchar',
    length: 255,
    name: 'contact_person_phone',
    nullable: true,
  })
  public readonly contactPersonPhone: string | null;

  @AutoMap()
  @Column({
    type: 'varchar',
    length: 255,
    name: 'contact_person_email',
    nullable: true,
  })
  public readonly contactPersonEmail: string | null;
}
