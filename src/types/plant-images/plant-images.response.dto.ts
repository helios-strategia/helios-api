import { BaseImageEntity } from '@/types/base-image-entity';
import { PlantResponseDto } from '@/types/plant';

export interface PlantImagesResponseDto extends BaseImageEntity {
  plant?: PlantResponseDto;
}
