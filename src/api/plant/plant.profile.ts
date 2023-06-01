import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Plant } from '@/api/plant/plant.entity';
import { createMap, Mapper } from '@automapper/core';
import { PlantResponseDto } from '@/api/plant/dto/plant.response.dto';
import { User } from '@/api/user/user.entity';
import { UserResponseDto } from '@/api/user/dto/user.response.dto';
import { PlantStatusHistory } from '@/api/plant-status-history/plant-status-history.entity';
import { PlantStatusHistoryResponseDto } from '@/api/plant-status-history/dto';

@Injectable()
export class PlantProfile extends AutomapperProfile {
  override get profile() {
    return (mapper) => {
      createMap(mapper, Plant, PlantResponseDto);
      createMap(mapper, User, UserResponseDto);
      createMap(mapper, PlantStatusHistory, PlantStatusHistoryResponseDto);
    };
  }

  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
