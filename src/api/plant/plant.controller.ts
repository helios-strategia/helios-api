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
  Request,
  UseFilters,
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
import { ValidateContentTypeMiddleware } from '@/library/middleware/validate-content-type.middleware';
import { PlantCreateRequestDto, PlantUpdateRequestDto } from '@/api/plant/dto';
import { UserRole } from '@/types/user';
import { PlantEquipmentsService } from '@/api/plant-equipments/plant-equipments.service';
import { isNil } from 'lodash';
import { RouteNoDataFoundError } from '@/error/route-no-data-found.error';
import { Plant } from '@/api/plant/plant.entity';
import { PlantImagesCreateRequestDto } from '@/api/plant-images/dto/plant-images-create.request.dto';
import { PlantImagesService } from '@/api/plant-images/plant-images.service';
import { PlantImage } from '@/api/plant-images/plant-images.entity';
import { GenerationTariffCreateRequestDto } from '@/api/generation-tariff/dto/generation-tariff-create.request.dto';
import { GenerationTariffService } from '@/api/generation-tariff/generation-tariff.service';
import { GenerationTariffUpdateRequestDto } from '@/api/generation-tariff/dto/generation-tariff-update.request.dto';
import { QueryFailedErrorFilter } from '@/filter/query-failed-error.filter';

@ApiBearerAuth()
@ApiTags('plants')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/v1/plants')
@UseInterceptors(ClassSerializerInterceptor)
export class PlantController {
  @Inject(PlantService)
  private readonly plantService: PlantService;

  @Inject(PlantEquipmentsService)
  private readonly plantEquipmentsService: PlantEquipmentsService;

  @Inject(PlantImagesService)
  private readonly plantImageService: PlantImagesService;

  @Inject(GenerationTariffService)
  private readonly generationTariffService: GenerationTariffService;

  @ApiConsumes('multipart/form-data')
  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(ValidateContentTypeMiddleware)
  @FormDataRequest()
  private async create(@Body() plantCreateDto: PlantCreateRequestDto) {
    return this.plantService.create(plantCreateDto);
  }

  @Get('/:id')
  private async getById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.plantService.findByIdOrElseThrowValidationError(id);
  }

  @Get('/:id/plant-equipments')
  private async getPlantEquipments(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    if (isNil(await this.plantService.findByIdOrElseThrowNotFoundError(id))) {
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

  @ApiConsumes('multipart/form-data')
  @Roles(UserRole.ADMIN)
  @Post('/:id/plant-images')
  @UseInterceptors(ValidateContentTypeMiddleware)
  @FormDataRequest()
  public async uploadPlantImage(
    @Body() plantImagesCreateRequestDto: PlantImagesCreateRequestDto,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    const plant = await this.plantService.findByIdOrElseThrowNotFoundError(id);

    if (isNil(plant)) {
      throw new RouteNoDataFoundError(Plant, id);
    }

    return this.plantImageService.uploadAndCreate(
      plantImagesCreateRequestDto.image,
      plant,
    );
  }

  @Get('/:id/plant-images/:plant_image_id')
  public async getPlantImageById(
    @Param(
      'plant_image_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    plantImageId: number,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    const [_, plantImage] = await Promise.all([
      this.plantService.findByIdOrElseThrowValidationError(id),
      this.plantImageService.findById(plantImageId),
    ]);

    if (isNil(plantImage)) {
      throw new RouteNoDataFoundError(PlantImage, id);
    }

    return this.plantImageService.findById(plantImageId);
  }

  @Roles(UserRole.ADMIN)
  @Delete('/:id/plant-images/:plant_image_id')
  public async deletePlantImage(
    @Param(
      'plant_image_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    plantImageId: number,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    const [_, plantImage] = await Promise.all([
      this.plantService.findByIdOrElseThrowValidationError(id),
      this.plantImageService.findById(plantImageId),
    ]);

    if (isNil(plantImage)) {
      throw new RouteNoDataFoundError(PlantImage, plantImageId);
    }

    return this.plantImageService.delete(plantImageId);
  }

  @Roles(UserRole.ADMIN)
  @Post('/:id/generation-tariffs')
  public async createGenerationTariff(
    @Body() generationTariffCreateRequestDto: GenerationTariffCreateRequestDto,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.generationTariffService.create(
      generationTariffCreateRequestDto,
      id,
    );
  }

  @Roles(UserRole.ADMIN)
  @Delete('/:id/generation-tariffs/:generation_tariff_id')
  public async deleteGenerationTariff(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Param(
      'generation_tariff_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    generationTariffId: number,
  ) {
    return this.generationTariffService.delete(generationTariffId, id);
  }

  @Roles(UserRole.ADMIN)
  @Patch('/:id/generation-tariffs/:generation_tariff_id')
  public async updateGenerationTariff(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    plantId: number,
    @Param(
      'generation_tariff_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    generationTariffId: number,
    @Body() generationTariffUpdateRequestDto: GenerationTariffUpdateRequestDto,
  ) {
    return this.generationTariffService.update({
      generationTariffId,
      plantId,
      generationTariffUpdateRequestDto,
    });
  }

  @Get('/:id/generation-tariffs')
  public async getGenerationTariffs(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.generationTariffService.getAllByPlant(id);
  }
}
