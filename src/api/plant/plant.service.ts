import { Inject, Injectable, Logger } from '@nestjs/common';
import { PlantRepository } from '@/api/plant/plant.repository';
import { PlantDocumentService } from '@/api/plant-document/plant-document.service';
import { PlantDocument } from '@/api/plant-document/plant-document.entity';
import { UserService } from '@/api/user/user.service';
import { NoDataFoundError } from '@/error/no-data-found.error';
import { User } from '@/api/user/user.entity';
import { isNil, omit } from 'lodash';
import { TimeService } from '@/service/time-service/time.service';
import { Plant } from '@/api/plant/plant.entity';
import { UserRole } from '@/api/user/user-role.enum';
import { ValidationError } from '@/error/validation.error';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Events } from '@/events/events.enum';
import { PlantCreatedEvent } from '@/events/plant/plant-created.event';
import { PlantStatusUpdatedEvent } from '@/events/plant/plant-status-updated.event';
import {
  PlantCreateRequestDto,
  PlantProductivityDeclineRateRequestDto,
  PlantUpdateRequestDto,
} from '@/api/plant/dto';

@Injectable()
export class PlantService {
  @Inject(PlantRepository)
  private readonly plantRepository: PlantRepository;
  @Inject(PlantDocumentService)
  private readonly documentService: PlantDocumentService;
  @Inject(UserService)
  private readonly userService: UserService;
  @Inject(TimeService)
  private readonly timeService: TimeService;
  @Inject(EventEmitter2)
  private eventEmitter: EventEmitter2;

  public async create(plantCreateRequestDto: PlantCreateRequestDto) {
    Logger.log('PlantService#create', {
      ...omit(plantCreateRequestDto, 'masterPlan', 'documents'),
      documents: plantCreateRequestDto?.documents?.map(
        ({ originalName, size, mimetype }) => ({
          fileName: originalName,
          size: size,
          ext: mimetype,
        }),
      ),
    });

    const {
      userId,
      documents,
      documentTypes,
      status,
      plantProductivityDeclineRate,
      ...restCreatePayload
    } = plantCreateRequestDto;

    const documentsSaved: PlantDocument[] = [];
    const user = await this.userService.findById(userId);

    if (isNil(user)) {
      throw new NoDataFoundError(User, userId);
    }

    if (user.role === UserRole.ADMIN) {
      throw new ValidationError("User related to plant must be a 'CLIENT'");
    }

    if (documents?.length) {
      documentsSaved.push(
        ...(await this.documentService.createMany(
          documents.map((doc, i) => ({
            file: doc,
            documentType: documentTypes[i],
          })),
        )),
      );

      Logger.log('PlantService#create documents saved');
    }

    const plant = await this.plantRepository.save({
      documents: documentsSaved,
      user,
      status,
      plantProductivityDeclineRate: this.transformArrayPlantDeclineRatesToObj(
        plantProductivityDeclineRate,
      ),
      ...restCreatePayload,
    });

    Logger.log('PlantService#create plant saved', {
      plant,
    });

    this.eventEmitter.emit(
      Events.PlantCreated,
      new PlantCreatedEvent({ plant }),
    );

    return plant;
  }

  public async findById(id: number) {
    const plant = await this.plantRepository.findById(id);

    if (isNil(plant)) {
      throw new NoDataFoundError(Plant, id);
    }

    return plant;
  }

  public async findAll() {
    return this.plantRepository.find({
      relations: {
        user: true,
        documents: true,
        employees: true,
        plantStatusHistory: true,
      },
    });
  }

  public async findAllByUserId(userId: number) {
    return this.plantRepository.findByUserId(userId);
  }

  public async deleteById(id: number) {
    Logger.log('PlantService#deleteById', { id });

    const plant = await this.findById(id);

    if (isNil(plant)) {
      throw new NoDataFoundError(Plant, id);
    }

    return this.plantRepository.delete(id);
  }

  public async update(
    plantUpdateRequestDto: PlantUpdateRequestDto,
    id: number,
  ) {
    Logger.log('PlantService#update', {
      plantUpdateRequestDto,
    });

    const { plantProductivityDeclineRate, ...restUpdate } =
      plantUpdateRequestDto;

    const oldPlant = await this.plantRepository.findOne({
      where: { id },
    });

    if (isNil(oldPlant)) {
      throw new NoDataFoundError(Plant, id);
    }

    const res = await this.plantRepository.update(id, {
      plantProductivityDeclineRate: this.transformArrayPlantDeclineRatesToObj(
        plantProductivityDeclineRate,
      ),
      ...restUpdate,
    });

    Logger.log('PlantService#update end', { ...res });

    const updatedPlant = await this.plantRepository.findOne({
      where: { id },
      relations: {
        user: true,
        documents: true,
        employees: true,
      },
    });

    if (oldPlant.status !== updatedPlant.status) {
      this.eventEmitter.emit(
        Events.PlantStatusUpdated,
        new PlantStatusUpdatedEvent({
          prevStatus: oldPlant.status,
          currentStatus: updatedPlant.status,
          plant: updatedPlant,
        }),
      );
    }

    return updatedPlant;
  }

  public async isPresent(id: number): Promise<boolean> {
    return this.plantRepository
      .count({ where: { id } })
      .then((res) => res === 1);
  }

  public async getAllAndCountByIds(ids: number[]) {
    return this.plantRepository.getAllAndCountByIds(ids);
  }

  public async saveAll(plants: Plant[]) {
    return this.plantRepository.save(plants);
  }

  private transformArrayPlantDeclineRatesToObj(
    plantProductivityDeclineRateRequestDto: PlantProductivityDeclineRateRequestDto[],
  ) {
    return plantProductivityDeclineRateRequestDto?.reduce<
      Record<string, number>
    >((acc, { year, coefficient }) => {
      return {
        [year]: coefficient,
        ...acc,
      };
    }, {});
  }
}
