import { BaseImageResponseDto } from '@/api/base-image-entity/base-image.response.dto';
import { CalendarEventImagesResponseDto } from '@/types/calendar-event-images';

export class CalendarEventImageResponseDto
  extends BaseImageResponseDto
  implements CalendarEventImagesResponseDto {}
