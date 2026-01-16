import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CheckUserPermissionRequestDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  permissionCode: number[];

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
