import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserRequestDtoAbstract } from '@components/user/dto/request/user.request.dto.abstract';
import { TypeEnum } from '@components/auth/auth.constant';
import { Transform } from 'class-transformer';

export class CreateUserRequestDto extends UserRequestDtoAbstract {
  @ApiProperty({ example: '123456789', description: 'password' })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  @IsEnum(TypeEnum)
  @Transform(({ value }) => Number(value))
  @IsOptional()
  type: number;
}
