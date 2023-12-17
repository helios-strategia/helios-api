import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UserService } from './user.service';
import { FormDataRequest } from 'nestjs-form-data';
import { JwtAuthGuard } from '@/api/auth/jwt-auth.guard';
import { Roles } from '@/api/auth/roles.decorator';
import { RolesGuard } from '@/api/auth/roles.guard';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { FileService } from '@/library/file-serivce/file-service';
import { ValidateContentTypeMiddleware } from '@/library/middleware/validate-content-type.middleware';
import { UserResponseDto } from './dto/user.response.dto';
import { UserCreateRequestDto } from './dto/user-create.request.dto';
import { UserUpdateRequestDto } from './dto/user-update.request.dto';
import { UserRole } from '@/types/user';

@ApiBearerAuth()
@ApiTags('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/v1/users')
export class UserController {
  @Inject(UserService)
  private readonly service: UserService;
  @Inject(FileService)
  private readonly fileService: FileService;

  @ApiExtraModels(UserResponseDto)
  @ApiResponse({
    status: 201,
    schema: {
      $ref: getSchemaPath(UserResponseDto),
    },
  })
  @ApiConsumes('multipart/form-data')
  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(ValidateContentTypeMiddleware)
  @FormDataRequest()
  public async create(
    @Body() userCreateDto: UserCreateRequestDto,
  ): Promise<UserResponseDto> {
    const userByEmail = await this.service.findByEmail(userCreateDto.email);

    if (userByEmail) {
      throw new BadRequestException('user by this email already exists');
    }

    return this.service.create(userCreateDto);
  }

  @Get('profile')
  public profile(@Request() req) {
    return this.service.findByEmail(req.user.email);
  }

  @ApiExtraModels(UserResponseDto)
  @ApiResponse({
    isArray: true,
    status: 200,
    schema: {
      $ref: getSchemaPath(UserResponseDto),
    },
  })
  @Get()
  @Roles(UserRole.ADMIN)
  public getAll(): Promise<UserResponseDto[]> {
    return this.service.getAll();
  }

  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(ValidateContentTypeMiddleware)
  @FormDataRequest()
  private async update(
    @Param() { id }: { id: number },
    @Body() update: UserUpdateRequestDto,
  ): Promise<UserResponseDto> {
    return this.service.update(id, update);
  }

  @ApiConsumes('multipart/form-data')
  @Patch('updateProfile/:id')
  @UseInterceptors(ValidateContentTypeMiddleware)
  @FormDataRequest()
  public async updateProfile(
    @Param() { id }: { id: number },
    @Body() update: UserUpdateRequestDto,
    @Req() req,
  ): Promise<UserResponseDto> {
    if (!(await this.service.isPresentById(id))) {
      throw new NotFoundException('user not found');
    }

    if (req.user.id !== id) {
      throw new ForbiddenException('cannot update not own profile');
    }

    return this.service.update(id, update);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  public async delete(@Param() params) {
    if (!(await this.service.isPresentById(params.id))) {
      throw new NotFoundException('user not found');
    }

    return this.service
      .deleteById(params.id)
      .then((count) => ({ deleteCount: count }));
  }

  @Roles(UserRole.ADMIN)
  @Get('clients')
  public async getAllClients() {
    return this.service.getAllClients();
  }
}
