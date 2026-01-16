import { BaseDto } from '@core/dto/base.dto';
import { IsOptional } from 'class-validator';

export class GetUsersByRoleCodesRequestDto extends BaseDto {
  @IsOptional()
  roleCode?: string[];
}
