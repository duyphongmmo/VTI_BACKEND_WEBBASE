import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { BaseDto } from './base.dto';

export class IdParamRequestDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => Number(value))
  id: number;
}
