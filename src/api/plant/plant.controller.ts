import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/api/auth/jwt-auth.guard';
import { RolesGuard } from '@/api/auth/roles.guard';
import { PlantService } from '@/api/plant/plant.service';
import { Roles } from '@/api/auth/roles.decorator';
import { FormDataRequest } from 'nestjs-form-data';
import { GetEntityPipe } from '@/api/plant/get-entity.pipe';
import { ValidateContentTypeMiddleware } from '@/middleware/validate-content-type.middleware';
import { PlantCreateRequestDto, PlantUpdateRequestDto } from '@/api/plant/dto';
import { UserRole } from '@/types/user';
import { PlantEquipmentsService } from '@/api/plant-equipments/plant-equipments.service';
import { isNil } from 'lodash';
import { RouteNoDataFoundError } from '@/error/route-no-data-found.error';
import { Plant } from '@/api/plant/plant.entity';

@ApiBearerAuth()
@ApiTags('plants')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/plants')
@UseInterceptors(ClassSerializerInterceptor)
export class PlantController {
  @Inject(PlantService)
  private readonly plantService: PlantService;

  @Inject(PlantEquipmentsService)
  private readonly plantEquipmentsService: PlantEquipmentsService;

  @ApiConsumes('multipart/form-data')
  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(ValidateContentTypeMiddleware)
  @FormDataRequest()
  private async create(@Body() plantCreateDto: PlantCreateRequestDto) {
    return this.plantService.create(plantCreateDto);
  }

  @UsePipes(new GetEntityPipe())
  @Get('/:id')
  private async getById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.plantService.getById(id);
  }

  @UsePipes(new GetEntityPipe())
  @Get('/:id/plant-equipments')
  private async getPlantEquipments(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    if (isNil(await this.plantService.findById(id))) {
      throw new RouteNoDataFoundError(Plant, id);
    }

    return this.plantEquipmentsService.getByPlant(id);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  private async getAll() {
    return this.plantService.findAll();
  }

  @Roles(UserRole.CLIENT)
  @Get('profile-plants')
  private async getProfilePlants(@Request() req) {
    return this.plantService.findAllByUserId(req.user.id);
  }

  @Roles(UserRole.ADMIN)
  @Get('user-plants/:userId')
  private async getUserPlants(
    @Param(
      'userId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId: number,
  ) {
    return await this.plantService.findAllByUserId(userId);
  }

  @UsePipes()
  @Roles(UserRole.ADMIN)
  @Delete('/:id')
  private async deleteById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.plantService.deleteById(id);
  }

  @Patch('/:id')
  @Roles(UserRole.ADMIN)
  private async update(
    @Body() plantUpdateRequestDto: PlantUpdateRequestDto,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.plantService.update(plantUpdateRequestDto, id);
  }
}
