import { BaseEntityResponseDto } from "@/api/base-entity/base-entity.response.dto";
import { AutoMap } from "@automapper/classes";


export abstract class BaseImageResponseDto extends BaseEntityResponseDto {
  @AutoMap()
  public readonly url: string;

  @AutoMap()
  public readonly name: string;
}