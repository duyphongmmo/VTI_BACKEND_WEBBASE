import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordMeRequestDto extends BaseDto {
  @ApiProperty({ example: '123456789', description: 'password' })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password: string;

  @ApiProperty({ example: '123123', description: 'old password' })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  oldPassword: string;
}
