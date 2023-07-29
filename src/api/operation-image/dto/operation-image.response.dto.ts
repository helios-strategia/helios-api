import { BaseImageResponseDto } from '@/api/base-image-entity/base-image.response.dto';
import { OperationImageResponseDto as OperationImageResponseDtoType } from 'src/types/operation-images';

export class OperationImageResponseDto
  extends BaseImageResponseDto
  implements OperationImageResponseDtoType {}
