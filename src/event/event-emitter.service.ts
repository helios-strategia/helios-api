import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Events } from '@/types/events';

@Injectable()
export class EventEmitterService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public emit(event: Events, payload: any) {
    this.eventEmitter.emit(event, payload);
  }
}
