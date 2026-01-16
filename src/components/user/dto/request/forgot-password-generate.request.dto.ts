import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from '@core/dto/base.dto';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class ForgotPasswordGenerateRequestDto extends BaseDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'email' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiPropertyOptional({ example: '123456', description: 'code' })
  code?: string;

  @ApiPropertyOptional({ example: '123456789', description: 'password' })
  password?: string;
}
