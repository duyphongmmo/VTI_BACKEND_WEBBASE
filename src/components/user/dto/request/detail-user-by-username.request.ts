import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DetailUserByUsernameRequestDto extends BaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;
}
