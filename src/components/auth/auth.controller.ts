import { Public } from '@core/decorator/set-public.decorator';
import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { isEmpty } from 'lodash';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { LoginSucessfullyResponseDto } from './dto/response/login-sucessfully-response.dto';
import { AuthServiceInterface } from './interface/auth.service.interface';
import { LoginMobileRequestDto } from './dto/request/login-mobile-request.dto';
import { TypeEnum } from './auth.constant';
import { ValidateTokenResponseDto } from './dto/response/validate-token.response.dto';
import { ResponsePayload } from '@utils/response-payload';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AuthServiceInterface')
    private readonly authService: AuthServiceInterface,
  ) {}

  @Public()
  @Post('/login')
  @ApiOperation({
    tags: ['Auth', 'Login'],
    summary: 'Login',
    description: 'Đăng nhập',
  })
  @ApiResponse({
    status: 200,
    description: 'Create successfully',
    type: LoginSucessfullyResponseDto,
  })
  public async getItems(@Body() payload: LoginRequestDto): Promise<ResponsePayload<LoginSucessfullyResponseDto>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.authService.login(request);
  }

  @Public()
  @Post('/login-mobile')
  @ApiOperation({
    tags: ['Auth', 'Login'],
    summary: 'Login',
    description: 'Đăng nhập',
  })
  @ApiResponse({
    status: 200,
    description: 'Create successfully',
    type: LoginSucessfullyResponseDto,
  })
  public async loginMobile(@Body() payload: LoginMobileRequestDto): Promise<ResponsePayload<LoginSucessfullyResponseDto>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.type = TypeEnum.MOBILE;
    return await this.authService.login(request);
  }

  public async validateToken(@Body() payload: { token: string }): Promise<ResponsePayload<ValidateTokenResponseDto>> {
    return await this.authService.validateToken({
      ...payload,
      jwt: payload?.token?.split(' ')[1],
    });
  }

  @Public()
  @Get('/token/refresh')
  public async refreshToken(@Param() payload: { refreshToken: string }): Promise<ResponsePayload<LoginSucessfullyResponseDto>> {
    return await this.authService.refreshToken(payload);
  }
}
