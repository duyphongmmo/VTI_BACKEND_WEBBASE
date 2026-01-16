import { UserRoleSettingModule } from '@components/settings/user-role-setting/user-role-setting.module';
import { UserService } from '@components/user/user.service';
import { User } from '@entities/user/user.entity';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@repositories/user.repository';
import { jwtConstants } from '../../constant/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SystemLogRepository } from '@repositories/system-log.repository';
import { SystemLogEntity } from '@entities/user/login-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SystemLogEntity]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'users',
      session: false,
    }),
    JwtModule.register({
      secret: jwtConstants.acessTokenSecret,
    }),
    HttpModule,
    UserModule,
    UserRoleSettingModule
  ],
  providers: [
    {
      provide: 'AuthServiceInterface',
      useClass: AuthService,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'SystemLogRepositoryInterface',
      useClass: SystemLogRepository,
    },
    {
      provide: 'ConfigServiceInterface',
      useClass: ConfigService,
    },
  ],
  controllers: [AuthController],
  exports: [
    JwtModule,
    {
      provide: 'AuthServiceInterface',
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
