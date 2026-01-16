import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from '@core/dto/base.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class ForgotPasswordResetPasswordRequestDto extends BaseDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'email' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiPropertyOptional({ example: '123456789', description: 'password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  password?: string;

  @ApiProperty({ example: '465719', description: 'otp code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(6)
  code: string;
}
