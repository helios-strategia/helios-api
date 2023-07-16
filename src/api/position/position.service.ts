import { Inject, Injectable, Logger } from '@nestjs/common';
import { PositionRepository } from '@/api/position/position.repository';
import { BaseService } from '@/api/base-entity/base.service';
import { Position } from '@/api/position/position.entity';
import { PositionResponseDto } from '@/api/position/dto/position.response.dto';
import { isNil } from 'lodash';
import { RouteNoDataFoundError } from '@/error/route-no-data-found.error';
import { PositionCreateRequestDto } from '@/api/position/dto/position-create.request.dto';
import { PositionUpdateRequestDto } from '@/api/position/dto/position-update.request.dto';
import { DBConflictError } from '@/error/d-b-conflict.error';

@Injectable()
export class PositionService extends BaseService<
  Position,
  PositionResponseDto
> {
  @Inject(PositionRepository)
  private readonly positionRepository: PositionRepository;

  constructor() {
    super(Position, PositionResponseDto);
  }

  public async isPresent(id: number) {
    return (await this.positionRepository.count({ where: { id } })) === 1;
  }

  public async getById(id: number) {
    const position = await this.positionRepository.findOne({ where: { id } });

    if (isNil(position)) {
      throw new RouteNoDataFoundError(this.entityConstructor);
    }

    return position;
  }

  public async getByName(name: string) {
    const position = await this.positionRepository.findOne({ where: { name } });

    if (isNil(position)) {
      throw new RouteNoDataFoundError(this.entityConstructor);
    }

    return position;
  }

  public async delete(id: number) {
    const positionToDelete = await this.positionRepository.findOneOrFail({
      where: { id },
    });

    const deleteResult = await this.positionRepository.delete(
      positionToDelete.id,
    );

    Logger.log(`${this.className}#delete`, {
      ...this.getLogMeta,
      deleteResult,
    });

    return this.getDeleteApiResponse(positionToDelete.id);
  }

  public async create(positionCreateRequestDto: PositionCreateRequestDto) {
    const position = await this.positionRepository.save(
      positionCreateRequestDto,
    );

    Logger.log(`${this.className}#create`, {
      ...this.getLogMeta,
      position,
    });

    return position;
  }

  public async update(
    id: number,
    positionUpdateRequestDto: PositionUpdateRequestDto,
  ) {
    if (
      positionUpdateRequestDto.name &&
      (await this.positionRepository.count({
        where: { name: positionUpdateRequestDto.name },
      })) === 1
    ) {
      throw new DBConflictError(
        `Position [${positionUpdateRequestDto.name}] already exists`,
      );
    }

    const position = await this.positionRepository.findBy({ id });

    if (isNil(position)) {
      throw new RouteNoDataFoundError(this.entityConstructor);
    }

    const updateResult = await this.positionRepository.update(
      id,
      positionUpdateRequestDto,
    );

    Logger.log(`${this.className}#update`, {
      ...this.getLogMeta,
      updateResult,
      positionUpdateRequestDto,
      id,
    });

    return this.positionRepository.findOneBy({ id });
  }

  public async getAll() {
    return this.positionRepository.find();
  }
}
