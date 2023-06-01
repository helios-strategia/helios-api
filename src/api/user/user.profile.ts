import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { User } from '@/api/user/user.entity';
import { UserResponseDto } from '@/api/user/dto/user.response.dto';
import { Plant } from '@/api/plant/plant.entity';
import { PlantResponseDto } from '@/api/plant/dto';
import { PlantStatusHistory } from '@/api/plant-status-history/plant-status-history.entity';
import { PlantStatusHistoryResponseDto } from '@/api/plant-status-history/dto';

@Injectable()
export class UserProfile extends AutomapperProfile {
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, User, UserResponseDto);
      createMap(mapper, Plant, PlantResponseDto);
      createMap(mapper, PlantStatusHistory, PlantStatusHistoryResponseDto);
    };
  }

  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
