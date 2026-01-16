import { TypeEnum } from '@components/mail/mail.constant';
import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class SendMailDetail {
  @ApiProperty({ example: 'example1@gmail.com;example2@gmail.com' })
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => Number(value))
  id: number;
}

export class SendMailRequestDto extends BaseDto {
  @ApiProperty()
  @IsOptional()
  subject: string;

  @ApiProperty({ example: 'example1@gmail.com;example2@gmail.com' })
  @IsOptional()
  cc: string;

  @ApiProperty({ example: 'example1@gmail.com;example2@gmail.com' })
  @IsOptional()
  bcc: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => SendMailDetail)
  @ValidateNested({ each: true })
  detail: SendMailDetail[];

  @ApiProperty()
  @IsEnum(TypeEnum)
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  type: number;
}

export class SendMailForgotPassword extends BaseDto {
  @ApiProperty()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsOptional()
  body: any;
}
