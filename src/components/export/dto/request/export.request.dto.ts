import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { ExportTypeEnum } from '../../export.constant';
import { BaseDto } from '@core/dto/base.dto';

export class ExportRequestDto extends BaseDto {
  @ApiProperty({
    description: 'Export type',
    enum: ExportTypeEnum,
    example: ExportTypeEnum.DASHBOARD,
  })
  @IsEnum(ExportTypeEnum)
  @Transform(({ value }) => Number(value))
  type: number;
}
