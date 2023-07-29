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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/api/auth/jwt-auth.guard';
import { RolesGuard } from '@/api/auth/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PositionService } from '@/api/position/position.service';
import { PositionCreateRequestDto } from '@/api/position/dto/position-create.request.dto';
import { Roles } from '@/api/auth/roles.decorator';
import { UserRole } from '@/types/user';
import { PositionUpdateRequestDto } from '@/api/position/dto/position-update.request.dto';
import { PositionResponseDto } from '@/api/position/dto/position.response.dto';
import { BaseController } from '@/api/base-entity/base.controller';
import { Position } from '@/api/position/position.entity';

@ApiBearerAuth()
@ApiTags('positions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/positions')
@UseInterceptors(ClassSerializerInterceptor)
export class PositionController extends BaseController<
  Position,
  PositionResponseDto
> {
  constructor(
    @Inject(PositionService)
    private readonly positionService: PositionService,
  ) {
    super(Position, PositionResponseDto);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  private async create(
    @Body() positionCreateRequestDto: PositionCreateRequestDto,
  ): Promise<PositionResponseDto> {
    return this.toResponseDto(
      await this.positionService.create(positionCreateRequestDto),
    );
  }

  @Get('/:id')
  @Roles(UserRole.ADMIN)
  private async getById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.toResponseDto(await this.positionService.getById(id));
  }

  @Delete('/:id')
  @Roles(UserRole.ADMIN)
  private async delete(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.positionService.delete(id);
  }

  @Patch('/:id')
  @Roles(UserRole.ADMIN)
  private async update(
    @Body() positionUpdateRequestDto: PositionUpdateRequestDto,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.toResponseDto(
      await this.positionService.update(id, positionUpdateRequestDto),
    );
  }

  @Get()
  @Roles(UserRole.ADMIN)
  private async getAll() {
    return this.toResponseDto(await this.positionService.getAll());
  }
}
