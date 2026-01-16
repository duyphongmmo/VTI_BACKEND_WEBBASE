import { SuccessResponse } from '@utils/success.response.dto';

import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MetaData {
  @Expose()
  email: string;
}

export class ForgotPasswordResponseDto extends SuccessResponse {
  @ApiProperty({ example: { email: 'example@gmail.com' } })
  @Expose()
  data: MetaData;
}
