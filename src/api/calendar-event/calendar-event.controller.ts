import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { AxiosExceptionFilter } from '@/filter/axios-exception.filter';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '@/api/auth/roles.decorator';
import { UserRole } from '@/types/user';
import { JwtAuthGuard } from '@/api/auth/jwt-auth.guard';
import { RolesGuard } from '@/api/auth/roles.guard';

@ApiTags('Calendar events')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/v1/calendar-events')
export class CalendarEventController {
  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @FormDataRequest()
  @UseFilters(new AxiosExceptionFilter())
  public create() {}
}
