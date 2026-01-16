import { UserRoleSettingController } from '@components/settings/user-role-setting/user-role-setting.controller';
import { UserRoleSettingService } from '@components/settings/user-role-setting/user-role-setting.service';
import { GroupPermissionSettingEntity } from '@entities/group-permission-setting/group-permission-setting.entity';
import { PermissionSettingEntity } from '@entities/permission-setting/permission-setting.entity';
import { UserRolePermissionSettingEntity } from '@entities/user-role-permission-setting/user-role-permission-setting.entity';
import { UserRoleSetting } from '@entities/user-role-setting/user-role-setting.entity';
import { UserRole } from '@entities/user-role/user-role.entity';
import { User } from '@entities/user/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupPermissionSettingRepository } from '@repositories/group-permission-setting.repository';
import { PermissionSettingRepository } from '@repositories/permission-setting.repository';
import { UserRolePermissionSettingRepository } from '@repositories/user-role-permission-setting.repository';
import { UserRoleSettingRepository } from '@repositories/user-role-setting.repository';
import { UserRoleRepository } from '@repositories/user-role.repository';
import { UserRepository } from '@repositories/user.repository';
import { UserRoleSettingCronService } from './user-role-setting.cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRoleSetting,
      UserRolePermissionSettingEntity,
      UserRole,
      PermissionSettingEntity,
      GroupPermissionSettingEntity,
      User,
    ]),
  ],
  exports: [
    {
      provide: 'UserRoleSettingServiceInterface',
      useClass: UserRoleSettingService,
    },
    {
      provide: 'UserRoleSettingRepositoryInterface',
      useClass: UserRoleSettingRepository,
    },
    {
      provide: 'UserRolePermissionSettingRepositoryInterface',
      useClass: UserRolePermissionSettingRepository,
    },
    {
      provide: 'UserRoleRepositoryInterface',
      useClass: UserRoleRepository,
    },
    {
      provide: 'PermissionSettingRepositoryInterface',
      useClass: PermissionSettingRepository,
    },
    {
      provide: 'GroupPermissionSettingRepositoryInterface',
      useClass: GroupPermissionSettingRepository,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'UserRoleSettingServiceInterface',
      useClass: UserRoleSettingService,
    },
    UserRoleSettingCronService,
  ],
  providers: [
    {
      provide: 'UserRoleSettingServiceInterface',
      useClass: UserRoleSettingService,
    },
    {
      provide: 'UserRoleSettingRepositoryInterface',
      useClass: UserRoleSettingRepository,
    },
    {
      provide: 'UserRolePermissionSettingRepositoryInterface',
      useClass: UserRolePermissionSettingRepository,
    },
    {
      provide: 'UserRoleRepositoryInterface',
      useClass: UserRoleRepository,
    },
    {
      provide: 'PermissionSettingRepositoryInterface',
      useClass: PermissionSettingRepository,
    },
    {
      provide: 'GroupPermissionSettingRepositoryInterface',
      useClass: GroupPermissionSettingRepository,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    UserRoleSettingCronService,
  ],
  controllers: [UserRoleSettingController],
})
export class UserRoleSettingModule {}
