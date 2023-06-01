import { Events, BaseEvent as BaseEventType } from '@/types/events';

export abstract class BaseEvent implements BaseEventType {
  protected constructor(public readonly eventType: Events) {}
}
