import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/api/auth/jwt-auth.guard';
import { RolesGuard } from '@/api/auth/roles.guard';
import { Roles } from '@/api/auth/roles.decorator';
import { UserRole } from '@/types/user';
import { ValidateContentTypeMiddleware } from '@/middleware/validate-content-type.middleware';
import { FormDataRequest } from 'nestjs-form-data';
import { PlantsEquipmentsEventsCreateRequestDto } from '@/api/plant-equipments-events/dto/plants-equipments-events-create.request.dto';
import { PlantsEquipmentsEventsService } from '@/api/plant-equipments-events/plants-equipments-events.service';
import { DeleteApiResponse, RequestUser } from '@/types/common';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('Plants Equipments Events')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/plants-equipments-events')
@UseInterceptors(ClassSerializerInterceptor)
export class PlantsEquipmentsEventsController {
  @Inject(PlantsEquipmentsEventsService)
  private readonly plantsEquipmentsEventsService: PlantsEquipmentsEventsService;

  @ApiConsumes('multipart/form-data')
  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(ValidateContentTypeMiddleware)
  @FormDataRequest()
  public async create(
    @Body()
    plantsEquipmentsEventsCreateDto: PlantsEquipmentsEventsCreateRequestDto,
  ) {
    return this.plantsEquipmentsEventsService.create(
      plantsEquipmentsEventsCreateDto,
    );
  }

  @Get('/:id')
  public async getById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Req() request: Request,
  ) {
    return this.plantsEquipmentsEventsService.getByIdAndUser(
      id,
      request.user as RequestUser,
    );
  }

  @Delete('/:id')
  @Roles(UserRole.ADMIN)
  public async delete(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<DeleteApiResponse> {
    return this.plantsEquipmentsEventsService.deleteById(id);
  }
}
