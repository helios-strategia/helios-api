import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/api/auth/jwt-auth.guard';
import { RolesGuard } from '@/api/auth/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlantEquipmentsService } from '@/api/plant-equipments/plant-equipments.service';

@ApiBearerAuth()
@ApiTags('plants')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/plant-equipments')
@UseInterceptors(ClassSerializerInterceptor)
export class PlantEquipmentsController {
  @Inject(PlantEquipmentsService)
  private readonly plantEquipmentsService: PlantEquipmentsService;
}
