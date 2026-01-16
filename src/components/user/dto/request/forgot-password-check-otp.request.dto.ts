import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from '@core/dto/base.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class ForgotPasswordCheckOtpRequestDto extends BaseDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'email' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiPropertyOptional({ example: '123456', description: 'code' })
  @Length(6)
  @IsNotEmpty()
  @IsString()
  code?: string;
}
