import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { PlantEquipmentsEvents } from '@/api/plant-equipments-events/plants-equipments-events.entity';
import { PlantsEquipmentsEventsRepository } from '@/api/plant-equipments-events/plants-equipments-events.repository';
import { PlantsEquipmentsEventsCreateRequestDto } from '@/api/plant-equipments-events/dto/plants-equipments-events-create.request.dto';
import { PlantService } from '@/api/plant/plant.service';
import { isNil, pick } from 'lodash';
import { NoDataFoundError } from '@/error/no-data-found.error';
import { Plant } from '@/api/plant/plant.entity';
import { MinioFileService } from '@/service/file-serivce/minio-file-service';
import { PlantEquipmentsService } from '@/api/plant-equipments/plant-equipments.service';
import { RouteNoDataFoundError } from '@/error/route-no-data-found.error';
import { ApiDeleteResponse, RequestUser } from '@/types/common';
import { UserRole } from '@/types/user';
import { getDeleteApiResponse } from '@/utils';
import { PlantsEquipmentsEventsUpdateRequestDto } from '@/api/plant-equipments-events/dto/plants-equipments-events-update.request.dto';
import { PlantEquipmentsEventsImagesService } from '@/api/plant-equipments-events-images/plant-equipments-events-images.service';
import { TransactionPerformer } from '@/service/transaction-performer';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { PlantsEquipmentsEventsResponseDto } from '@/api/plant-equipments-events/dto';
import {
  PlantEquipmentsEventsImagesCreateRequestDto,
  PlantEquipmentsEventsImagesResponseDto,
} from '@/api/plant-equipments-events-images/dto';
import { PlantEquipmentsEventsImage } from '@/api/plant-equipments-events-images/plant-equipments-events-images.entity';

