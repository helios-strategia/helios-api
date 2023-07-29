import { BaseEntity } from '@/api/base-entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Operation } from '@/api/operation/operation.entity';
import { AutoMap } from '@automapper/classes';
import { defaultRelationOptions } from '@/consts';

@Entity('operation_pauses', { schema: 'public' })
export class OperationPause extends BaseEntity {
  @AutoMap()
  @Column('timestamp with time zone', { name: 'start_at', nullable: false })
  public readonly startAt: Date;

  @AutoMap()
  @Column('timestamp with time zone', { name: 'end_at', nullable: true })
  public readonly endAt: Date;

  @ManyToOne(
    () => Operation,
    (calendarEvent) => calendarEvent.pauses,
    defaultRelationOptions,
  )
  @JoinColumn([{ name: 'operation_id', referencedColumnName: 'id' }])
  public readonly operation: Operation;

  @AutoMap(() => Number)
  @Column({ name: 'operation_id', type: 'int', nullable: false })
  public readonly operationId: number;
}
