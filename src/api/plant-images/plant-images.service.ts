import { Inject, Injectable, Logger } from '@nestjs/common';
import { MinioFileService } from '@/library/file-serivce/minio-file-service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { PlantImagesRepository } from '@/api/plant-images/plant-images.repository';
import { Plant } from '@/api/plant/plant.entity';
import { MemoryStoredFile } from 'nestjs-form-data';
import { getDeleteApiResponse } from '@/utils';
import { PlantImage } from '@/api/plant-images/plant-images.entity';
import { PlantImagesResponseDto } from '@/api/plant-images/dto/plant-images.response.dto';

@Injectable()
export class PlantImagesService {
  @Inject(PlantImagesRepository)
  private readonly plantImagesRepository: PlantImagesRepository;

  @Inject(MinioFileService)
  private readonly fileService: MinioFileService;

  @InjectMapper()
  private readonly classMapper: Mapper;

  public async create({
    url,
    name,
    plant,
  }: {
    url: string;
    name: string;
    plant: Plant;
  }) {
    return this.plantImagesRepository.save({
      url,
      name,
      plant,
    });
  }

  public async uploadAndCreate(image: MemoryStoredFile, plant: Plant) {
    const plantImage = await this.plantImagesRepository.save({
      url: await this.fileService.upload(image),
      name: image.originalName,
      plant,
    });

    Logger.log('PlantImagesService#uploadAndCreate', {
      plantImage,
    });

    return this.classMapper.map(plantImage, PlantImage, PlantImagesResponseDto);
  }

  public async bulkCreate(...images: MemoryStoredFile[]) {
    const imagesSaved = await Promise.all(
      images.map(async (image) => {
        const url = await this.fileService.upload(image);

        return this.plantImagesRepository.save(
          {
            url,
            name: image.originalName,
          },
          { transaction: false },
        );
      }),
    );

    Logger.log('PlantImagesService#bulkCreate', {
      imagesSaved,
    });

    return imagesSaved;
  }

  public async delete(id: number) {
    const deleteResult = await this.plantImagesRepository.delete({ id });

    Logger.log('PlantImagesService#delete', {
      affected: deleteResult.affected,
    });

    return getDeleteApiResponse(PlantImage, id);
  }

  public async findById(id: number) {
    return this.classMapper.map(
      await this.plantImagesRepository.findOne({ where: { id } }),
      PlantImage,
      PlantImagesResponseDto,
    );
  }
}
