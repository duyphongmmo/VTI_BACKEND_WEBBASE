import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray } from 'class-validator';

export class GetListByIds extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  permissions: number[];
}
