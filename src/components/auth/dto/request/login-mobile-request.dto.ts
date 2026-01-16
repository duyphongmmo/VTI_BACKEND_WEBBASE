import {
  IsString,
  IsOptional
} from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoginMobileRequestDto extends BaseDto {
  @ApiProperty({ example: 'example', description: '093482342394823n234982309482343290483204' })
  @IsString()
  @IsOptional()
  azureToken: string;
}
