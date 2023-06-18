import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  DaysSumByChannelRequestDto,
  DayKvtPerHalfHourByChannelRequestDto,
} from '@/api/ascme/ascme.dto';
import { AscmeService } from '@/api/ascme/ascme.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/api/auth/jwt-auth.guard';
import { RolesGuard } from '@/api/auth/roles.guard';

@ApiBearerAuth()
@ApiTags('ascme')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/ascme')
export class AscmeController {
  @Inject()
  private readonly ascmeService: AscmeService;

  @HttpCode(200)
  @Post('/daysSumByChannel')
  public getDaysSumByChannel(
    @Body() daysSumByChannelRequestDto: DaysSumByChannelRequestDto,
  ) {
    return this.ascmeService.getDaysSumByChannel(daysSumByChannelRequestDto);
  }

  @HttpCode(200)
  @Post('/dayKvtPerHalfHourByChannel')
  public getDayKvtPerHalfHourByChannel(
    @Body()
    dayKvtPerHalfHourByChannelRequest: DayKvtPerHalfHourByChannelRequestDto,
  ) {
    return this.ascmeService.getDayKvtPerHalfHourByChannel(
      dayKvtPerHalfHourByChannelRequest,
    );
  }
}
