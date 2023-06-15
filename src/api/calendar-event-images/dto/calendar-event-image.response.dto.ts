import { PlantEquipmentsEventsImagesResponseDto as PlantEquipmentsEventsImagesResponseDtoType } from '@/types/plant-equipments-events-images';
import { BaseImageResponseDto } from "@/api/base-image-entity/base-image.response.dto";

export class CalendarEventImageResponseDto
  extends BaseImageResponseDto
  implements PlantEquipmentsEventsImagesResponseDtoType
{}
