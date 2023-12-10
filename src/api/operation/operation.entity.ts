import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../base-entity/base.entity';
import { Plant } from '../plant/plant.entity';
import { OperationType } from 'src/types/operation';
import { OperationPause } from '@/api/operation-pause/operation-pause.entity';
import { AutoMap } from '@automapper/classes';
import { OperationImage } from '@/api/operation-image/operation-image.entity';
import { defaultRelationOptions, OperationTypeEnum } from '@/consts';
import { Employee } from '../employee/employee.entity';

@Index(['plant'], { unique: false })
@Index('plant_id_start_date_title_index', ['plant', 'startDate', 'title'], {
  unique: true,
})
@Index('plant_id_start_at_end_at_index', ['plant', 'startDate', 'endDate'], {
  unique: false,
})
@Entity('operations', { schema: 'public' })
export class Operation extends BaseEntity {
  @AutoMap()
  @Column('enum', {
    name: 'operation_type',
    enum: OperationTypeEnum,
    default: OperationTypeEnum.PlannedWork,
  })
  public readonly operationType: OperationType;

  @AutoMap()
  @Column('character varying', {
    nullable: true,
    length: 1024,
  })
  public readonly description: string | null;

  @AutoMap()
  @Column('timestamp with time zone', { name: 'end_date', nullable: false })
  public readonly endDate: Date;

  @AutoMap()
  @Column('timestamp with time zone', { name: 'start_date', nullable: false })
  public readonly startDate: Date;

  @AutoMap()
  @Column('character varying', { name: 'title', nullable: false, length: 255 })
  public readonly title: string;

  @AutoMap(() => Plant)
  @ManyToOne(
    () => Plant,
    (plant) => plant.calendarEvents,
    defaultRelationOptions,
  )
  @JoinColumn([{ name: 'plant_id', referencedColumnName: 'id' }])
  public readonly plant: Plant;

  @AutoMap(() => Number)
  @Column({ name: 'plant_id', type: 'int', nullable: false })
  public readonly plantId: number;

  @AutoMap(() => [OperationPause])
  @OneToMany(
    () => OperationPause,
    (calendarEventPause) => calendarEventPause.operation,
    defaultRelationOptions,
  )
  public readonly pauses?: OperationPause[];

  @AutoMap(() => [OperationImage])
  @OneToMany(() => OperationImage, (operationImage) => operationImage.operation)
  public readonly images?: OperationImage[];

  @AutoMap(() => [Employee])
  @ManyToOne(
    () => Employee,
    (employees) => employees.operations,
    defaultRelationOptions,
  )
  @JoinTable({
    name: 'operation_employee',
    joinColumn: { name: 'operation_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'employee_id', referencedColumnName: 'id' },
  })
  public readonly employees: Employee[];
}
