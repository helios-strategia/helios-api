import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/api/auth/roles.decorator';
import { UserRole } from '@/types/user';
import { JwtAuthGuard } from '@/api/auth/jwt-auth.guard';
import { RolesGuard } from '@/api/auth/roles.guard';
import { ValidateContentTypeMiddleware } from '@/library/middleware/validate-content-type.middleware';
import { BaseController } from '@/api/base-entity/base.controller';
import { OperationResponseDto } from '@/api/operation/dto/operation.response.dto';
import { Operation } from '@/api/operation/operation.entity';
import { OperationService } from '@/api/operation/operation.service';
import { OperationCreateRequestDto } from '@/api/operation/dto/operation-create.request.dto';
import { OperationUpdateRequestDto } from '@/api/operation/dto/operation-update.request.dto';
import { OperationPauseService } from '@/api/operation-pause/operation-pause.service';
import { GetByPlantQueryDto } from '@/api/operation/dto/get-by-plant-query.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { OperationPause } from '@/api/operation-pause/operation-pause.entity';
import { OperationPauseResponseDto } from '@/api/operation-pause/dto/operation-pause-response.dto';

@ApiBearerAuth()
@ApiTags('Operations')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/v1/operations')
export class OperationController extends BaseController<
  Operation,
  OperationResponseDto
> {
  constructor(
    @Inject(OperationService)
    public readonly operationService: OperationService,
    @Inject(OperationPauseService)
    public readonly operationPauseService: OperationPauseService,
    @InjectMapper()
    public readonly mapper: Mapper,
  ) {
    super(Operation, OperationResponseDto);
  }

  @ApiConsumes('multipart/form-data')
  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(ValidateContentTypeMiddleware)
  @FormDataRequest()
  public create(@Body() operationCreateRequestDto: OperationCreateRequestDto) {
    return this.toResponseDtoAsync(
      this.operationService.create(operationCreateRequestDto),
    );
  }

  @Patch('/:id')
  @Roles(UserRole.ADMIN)
  public update(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body() operationUpdateRequestDto: OperationUpdateRequestDto,
  ) {
    return this.toResponseDtoAsync(
      this.operationService.update(id, operationUpdateRequestDto),
    );
  }

  @Roles(UserRole.ADMIN)
  @Delete('/:id')
  public delete(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.operationService.delete(id);
  }

  @Get('/:id')
  public getById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.toResponseDtoAsync(
      this.operationService.findByIdOrElseThrow(id),
    );
  }

  @Get('/get-by-plant/:plantId')
  public get(
    @Param(
      'plantId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    plantId: number,
    @Query(ValidationPipe) { startDate, endDate }: GetByPlantQueryDto,
  ) {
    return this.toResponseDtoArrayAsync(
      this.operationService.findAllByPlantAndStartAtAndEndAt({
        plantId,
        startDate,
        endDate,
      }),
    );
  }

  @Roles(UserRole.ADMIN)
  @Post('/:id/set-pause')
  public setPause(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.toOperationPauseResponseDtoAsync(
      this.operationPauseService.create(id),
    );
  }

  @Roles(UserRole.ADMIN)
  @Post('/:id/end-pause')
  public async endPause(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    await this.operationPauseService.end(id);
  }

  private async toOperationPauseResponseDtoAsync(
    operationPause: Promise<OperationPause>,
  ) {
    return this.mapper.map(
      await operationPause,
      OperationPause,
      OperationPauseResponseDto,
    );
  }
}
