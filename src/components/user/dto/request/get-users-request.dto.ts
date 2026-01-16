import { BaseDto } from '@core/dto/base.dto';
import { ArrayNotEmpty } from 'class-validator';

export class GetUsersRequestDto extends BaseDto {
  @ArrayNotEmpty()
  userIds: number[];
}
