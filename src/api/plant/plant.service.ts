import { Inject, Injectable, Logger } from '@nestjs/common';
import { PlantRepository } from '@/api/plant/plant.repository';
import { PlantDocumentService } from '@/api/plant-document/plant-document.service';
import { PlantDocument } from '@/api/plant-document/plant-document.entity';
import { UserService } from '@/api/user/user.service';
import { NoDataFoundError } from '@/error/no-data-found.error';
import { User } from '@/api/user/user.entity';
import { isNil, omit } from 'lodash';
import { TimeService } from '@/library/time-service/time.service';
import { Plant } from '@/api/plant/plant.entity';
import { ValidationError } from '@/error/validation.error';
import {
  PlantCreateRequestDto,
  PlantProductivityDeclineRateRequestDto,
  PlantResponseDto,
  PlantUpdateRequestDto,
} from '@/api/plant/dto';
import { PlantStatusHistoryService } from '@/api/plant-status-history/plant-status-history.service';
import { UserRole } from '@/types/user';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TransactionPerformer } from '@/library/transaction-performer';
import { DBConflictError } from '@/error/d-b-conflict.error';
import { PlantEquipmentsService } from '@/api/plant-equipments/plant-equipments.service';
import { getDeleteApiResponse } from '@/utils';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { RouteNoDataFoundError } from '@/error/route-no-data-found.error';
import {
  PlantFilesService,
  PlantFileTypes,
} from '@/api/plant/plant-files.service';
import { PlantDocumentType } from '@/types/plant-document';

@Injectable()
export class PlantService {
  @Inject(PlantRepository)
  private readonly plantRepository: PlantRepository;
  @Inject(UserService)
  private readonly userService: UserService;
  @Inject(PlantStatusHistoryService)
  private readonly plantStatusHistoryService: PlantStatusHistoryService;
  @Inject(TimeService)
  private readonly timeService: TimeService;
  @InjectDataSource()
  private readonly dataSource: DataSource;
  @Inject(TransactionPerformer)
  private readonly transactionPerformer: TransactionPerformer;
  @Inject(PlantEquipmentsService)
  private readonly plantEquipmentsService: PlantEquipmentsService;
  @Inject(PlantFilesService)
  private readonly plantFilesService: PlantFilesService;
  @InjectMapper()
  private readonly classMapper: Mapper;

