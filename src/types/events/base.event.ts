import { Events } from './events.enum';

export interface BaseEvent {
  readonly eventType: Events;
}
