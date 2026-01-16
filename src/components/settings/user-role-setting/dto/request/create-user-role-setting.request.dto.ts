import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FIELD_VALIDATE } from '@utils/constant';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserRoleSettingRequestDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(FIELD_VALIDATE.NAME.MAX_LENGTH)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(FIELD_VALIDATE.NAME.MAX_LENGTH)
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(FIELD_VALIDATE.CODE.MAX_LENGTH)
  code: string;
}
