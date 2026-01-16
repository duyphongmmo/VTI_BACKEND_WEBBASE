import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ResponseCodeEnum } from '@constant/response-code.enum';

export class ValidateTokenResponseDto {
  @ApiProperty()
  @Expose()
  statusCode?: ResponseCodeEnum;

  @ApiProperty()
  @Expose()
  message?: string;

  @ApiProperty()
  @Expose()
  type?: number;

  @ApiProperty()
  @Expose()
  info?: any;

  @ApiProperty()
  @Expose()
  data?: any;
}
