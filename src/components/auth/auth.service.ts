import { AuthServiceInterface } from '@components/auth/interface/auth.service.interface';
import { UserRoleSettingServiceInterface } from '@components/settings/user-role-setting/interface/user-role-setting.service.interface';
import { UserRepositoryInterface } from '@components/user/interface/user.repository.interface';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { User, status } from '@entities/user/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ApiError } from '@utils/api.error';
import { RememberPassword } from '@utils/common';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { plainToClass } from 'class-transformer';
import { isEmpty } from 'lodash';
import { I18nService } from 'nestjs-i18n';
import { Equal } from 'typeorm';
import { SUPER_ADMIN, jwtConstants } from '../../constant/common';
import { TypeEnum } from './auth.constant';
import { TokenResponseDto } from './dto/response/token.response.dto';
import { FinalCheckUserPermissionRequestDto } from './dto/request/final-check-user-permission.request.dto';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { LoginSucessfullyResponseDto } from './dto/response/login-sucessfully-response.dto';
import { SystemLogRepositoryInterface } from '@components/user/interface/system-log.repository.interface';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,

    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,

    @Inject('UserRoleSettingServiceInterface')
    private readonly userRoleSettingService: UserRoleSettingServiceInterface,

    @Inject('SystemLogRepositoryInterface')
    private readonly systemLogRepository: SystemLogRepositoryInterface,

    private readonly jwtService: JwtService,

    private readonly i18n: I18nService,

    @Inject('ConfigServiceInterface')
    private readonly configService: ConfigService,

    @Inject(REQUEST) private request: any,
  ) {}

  /**
   *
   * @param payload
   * @returns
   */
  async validateToken(payload: any): Promise<any> {
    const { permissionCode, jwt, messageAuthorize } = payload;

    try {
      this.jwtService.verify(jwt);
      const jwtDecode: any = this.jwtService.decode(jwt);

      if (jwtDecode?.type == TypeEnum.MOBILE) {
        if (!jwtDecode?.code) {
          return new ApiError(
            ResponseCodeEnum.NOT_ACCEPTABLE,
            await this.i18n.translate(`error.NOT_ACCEPTABLE`),
          ).toResponse();
        }
        return new ResponseBuilder({ type: TypeEnum.MOBILE, info: {} })
          .withCode(ResponseCodeEnum.SUCCESS)
          .build();
      }
      const userData = await this.userRepository.findOneById(jwtDecode?.id);

      if (isEmpty(userData)) {
        return new ApiError(ResponseCodeEnum.UNAUTHORIZED).toResponse();
      }

      if (this.isSuperAdmin(userData)) {
        return new ResponseBuilder({ type: jwtDecode?.type, info: userData })
          .withCode(ResponseCodeEnum.SUCCESS)
          .build();
      }

      const userId = jwtDecode?.id;
      if (permissionCode && !this.isSuperAdmin(userData)) {
        const checkPermissionCondition =
          new FinalCheckUserPermissionRequestDto();
        checkPermissionCondition.userId = userId;
        checkPermissionCondition.permissionCode = permissionCode;

        const response =
          await this.userRoleSettingService.finalCheckUserPermission(
            checkPermissionCondition,
          );
        if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
          const ERROR_KEY = messageAuthorize || 'NOT_ACCEPTABLE';
          return new ApiError(
            ResponseCodeEnum.NOT_ACCEPTABLE,
            await this.i18n.translate(`error.${ERROR_KEY}`),
          ).toResponse();
        }
      }

      return new ResponseBuilder({ type: jwtDecode?.type, info: userData })
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    } catch (error) {
      if (error.constructor.name === 'TokenExpiredError') {
        return new ApiError(
          ResponseCodeEnum.TOKEN_EXPIRED,
          error.message,
        ).toResponse();
      }
      return new ApiError(
        ResponseCodeEnum.UNAUTHORIZED,
        error.message,
      ).toResponse();
    }
  }

  async refreshToken(payload: {
    refreshToken?: string;
    rememberPassword?: number;
  }): Promise<ResponsePayload<LoginSucessfullyResponseDto>> {
    const jwt = this.request.headers['authorization']?.split(' ')[1];

    try {
      this.jwtService.verify(jwt);

      const jwtDecode: any = this.jwtService.decode(jwt);

      const user = await this.userRepository.findOneById(jwtDecode.id);
      if (isEmpty(user)) {
        return new ApiError(ResponseCodeEnum.UNAUTHORIZED).toResponse() as any;
      }

      const accessToken = this._createToken(
        user.id,
        user.code,
        user.username,
        0,
      );

      const refreshToken = this._createRefreshToken(
        user.id,
        payload.rememberPassword,
      );

      const userData = await this.userService.getDetail(user.id);
      const response = plainToClass(
        LoginSucessfullyResponseDto,
        {
          userInfo: userData,
          accessToken: accessToken,
          refreshToken: refreshToken,
          rememberPassword: payload.rememberPassword,
        },
        {
          excludeExtraneousValues: true,
        },
      );
      return new ResponseBuilder(response)
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    } catch (error) {
      if (error.constructor.name === 'TokenExpiredError') {
        return new ApiError(
          ResponseCodeEnum.TOKEN_EXPIRED,
          error.message,
        ).toResponse();
      }
      return new ApiError(
        ResponseCodeEnum.UNAUTHORIZED,
        error.message,
      ).toResponse();
    }
  }

  public async login(
    payload: LoginRequestDto,
  ): Promise<ResponsePayload<LoginSucessfullyResponseDto>> {
    const { username, password, rememberPassword, type } = payload;
    let user: any;
    if (type === TypeEnum.SYSTEM)
      user = await this.userRepository.validateUser(username, password);
    else if (type === TypeEnum.AZURE) {
      const info = await this.jwtService.decode(payload.azureToken);
      user = await this.userRepository.findOneByCondition({
        email: Equal(info['preferred_username']),
      });
      if (isEmpty(user)) {
        console.log('___User azure is not logged.', info);
        console.log('___User azure is not logged. Token info: ', info);
        return new ApiError(
          ResponseCodeEnum.UNAUTHORIZED,
          await this.i18n.translate('error.USER_AZURE_UNAUTHORIZE'),
        ).toResponse();
      }
    } else if (type === TypeEnum.MOBILE) {
      let pro = null;
      if (!isEmpty(payload.username) && !isEmpty(payload.password)) {
        user = await this.userRepository.validateUser(username, password);
        if (isEmpty(user)) {
          return new ApiError(
            ResponseCodeEnum.UNAUTHORIZED,
            await this.i18n.translate('error.WRONG_USERNAME_PASSWORD'),
          ).toResponse();
        }

        pro = null;
      } else {
        const info = await this.jwtService.decode(payload.azureToken);
        if (info && info['preferred_username']) {
          pro = null;
        } else {
          this.systemLogRepository.createLog(
            'Login failed',
            'Token info: ' + payload.azureToken,
          );
          return new ApiError(
            ResponseCodeEnum.UNAUTHORIZED,
            await this.i18n.translate('error.USER_AZURE_UNAUTHORIZE'),
          ).toResponse();
        }
      }
      if (isEmpty(pro)) {
        this.systemLogRepository.createLog(
          'Login failed',
          !isEmpty(payload.username) && !isEmpty(payload.password)
            ? 'Username: ' + payload.username
            : 'Token info: ' + payload.azureToken,
        );
        return new ApiError(
          ResponseCodeEnum.UNAUTHORIZED,
          await this.i18n.translate('error.USER_AZURE_UNAUTHORIZE'),
        ).toResponse();
      }

      console.log('___User mobile is logged.', pro);
      const accessToken = this._createToken(0, pro.code, pro.emailLogin, type);
      const refreshToken = this._createRefreshToken(0, rememberPassword);

      const response = plainToClass(
        LoginSucessfullyResponseDto,
        {
          userInfo: pro,
          accessToken: accessToken,
          refreshToken: refreshToken,
          rememberPassword: rememberPassword,
        },
        {
          excludeExtraneousValues: true,
        },
      );
      return new ResponseBuilder(response)
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    } else {
      return new ApiError(
        ResponseCodeEnum.UNAUTHORIZED,
        await this.i18n.translate('statusMessage.INTERNAL_SERVER_ERROR'),
      ).toResponse();
    }

    if (!user) {
      return new ApiError(
        ResponseCodeEnum.UNAUTHORIZED,
        await this.i18n.translate('error.WRONG_USERNAME_PASSWORD'),
      ).toResponse();
    }
    const accessToken = this._createToken(
      user.id,
      user.code,
      user.username,
      type,
    );

    const refreshToken = this._createRefreshToken(user.id, rememberPassword);
    const userData = await this.userService.getDetail(user.id, false);
    if (isEmpty(userData.data.userPermissions)) {
      return new ApiError(
        ResponseCodeEnum.UNAUTHORIZED,
        await this.i18n.translate('error.USER_UNAUTHORIZE'),
      ).toResponse();
    }
    if (userData.data.status !== status.ACTIVE) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_INACTIVE'),
      ).toResponse();
    }
    const response = plainToClass(
      LoginSucessfullyResponseDto,
      {
        userInfo: userData,
        accessToken: accessToken,
        refreshToken: refreshToken,
        rememberPassword: rememberPassword,
      },
      {
        excludeExtraneousValues: true,
      },
    );
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  _createToken(
    id: number,
    code: string,
    username: string,
    type: number,
  ): TokenResponseDto {
    const expiresIn = jwtConstants.acessTokenExpiresIn || 60;

    const token = this.jwtService.sign(
      {
        id: id,
        code: code,
        username: username,
        type,
      },
      {
        expiresIn: `${expiresIn}s`,
      },
    );
    return {
      expiresIn: `${expiresIn}s`,
      token,
    };
  }

  _createRefreshToken(id: number, rememberPassword?: number): TokenResponseDto {
    let expiresIn = jwtConstants.refeshTokenExpiresIn || 60;
    if (rememberPassword && rememberPassword === RememberPassword.active) {
      expiresIn = jwtConstants.refeshTokenExpiresMaxIn || 432000;
    }

    const token = this.jwtService.sign(
      {
        id: id,
      },
      {
        expiresIn: `${expiresIn}s`,
      },
    );
    return {
      expiresIn: `${expiresIn}s`,
      token,
    };
  }

  private isSuperAdmin(user: User): boolean {
    return user.code === SUPER_ADMIN.code;
  }
}
