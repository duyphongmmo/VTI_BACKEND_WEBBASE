import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';

export class ChangeStatusUserRoleMultiDto extends BaseDto {
  @ApiProperty()
  @IsArray()
  @Type(() => Number)
  ids?: number[];
}
