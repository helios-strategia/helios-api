import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { GenerationTariffRepository } from '@/api/generation-tariff/generation-tariff.repository';
import { PlantService } from '@/api/plant/plant.service';
import { GenerationTariffCreateRequestDto } from '@/api/generation-tariff/dto/generation-tariff-create.request.dto';
import { isNil, pick } from 'lodash';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { GenerationTariff } from '@/api/generation-tariff/generation-tariff.entity';
import { GenerationTariffResponseDto } from '@/api/generation-tariff/dto/generation-tariff.response.dto';
import { DBConflictError } from '@/error/d-b-conflict.error';
import { RouteNoDataFoundError } from '@/error/route-no-data-found.error';
import { Plant } from '@/api/plant/plant.entity';
import { getDeleteApiResponse } from '@/utils';
import { RequestContextService } from '@/request-context/request-context.service';
import { UserRole } from '@/types/user';
import { GenerationTariffUpdateRequestDto } from '@/api/generation-tariff/dto/generation-tariff-update.request.dto';

const getDBConflictMessage = (year: number, quarter: number, plantId: number) =>
  `GenerationTariff with year [${year}], quarter [${quarter}] in plant [${plantId}] already present`;

@Injectable()
export class GenerationTariffService {
  @Inject(GenerationTariffRepository)
  private readonly generationTariffRepository: GenerationTariffRepository;

  @Inject(PlantService)
  private readonly plantService: PlantService;

  @InjectMapper()
  private readonly classMapper: Mapper;

  @Inject(RequestContextService)
  private readonly requestContextService: RequestContextService;

  public async create(
    generationTariffCreateRequestDto: GenerationTariffCreateRequestDto,
    plantId: number,
  ) {
    const [plant, alreadyPresentTariff] = await Promise.all([
      this.plantService.findById(plantId),
      this.generationTariffRepository.findOne({
        where: {
          year: generationTariffCreateRequestDto.year,
          quarter: generationTariffCreateRequestDto.quarter,
          plantId,
        },
      }),
    ]);

    if (!isNil(alreadyPresentTariff)) {
      throw new DBConflictError(
        getDBConflictMessage(
          generationTariffCreateRequestDto.year,
          generationTariffCreateRequestDto.quarter,
          plantId,
        ),
      );
    }

    if (isNil(plant)) {
      throw new RouteNoDataFoundError(Plant, plantId);
    }

    const generationTariff = await this.generationTariffRepository.save({
      ...generationTariffCreateRequestDto,
      plant,
    });

    Logger.log('GenerationTariffService#create', {
      generationTariff,
    });

    return this.classMapper.map(
      generationTariff,
      GenerationTariff,
      GenerationTariffResponseDto,
    );
  }

  public async delete(generationTariffId: number, plantId: number) {
    const [plant, generationTariff] = await Promise.all([
      this.plantService.findById(plantId),
      this.generationTariffRepository.findOne({
        where: { id: generationTariffId, plantId },
      }),
    ]);

    if (isNil(plant)) {
      throw new RouteNoDataFoundError(Plant, plantId);
    }

    if (isNil(generationTariff)) {
      throw new RouteNoDataFoundError(GenerationTariff, generationTariffId);
    }

    const deleteResult = await this.generationTariffRepository.delete({
      id: generationTariffId,
      plantId,
    });

    Logger.log('GenerationTariffService#delete', {
      deleteResult: deleteResult.affected,
    });

    return getDeleteApiResponse(GenerationTariff, generationTariffId);
  }

  public async getAllByPlant(plantId: number) {
    const plant = await this.plantService.findById(plantId);

    if (isNil(plant)) {
      throw new RouteNoDataFoundError(Plant, plantId);
    }

    if (this.requestContextService.getUser.role === UserRole.ADMIN) {
      return this.classMapper.mapArray(
        await this.generationTariffRepository.findBy({ plantId }),
        GenerationTariff,
        GenerationTariffResponseDto,
      );
    }

    if (this.requestContextService.getUser.role === UserRole.CLIENT) {
      const userPlants = await this.plantService.findAllByUserId(
        this.requestContextService.getUserId,
      );

      if (!userPlants.map(({ id }) => id).includes(plantId)) {
        throw new ForbiddenException();
      }

      return this.classMapper.mapArray(
        await this.generationTariffRepository.findBy({ plantId }),
        GenerationTariff,
        GenerationTariffResponseDto,
      );
    }

    throw new Error('No match role');
  }

  public async update({
    generationTariffUpdateRequestDto,
    plantId,
    generationTariffId,
  }: {
    generationTariffUpdateRequestDto: GenerationTariffUpdateRequestDto;
    plantId: number;
    generationTariffId: number;
  }) {
    const [plant, generationTariff] = await Promise.all([
      this.plantService.findById(plantId),
      this.generationTariffRepository.findOne({
        where: { id: generationTariffId, plantId },
      }),
    ]);

    if (isNil(plant)) {
      throw new RouteNoDataFoundError(Plant, plantId);
    }

    if (isNil(generationTariff)) {
      throw new RouteNoDataFoundError(GenerationTariff, generationTariffId);
    }

    const conflictGenerationTariff =
      await this.generationTariffRepository.findOne({
        where: {
          plantId,
          ...pick(generationTariff, 'year', 'quarter'),
          ...generationTariffUpdateRequestDto,
        },
      });

    if (
      !isNil(conflictGenerationTariff) &&
      conflictGenerationTariff.id !== generationTariff.id
    ) {
      throw new DBConflictError(
        getDBConflictMessage(
          generationTariffUpdateRequestDto.year || generationTariff.year,
          generationTariffUpdateRequestDto.quarter || generationTariff.quarter,
          plantId,
        ),
      );
    }

    const updateResult = await this.generationTariffRepository.update(
      generationTariffId,
      generationTariffUpdateRequestDto,
    );

    Logger.log('GenerationTariffService#update', {
      updateResult,
    });

    return this.classMapper.map(
      await this.generationTariffRepository.findOne({
        where: { id: generationTariffId },
      }),
      GenerationTariff,
      GenerationTariffResponseDto,
    );
  }
}
