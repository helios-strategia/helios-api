import { Inject, Injectable, Logger } from '@nestjs/common';
import { PlantEquipmentsEventsImagesRepository } from '@/api/plant-equipments-events-images/plant-equipments-events-images.repository';
import { MinioFileService } from '@/service/file-serivce/minio-file-service';
import { MemoryStoredFile } from 'nestjs-form-data';
import { PlantEquipmentsEventsImagesResponseDto } from '@/api/plant-equipments-events-images/dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { PlantEquipmentsEventsImage } from '@/api/plant-equipments-events-images/plant-equipments-events-images.entity';
import { PlantEquipmentsEvents } from '@/api/plant-equipments-events/plants-equipments-events.entity';

@Injectable()
export class PlantEquipmentsEventsImagesService {
  @Inject(PlantEquipmentsEventsImagesRepository)
  private readonly plantEquipmentsEventsImagesRepository: PlantEquipmentsEventsImagesRepository;
  @Inject(MinioFileService)
  private readonly fileService: MinioFileService;
  @InjectMapper()
  private readonly classMapper: Mapper;

  public async create({
    url,
    name,
    plantEquipmentEvent,
  }: {
    url: string;
    name: string;
    plantEquipmentEvent: PlantEquipmentsEvents;
  }) {
    return this.plantEquipmentsEventsImagesRepository.save({
      url,
      name,
      plantEquipmentEvent,
    });
  }

  public async bulkCreate(...images: MemoryStoredFile[]) {
    const plantEquipmentsEventsImages = await Promise.all(
      images.map(async (image) => {
        const url = await this.fileService.upload(image);

        return this.plantEquipmentsEventsImagesRepository.save(
          {
            url,
            name: image.originalName,
          },
          { transaction: false },
        );
      }),
    );

    Logger.log('CalendarEventImageService#bulkCreate', {
      plantEquipmentsEventsImages,
    });

    return this.classMapper.mapArray(
      plantEquipmentsEventsImages,
      PlantEquipmentsEventsImage,
      PlantEquipmentsEventsImagesResponseDto,
    );
  }

  public async delete(id: number) {
    const deleteResult =
      await this.plantEquipmentsEventsImagesRepository.delete({ id });

    Logger.log('CalendarEventImageService#delete', {
      affected: deleteResult.affected,
    });

    return deleteResult;
  }

  public async findById(id: number) {
    return this.plantEquipmentsEventsImagesRepository.findOne({
      where: { id },
    });
  }

  public async findByName(imageName: string) {
    return this.plantEquipmentsEventsImagesRepository.findOne({
      where: { name: imageName },
    });
  }
}
