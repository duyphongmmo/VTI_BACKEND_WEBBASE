import { TypeEnum } from '@components/auth/auth.constant';
import { AuthServiceInterface } from '@components/auth/interface/auth.service.interface';
import { ConfigService } from '@config/config.service';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { PERMISSION_CODE } from '@core/decorator/get-code.decorator';
import { MESSAGE_KEY } from '@core/decorator/set-authorize-message';
import { IS_PUBLIC_KEY } from '@core/decorator/set-public.decorator';
import { AuthorizedRequest } from '@core/dto/authorized.request.dto';
import { status } from '@entities/user/user.entity';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE } from '@utils/constant';
import { isEmpty } from 'lodash';
import { I18nService } from 'nestjs-i18n';

@Injectable({ scope: Scope.REQUEST })
export class AuthorizationGuard implements CanActivate {
  private readonly configService: ConfigService;

  constructor(
    private reflector: Reflector,
    @Inject('AuthServiceInterface')
    private readonly authService: AuthServiceInterface,

    private readonly i18n: I18nService,
  ) {
    this.configService = new ConfigService();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const messageAuthorize = await this.reflector.getAllAndOverride<boolean>(
      MESSAGE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }
    const req = await context.switchToHttp().getRequest();
    req.lang = req.headers?.lang;
    const token =
      context.getType() === 'rpc'
        ? `Bearer ${this.configService.get('internalToken')}`
        : req.headers['authorization'];

    if (
      req.headers?.['authorization'] ===
      `Bearer ${this.configService.get('internalToken')}`
    ) {
      if (req.body) {
        req.body.user = { role: ROLE.ADMIN };
      }
      if (req.params) {
        req.params.user = { role: ROLE.ADMIN };
      }
      if (req.query) {
        req.query.user = { role: ROLE.ADMIN };
      }
      req.authorized = new AuthorizedRequest();
      req.authorized.isAdmin = true;
      return true;
    }
    const permissionCode = this.reflector.getAllAndOverride<string>(
      PERMISSION_CODE,
      [context.getHandler(), context.getClass()],
    );
    const res = await this.authService.validateToken({
      token,
      permissionCode,
      jwt: token?.split(' ')[1],
      messageAuthorize,
    });

    if (res.statusCode !== 200) {
      throw new HttpException(res.message, res.statusCode);
    }

    const data =  res.data;
    // mobile
    if (data.type == TypeEnum.MOBILE) {
      const pro = res.data.info;
      if (res) {
        if (pro && !isEmpty(pro)) req.user = pro;
        if (req.body && pro && !isEmpty(pro)) {
          req.body.pro = pro;
          req.body.code = pro?.code;
        }
        if (req.params && pro && !isEmpty(pro)) {
          req.params.pro = pro;
          req.params.code = pro?.code;
        }
        if (req.query && pro && !isEmpty(pro)) {
          req.query.pro = pro;
          req.query.code = pro?.code;
        }
        return true;
      }
    }

    // else
    const user = res.data.info;
    if (user && user.status !== status.ACTIVE) {
      throw new HttpException(
        await this.i18n.translate(`error.USER_INACTIVE`),
        ResponseCodeEnum.BAD_REQUEST,
      );
    }
    if (res) {
      if (user && !isEmpty(user)) req.user = user;
      if (req.body && user && !isEmpty(user)) {
        req.body.user = user;
        req.body.userId = user?.id;
      }
      if (req.params && user && !isEmpty(user)) {
        req.params.user = user;
        req.params.userId = user?.id;
      }
      if (req.query && user && !isEmpty(user)) {
        req.query.user = user;
        req.query.userId = user?.id;
      }
      req.authorized = user?.authorized;
      return true;
    }

    return false;
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
