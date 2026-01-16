import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { Transform } from 'class-transformer';

export class SetStatusRequestDto extends BaseDto {
  @ApiProperty({ example: 1, description: 'id' })
  @Transform((obj) => Number(obj.value))
  @IsNotEmpty()
  @IsInt()
  id: number;
}
