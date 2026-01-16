import { BaseDto } from '@core/dto/base.dto';
import { IdParamRequestDto } from '@core/dto/id-param.request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { EnumStatus } from '@utils/common';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsEnum, IsInt } from 'class-validator';

export class UpdateStatusUserRoleSettingRequestDto extends IdParamRequestDto {
  @ApiProperty()
  @IsEnum(EnumStatus)
  status: number;
}
