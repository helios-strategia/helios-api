import {
  BadRequestException,
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
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PlantDocumentService } from '@/api/plant-document/plant-document.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/api/auth/jwt-auth.guard';
import { RolesGuard } from '@/api/auth/roles.guard';
import { Roles } from '@/api/auth/roles.decorator';
import { FormDataRequest } from 'nestjs-form-data';
import { PlantDocumentCreateRequestDto } from '@/api/plant-document/plant-document-create.request.dto';
import { PlantService } from '@/api/plant/plant.service';
import { UserRole } from '@/types/user';
import { ValidateContentTypeMiddleware } from '@/library/middleware/validate-content-type.middleware';

@ApiBearerAuth()
@ApiTags('Plant documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/api/v1/plant-documents')
@UseInterceptors(ClassSerializerInterceptor)
export class PlantDocumentController {
  @Inject(PlantDocumentService)
  private readonly plantDocumentService: PlantDocumentService;
  @Inject(PlantService)
  private readonly plantService: PlantService;

  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(ValidateContentTypeMiddleware)
  @FormDataRequest()
  private async create(
    @Body() documentCreateRequestDto: PlantDocumentCreateRequestDto,
  ) {
    if (
      !(await this.plantService.isPresent(documentCreateRequestDto.plantId))
    ) {
      throw new BadRequestException("plant doesn't exists");
    }

    return this.plantDocumentService.create(documentCreateRequestDto, true);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  private async getAll() {
    return this.plantDocumentService.getAll();
  }

  @Delete('/:id')
  @Roles(UserRole.ADMIN)
  private async deleteById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    if (!(await this.plantDocumentService.isPresent(id))) {
      throw new NotFoundException('plant-document not found');
    }

    return this.plantDocumentService.deleteById(id);
  }
}
