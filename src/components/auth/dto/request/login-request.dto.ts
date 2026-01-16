import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { RememberPassword } from '@utils/common';
import { Transform } from 'class-transformer';
import { TypeEnum } from '@components/auth/auth.constant';

export class LoginRequestDto extends BaseDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'snp1234567' })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(RememberPassword)
  rememberPassword: number;

  @ApiProperty()
  @IsEnum(TypeEnum)
  @Transform(({ value }) => Number(value ?? TypeEnum.SYSTEM))
  @IsOptional()
  type: number = TypeEnum.SYSTEM;

  @ApiProperty({ example: 'example@gmail.com', description: 'email' })
  @IsOptional()
  @IsEmail({}, { message: 'Bạn hãy nhập đúng email' })
  email: string;

  @ApiProperty({ example: 'example', description: 'full name' })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  fullName: string;

  @ApiProperty({ example: 'example', description: '093482342394823n234982309482343290483204' })
  @IsString()
  @IsOptional()
  azureToken: string;
}
