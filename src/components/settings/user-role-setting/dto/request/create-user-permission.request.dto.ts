import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
export class CreateUserPermissionSetting {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  departmentId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userRoleId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
export class CreateUserPermissionRequestDto extends BaseDto {
  @ApiProperty({ type: CreateUserPermissionSetting, isArray: true })
  @IsArray()
  @Type(() => CreateUserPermissionSetting)
  permissionSettings: CreateUserPermissionSetting[];
}
