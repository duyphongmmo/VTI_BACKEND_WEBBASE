import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class GetDetailRequestDto extends BaseDto {
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsInt()
  id: number;

  @ApiProperty()
  @IsString()
  shiftType: string;
}