  public async create(plantCreateRequestDto: PlantCreateRequestDto) {
    Logger.log('PlantService#create', {
      ...omit(
        plantCreateRequestDto,
        'mainPlan',
        'documents',
        'taxStatement',
        'images',
      ),
    });

    const {
      userId,
      documents,
      documentTypes,
      status,
      plantProductivityDeclineRate,
      images,
      taxStatement,
      mainPlan,
      ...restCreatePayload
    } = plantCreateRequestDto;

    const [user, plantWithExistingAscme] = await Promise.all([
      this.userService.findById(userId),
      this.plantRepository.findOne({
        where: { ascmePlantCode: plantCreateRequestDto.ascmePlantCode },
      }),
    ]);

    if (isNil(user)) {
      throw new NoDataFoundError(User, userId);
    }

    if (user.role === UserRole.ADMIN) {
      throw new ValidationError('User related to plant must be a [CLIENT]');
    }

    if (!isNil(plantWithExistingAscme)) {
      throw new DBConflictError(
        `Plant with current ASCME [${plantCreateRequestDto.ascmePlantCode}] code already exists`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    let plant: Plant;

    try {
      const [documentsUpload, imagesUpload, taxStatementUrl, mainPlanUrl] =
        await this.plantFilesService.upload({
          [PlantFileTypes.Documents]: documents.map((doc, i) => ({
            file: doc,
            documentType: documentTypes[i] as PlantDocumentType,
          })),
          [PlantFileTypes.Images]: images,
          [PlantFileTypes.TaxStatement]: taxStatement,
          [PlantFileTypes.MainPlan]: mainPlan,
        });

      plant = await this.plantRepository.save(
        {
          documents: documentsUpload,
          images: imagesUpload,
          user,
          status,
          plantProductivityDeclineRate:
            this.transformArrayPlantDeclineRatesToObj(
              plantProductivityDeclineRate,
            ),
          taxStatementUrl,
          mainPlanUrl,
          ...restCreatePayload,
        },
        { transaction: false },
      );

      const plantStatusHistory = await this.plantStatusHistoryService.create(
        plant,
      );

      const plantEquipments = await this.plantEquipmentsService.createForPlant(
        plant,
      );

      await queryRunner.commitTransaction();

      Logger.log('PlantService#create plant saved', {
        plant,
        plantStatusHistory,
        plantEquipments,
      });
    } catch (error) {
      Logger.error('PlantService#create error', {
        error,
      });

      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }

    return this.classMapper.map(
      await this.plantRepository.findOne({
        where: { id: plant.id },
        relations: {
          user: true,
          documents: true,
          employees: true,
          plantStatusHistory: true,
          images: true,
        },
      }),
      Plant,
      PlantResponseDto,
    );
  }

  public async findByIdOrElseThrowValidationError(id: number) {
    const plant = await this.plantRepository.findById(id);

    if (isNil(plant)) {
      throw new RouteNoDataFoundError(Plant, id);
    }

    return this.classMapper.map(plant, Plant, PlantResponseDto);
  }

  public async findByIdOrElseThrowNotFoundError(id: number) {
    const plant = await this.plantRepository.findById(id);

    if (isNil(plant)) {
      throw new NoDataFoundError(Plant, id);
    }

    return plant;
  }

  public findById(id: number) {
    return this.plantRepository.findOne({ where: { id } });
  }

  public async findAll() {
    return this.classMapper.mapArray(
      await this.plantRepository.find({
        relations: {
          user: true,
          documents: true,
          employees: true,
          plantStatusHistory: true,
          images: true,
        },
      }),
      Plant,
      PlantResponseDto,
    );
  }

  public async findAllByUserId(userId: number) {
    return this.classMapper.mapArray(
      await this.plantRepository.findByUserId(userId),
      Plant,
      PlantResponseDto,
    );
  }

  public async deleteById(id: number) {
    Logger.log('PlantService#deleteById', { plantId: id });

    const plant = await this.findByIdOrElseThrowNotFoundError(id);

    if (isNil(plant)) {
      throw new NoDataFoundError(Plant, id);
    }

    const result = await this.transactionPerformer.perform({
      callback: async () => {
        await Promise.all([
          this.plantRepository.delete(id),
          this.plantEquipmentsService.bulkDelete(plant.id),
        ]);
      },
    });

    if (!result.success) {
      Logger.error('PlantService#deleteById error', {
        plantId: id,
      });

      throw result.error;
    }

    return getDeleteApiResponse(Plant, id);
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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await this.plantRepository.update(id, {
        plantProductivityDeclineRate: this.transformArrayPlantDeclineRatesToObj(
          plantProductivityDeclineRate,
        ),
        ...restUpdate,
      });

      const updatedPlant = await this.plantRepository.findOne({
        where: { id },
      });

      if (oldPlant.status !== updatedPlant.status) {
        await this.plantStatusHistoryService.createOnUpdatedPlant({
          prevStatus: oldPlant.status,
          currentStatus: updatedPlant.status,
          plant: updatedPlant,
        });
      }

      await queryRunner.commitTransaction();

      Logger.log('PlantService#update end', { updatedPlant });

      return this.classMapper.map(
        await this.plantRepository.findOne({
          where: { id: updatedPlant.id },
          relations: {
            user: true,
            documents: true,
            employees: true,
            plantStatusHistory: true,
            images: true,
          },
        }),
        Plant,
        PlantResponseDto,
      );
    } catch (error) {
      Logger.error('PlantService#update error', {
        error,
      });

      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
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
