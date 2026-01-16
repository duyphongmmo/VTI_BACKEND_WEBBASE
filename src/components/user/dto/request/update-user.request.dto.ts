import { ApiProperty } from '@nestjs/swagger';
import { UserRequestDtoAbstract } from '@components/user/dto/request/user.request.dto.abstract';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
export class UpdateUserBodyDto extends UserRequestDtoAbstract {
  @ApiProperty({ example: '0789-789-7890', description: 'phone' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone: string;
}
export class UpdateUserRequestDto extends UserRequestDtoAbstract {
  @ApiProperty({ example: 'id', description: '' })
  @IsNotEmpty()
  @Transform((obj) => Number(obj.value))
  @IsInt()
  id: number;
}
