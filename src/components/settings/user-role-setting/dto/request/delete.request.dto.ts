import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteRequestDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
