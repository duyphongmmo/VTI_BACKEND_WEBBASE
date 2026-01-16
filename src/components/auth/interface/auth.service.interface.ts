import { ResponsePayload } from '../../../utils/response-payload';
import { LoginRequestDto } from '../dto/request/login-request.dto';
import { LoginSucessfullyResponseDto } from '../dto/response/login-sucessfully-response.dto';
import { TokenResponseDto } from '../dto/response/token.response.dto';
import { ValidateTokenResponseDto } from '../dto/response/validate-token.response.dto';

export interface AuthServiceInterface {
  login(payload: LoginRequestDto): Promise<ResponsePayload<LoginSucessfullyResponseDto>>;
  validateToken(payload: { jwt: string; token?: string; permissionCode?: string; messageAuthorize?: boolean }): Promise<ResponsePayload<ValidateTokenResponseDto>>;
  refreshToken(payload: { refreshToken?: string; rememberPassword?: number }): Promise<ResponsePayload<LoginSucessfullyResponseDto>>;
  _createToken(id: number, code: string, username: string, type: number): TokenResponseDto;
  _createRefreshToken(id: number, rememberPassword?: number): TokenResponseDto;
}
