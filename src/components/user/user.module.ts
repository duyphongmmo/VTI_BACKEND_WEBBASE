import { User } from '@entities/user/user.entity';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRoleSettingModule } from '@components/settings/user-role-setting/user-role-setting.module';
import { MailModule } from '@components/mail/mail.module';
import { UserRoleSetting } from '@entities/user-role-setting/user-role-setting.entity';
import { UserRepository } from '@repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    TypeOrmModule.forFeature([
      User,
      UserRoleSetting,
    ]),
    UserRoleSettingModule,
    MailModule,
  ],
  providers: [
    ConfigService,
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
  ],
  controllers: [UserController],
  exports: [
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
