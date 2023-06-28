import { BaseImageEntity } from '@/api/base-image-entity/base-image.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Plant } from '@/api/plant/plant.entity';

@Entity({ name: 'plant_images' })
export class PlantImages extends BaseImageEntity {
  @ManyToOne(() => Plant, (plant) => plant.images, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn([{ name: 'plant_id', referencedColumnName: 'id' }])
  public readonly plant: Plant;
}
