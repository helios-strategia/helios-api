import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { PlantsEquipmentsEvents } from '@/api/plant-equipments-events/plants-equipments-events.entity';
import { PlantsEquipmentsEventsRepository } from '@/api/plant-equipments-events/plants-equipments-events.repository';
import { PlantsEquipmentsEventsCreateRequestDto } from '@/api/plant-equipments-events/dto/plants-equipments-events-create.request.dto';
import { PlantService } from '@/api/plant/plant.service';
import { isNil, omit } from 'lodash';
import { NoDataFoundError } from '@/error/no-data-found.error';
import { Plant } from '@/api/plant/plant.entity';
import { MinioFileService } from '@/service/file-serivce/minio-file-service';
import { PlantEquipmentsService } from '@/api/plant-equipments/plant-equipments.service';
import { PlantEquipments } from '@/api/plant-equipments/plant-equipments.entity';
import { RouteNoDataFoundError } from '@/error/route-no-data-found.error';
import { DeleteApiResponse, RequestUser } from '@/types/common';
import { UserRole } from '@/types/user';

@Injectable()
export class PlantsEquipmentsEventsService {
  @Inject(PlantsEquipmentsEventsRepository)
  private readonly plantsEquipmentsEventsRepository: PlantsEquipmentsEventsRepository;
  @Inject(PlantService)
  private readonly plantService: PlantService;
  @Inject(MinioFileService)
  private readonly fileService: MinioFileService;
  @Inject(PlantEquipmentsService)
  private readonly plantEquipmentsService: PlantEquipmentsService;

  public async create({
    images,
    ...rest
  }: PlantsEquipmentsEventsCreateRequestDto) {
    const { plantId, plantEquipmentType } = rest;
    Logger.log('PlantsEquipmentsEventsService#create', {
      plantsEquipmentsEventsCreateDto: rest,
    });

    const plant = await this.plantService.findById(plantId);

    if (isNil(plant)) {
      throw new NoDataFoundError(Plant, plantId);
    }

    const plantEquipment = await this.plantEquipmentsService.getByPlantAndType(
      plantId,
      plantEquipmentType,
    );

    if (isNil(plantEquipment)) {
      throw new Error(
        `PlantEquipment type [${plantEquipmentType}] in plant [${plant.id}] doesn't exists`,
      );
    }

    const imageUrls = images?.length
      ? await Promise.all(images.map((image) => this.fileService.upload(image)))
      : null;

    const plantEquipmentsEvent: PlantsEquipmentsEvents =
      await this.plantsEquipmentsEventsRepository.save(
        this.mapDtoToEntity({
          dtoPayload: rest,
          plantEquipment,
          imageUrls,
        }),
      );

    Logger.log('PlantsEquipmentsEventsService#create end', {
      plantEquipmentsEvent,
      plantId,
    });

    return plantEquipmentsEvent;
  }

  public async getByIdAndUser(id: number, requestUser: RequestUser) {
    if (requestUser.role === UserRole.ADMIN) {
      return this.getById(id, true);
    }

    if (requestUser.role === UserRole.CLIENT) {
      const [plantsEquipmentsEvent, userPlantIds] = await Promise.all([
        this.plantsEquipmentsEventsRepository.findOne({
          where: { id },
          relations: { plantEquipment: { plant: true } },
        }),
        this.plantService
          .findAllByUserId(id)
          .then((plants) => plants.map(({ id }) => id)),
      ]);

      if (isNil(plantsEquipmentsEvent)) {
        throw new RouteNoDataFoundError(PlantsEquipmentsEvents, id);
      }

      if (
        userPlantIds.some(
          (plantId) =>
            plantId === plantsEquipmentsEvent.plantEquipment.plant.id,
        )
      ) {
        return plantsEquipmentsEvent;
      }

      throw new ForbiddenException();
    }

    throw new Error(
      `request user role doesn't match with any value or doesn't exists`,
    );
  }

  public async getById(id: number, fetchPlantEquipment = false) {
    const plantsEquipmentsEvent =
      await this.plantsEquipmentsEventsRepository.findOne({
        where: { id },
        relations: { plantEquipment: fetchPlantEquipment },
      });

    if (isNil(plantsEquipmentsEvent)) {
      throw new RouteNoDataFoundError(PlantsEquipmentsEvents, id);
    }

    return plantsEquipmentsEvent;
  }

  public async deleteById(id: number): Promise<DeleteApiResponse> {
    const plantsEquipmentsEvent = this.getById(id);
    const deleteResult = await this.plantsEquipmentsEventsRepository.delete({
      id,
    });

    Logger.log('PlantsEquipmentsEventsService#deleteById', {
      plantsEquipmentsEvent,
      deletedRows: deleteResult.affected,
    });

    return { message: `PlantsEquipmentsEvent [${id}] deleted` };
  }

  private mapDtoToEntity({
    dtoPayload,
    plantEquipment,
    imageUrls,
  }: {
    dtoPayload: Omit<PlantsEquipmentsEventsCreateRequestDto, 'images'>;
    plantEquipment: PlantEquipments;
    imageUrls?: string[];
  }) {
    const payloadWithOutImages = {
      ...omit(dtoPayload, 'plantId', 'plantEquipmentType'),
      plantEquipment,
    };

    if (imageUrls) {
      return {
        ...payloadWithOutImages,
        imageUrls,
      };
    }

    return payloadWithOutImages;
  }
}
