import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  EmployeeCreateRequestDto,
  EmployeeUpdateRequestDto,
} from '@/api/employee/employee.dto';
import { EmployeeRepository } from '@/api/employee/employee.repository';
import { PositionService } from '@/api/position/position.service';
import { NoDataFoundError } from '@/error/no-data-found.error';
import { Position } from '@/api/position/position.entity';
import { PlantService } from '@/api/plant/plant.service';
import { Plant } from '@/api/plant/plant.entity';
import { isNil, omit } from 'lodash';
import { Employee, ScheduleScheme } from '@/api/employee/employee.entity';
import { RouteNoDataFoundError } from '@/error/route-no-data-found.error';
import { MinioFileService } from '@/library/file-serivce/minio-file-service';
import { Mutable } from '@/types';

@Injectable()
export class EmployeeService {
  @Inject(EmployeeRepository)
  private readonly employeeRepository: EmployeeRepository;
  @Inject(MinioFileService)
  private readonly fileService: MinioFileService;
  @Inject(PositionService)
  private readonly positionService: PositionService;
  @Inject(PlantService)
  private readonly plantService: PlantService;

  public async create(
    employeeCreateRequestDto: EmployeeCreateRequestDto,
    token: string,
  ) {
    Logger.log('EmployeeService#create', {
      avatar: {
        size: employeeCreateRequestDto?.avatar?.size,
        ext: employeeCreateRequestDto?.avatar?.mimetype,
      },
      ...omit(employeeCreateRequestDto, 'avatar'),
    });

    const {
      avatar,
      plantIds,
      positionId,
      fiveDaySchedule,
      vacationsDates,
      workStartTimestamp,
      workHours,
      restHours,
      ...restPayload
    } = employeeCreateRequestDto;

    const [position, [plants, plantsCount]]: [Position, [Plant[], number]] =
      await Promise.all([
        this.positionService.getById(positionId),
        this.plantService.getAllAndCountByIds(plantIds),
      ]);

    if (isNil(position)) {
      throw new NoDataFoundError(Position, positionId);
    }

    if (plantsCount !== plantIds.length) {
      Logger.warn('Plants not found by ids', {
        ...plants,
        plantIds,
      });
    }

    let avatarUrl: string;

    if (avatar) {
      avatarUrl = await this.fileService.upload(avatar, token);

      Logger.log('file url ' + avatarUrl);
    }

    return this.employeeRepository.save({
      position,
      plants,
      scheduleScheme: {
        fiveDaySchedule,
        workStartTimestamp,
        vacationsDates,
        workHours,
        restHours,
      },
      ...restPayload,
      ...(avatarUrl && { avatarUrl }),
    });
  }

  public async findAll() {
    return this.employeeRepository.find({
      relations: {
        position: true,
        plants: true,
      },
    });
  }

  public async findByPlantId(plantId: number) {
    return this.employeeRepository.findByPlantId(plantId);
  }

  public async findOne(id: number) {
    return this.employeeRepository.findOne({ where: { id } });
  }

  public async remove(id: number) {
    if (!(await this.isPresent(id))) {
      throw new NotFoundException('employee not found');
    }

    const employeeToRemove = await this.employeeRepository.findOne({
      where: { id },
      relations: {
        plants: true,
      },
    });

    const updateRes = await this.employeeRepository.save({
      ...employeeToRemove,
      plants: [],
    });

    Logger.log('EmployeeService#remove', { ...updateRes, employeeToRemove });

    return this.employeeRepository.delete(id);
  }

  public async isPresent(id: number) {
    return this.employeeRepository
      .count({ where: { id } })
      .then((res) => res === 1);
  }

  public async update(
    id: number,
    employeeUpdateRequestDto: EmployeeUpdateRequestDto,
  ) {
    Logger.log('EmployeeService#update', {
      employeeUpdateRequestDto,
    });

    const {
      plantIds,
      positionId,
      fiveDaySchedule,
      vacationsDates,
      workStartTimestamp,
      workHours,
      restHours,
      ...restPayload
    } = employeeUpdateRequestDto;

    const employeeToUpdate = await this.employeeRepository.findOne({
      where: { id },
    });

    if (isNil(employeeToUpdate)) {
      throw new RouteNoDataFoundError(Employee, id);
    }

    const updatePayload: Mutable<
      Pick<Partial<Employee>, 'position' | 'plants'>
    > = {};

    if (positionId) {
      const position = await this.positionService.getById(positionId);

      if (isNil(position)) {
        throw new NoDataFoundError(Position, positionId);
      }

      updatePayload.position = position;
    }

    if (plantIds) {
      const [plants, count] = await this.plantService.getAllAndCountByIds(
        plantIds,
      );

      Logger.log('EmployeeService#update plants fetched', { plants, count });

      updatePayload.plants = plants;
    }

    const updatedEmployee = await this.employeeRepository.update(id, {
      ...employeeToUpdate,
      ...restPayload,
      ...updatePayload,
      scheduleScheme: this.updateScheduleSchema(
        employeeToUpdate.scheduleScheme,
        {
          fiveDaySchedule,
          vacationsDates,
          workStartTimestamp,
          workHours,
          restHours,
        },
      ),
    });

    Logger.log('EmployeeService#update end', { updatedEmployee });

    return this.employeeRepository.findOne({
      where: { id },
      relations: {
        plants: true,
        position: true,
      },
    });
  }

  private updateScheduleSchema(
    oldScheme: ScheduleScheme,
    {
      fiveDaySchedule,
      vacationsDates,
      workStartTimestamp,
      workHours,
      restHours,
    }: Partial<ScheduleScheme>,
  ) {
    if (
      fiveDaySchedule ||
      vacationsDates ||
      workStartTimestamp ||
      workHours ||
      restHours
    ) {
      return {
        ...oldScheme,
        ...((fiveDaySchedule === true || fiveDaySchedule === false) && {
          fiveDaySchedule,
        }),
        ...(vacationsDates && { vacationsDates }),
        ...(workStartTimestamp && { workStartTimestamp }),
        ...(workHours && { workHours }),
        ...(restHours && { restHours }),
      };
    }

    return oldScheme;
  }
}
