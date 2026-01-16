import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { EnumStatus } from '@utils/common';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsEnum,
  IsInt,
  IsString,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';

class Permission {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(() => EnumStatus)
  status: EnumStatus;
}

export class UpdateUserRolePermissionRequestDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  roleId: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  departmentId: number;

  @ApiProperty()
  @ArrayNotEmpty()
  @IsArray()
  @Type(() => Permission)
  permissions: Permission[];
}
