import { UserResponseDto } from '@components/user/dto/response/user.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class Token {
  @ApiProperty({})
  @Expose()
  token: string;

  @ApiProperty({})
  @Expose()
  expiresIn: number;
}

export class LoginSucessfullyResponseDto {
  @ApiProperty({
    type: UserResponseDto,
  })
  @Expose()
  @Type(() => UserResponseDto)
  userInfo: UserResponseDto;

  @ApiProperty({
    type: Token,
  })
  @Expose()
  @Type(() => Token)
  accessToken: Token;

  @ApiProperty({
    type: Token,
  })
  @Expose()
  @Type(() => Token)
  refreshToken: Token;

  @ApiProperty()
  @Expose()
  rememberPassword: number;
}
