import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class DeleteRequestDto extends BaseDto {
  @ApiProperty({ example: 1, description: 'Mã id' })
  @IsNotEmpty()
  @IsInt()
  id: number;
}

export class DetailRequestDto extends BaseDto {
  @ApiProperty({ example: 1, description: 'Mã id' })
  @IsNotEmpty()
  @IsInt()
  id: number;
}

export class GetListDataByCodes extends BaseDto {
  @ArrayNotEmpty()
  @IsArray()
  codes: string[];
}

export class GetListDataByIds extends BaseDto {
  @ArrayNotEmpty()
  @IsArray()
  ids: number[];
}
