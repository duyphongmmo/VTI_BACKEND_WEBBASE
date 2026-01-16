import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PermissionForListRequestDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userRoleId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  permissionId: number;
}