type ValueOrArray<T> = T | T[];
type MappedType<T, R> = T extends Array<infer U> ? R[] : R;

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
  @Inject(PlantEquipmentsEventsImagesService)
  private readonly plantEquipmentsEventsImagesService: PlantEquipmentsEventsImagesService;
  @Inject(TransactionPerformer)
  private readonly transactionPerformer: TransactionPerformer;
  @InjectMapper()
  private readonly classMapper: Mapper;

  public async create({
    images,
    ...rest
  }: PlantsEquipmentsEventsCreateRequestDto) {
    const { plantId, plantEquipmentType } = rest;
    Logger.log('PlantsEquipmentsEventsService#create', {
      plantsEquipmentsEventsCreateDto: rest,
    });

    const plant = await this.plantService.findByIdOrElseThrowNotFoundError(
      plantId,
    );

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

    const { data, error, success } = await this.transactionPerformer.perform({
      callback: async () => {
        const plantEquipmentsEventsImages = images?.length
          ? await this.plantEquipmentsEventsImagesService.bulkCreate(...images)
          : null;

        const plantEquipmentsEvent: PlantEquipmentsEvents =
          await this.plantsEquipmentsEventsRepository.save(
            {
              ...rest,
              plantEquipment,
              plantEquipmentsEventsImages,
            },
            { transaction: false },
          );

        return {
          plantEquipmentsEvent,
          plantEquipmentsEventsImages,
        };
      },
    });

    if (!success) {
      Logger.error('PlantEquipmentsService#create', {
        error,
        plantsEquipmentsEventsCreateRequestDto: rest,
        images: images.map((image) =>
          pick(image, 'mimetype', 'originalName', 'size'),
        ),
      });
    }

    Logger.log('PlantsEquipmentsEventsService#create end', {
      plantEquipmentsEvent: data?.plantEquipmentsEvent,
      plantEquipmentsEventsImages: data?.plantEquipmentsEventsImages,
    });

    return this.toDto(data?.plantEquipmentsEvent);
  }

  public async update(
    id: number,
    plantEquipmentEventToUpdate: PlantsEquipmentsEventsUpdateRequestDto,
  ) {
    const plantEquipmentEventOld = await this.getById(id);
    const updateResult = await this.plantsEquipmentsEventsRepository.update(
      id,
      plantEquipmentEventToUpdate,
    );

    Logger.log('PlantsEquipmentsEventsService#update', {
      plantEquipmentEventToUpdate,
      plantEquipmentEventOld,
      affected: updateResult.affected,
    });

    return this.toDto(await this.getById(id));
  }

  public async getByIdAndUser(id: number, requestUser: RequestUser) {
    if (requestUser.role === UserRole.ADMIN) {
      return this.toDto(await this.getById(id, true));
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
        throw new RouteNoDataFoundError(PlantEquipmentsEvents, id);
      }

      if (
        userPlantIds.some(
          (plantId) =>
            plantId === plantsEquipmentsEvent.plantEquipment.plant.id,
        )
      ) {
        return this.toDto(plantsEquipmentsEvent);
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
        relations: {
          plantEquipment: fetchPlantEquipment,
          plantEquipmentsEventsImages: true,
        },
      });

    if (isNil(plantsEquipmentsEvent)) {
      throw new RouteNoDataFoundError(PlantEquipmentsEvents, id);
    }

    return plantsEquipmentsEvent;
  }

  public async deleteById(id: number): Promise<ApiDeleteResponse> {
    const plantsEquipmentsEvent = this.getById(id);
    const deleteResult = await this.plantsEquipmentsEventsRepository.delete({
      id,
    });

    Logger.log('PlantsEquipmentsEventsService#deleteById', {
      plantsEquipmentsEvent,
      deletedRows: deleteResult.affected,
    });

    return getDeleteApiResponse(PlantEquipmentsEvents, id);
  }

  public async createImage(
    id: number,
    { image }: PlantEquipmentsEventsImagesCreateRequestDto,
  ) {
    const plantsEquipmentsEvent = await this.getById(id);

    if (isNil(plantsEquipmentsEvent)) {
      throw new RouteNoDataFoundError(PlantEquipmentsEvents, id);
    }

    const url = await this.fileService.upload(image);

    const plantEquipmentsEventsImage =
      await this.plantEquipmentsEventsImagesService.create({
        url,
        name: image.originalName,
        plantEquipmentEvent: plantsEquipmentsEvent,
      });

    Logger.log('CalendarEventImageService#createForEvent', {
      plantEquipmentsEventsImage,
    });

    return this.classMapper.map(
      plantEquipmentsEventsImage,
      PlantEquipmentsEventsImage,
      PlantEquipmentsEventsImagesResponseDto,
    );
  }

  public async deleteImageByEventId(id: number, eventId: number) {
    const [plantsEquipmentsEventImage, plantsEquipmentsEvent] =
      await Promise.all([
        this.plantEquipmentsEventsImagesService.findById(id),
        this.getById(eventId),
      ]);

    if (isNil(plantsEquipmentsEvent)) {
      throw new RouteNoDataFoundError(PlantEquipmentsEvents, id);
    }

    if (isNil(plantsEquipmentsEventImage)) {
      throw new RouteNoDataFoundError(PlantEquipmentsEventsImage, id);
    }

    const deleteResult = await this.plantEquipmentsEventsImagesService.delete(
      id,
    );

    Logger.log('CalendarEventImageService#deleteById', {
      affected: deleteResult.affected,
    });

    return getDeleteApiResponse(PlantEquipmentsEventsImage, id);
  }

  private toDto(
    plantEquipmentEvents: ValueOrArray<PlantEquipmentsEvents>,
  ): MappedType<PlantEquipmentsEvents, PlantsEquipmentsEventsResponseDto> {
    if (Array.isArray(plantEquipmentEvents)) {
      return this.classMapper.mapArray(
        plantEquipmentEvents,
        PlantEquipmentsEvents,
        PlantsEquipmentsEventsResponseDto,
      ) as any;
    }

    return this.classMapper.map(
      plantEquipmentEvents,
      PlantEquipmentsEvents,
      PlantsEquipmentsEventsResponseDto,
    ) as any;
  }
}
