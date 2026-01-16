import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { UserRolePermissionSettingEntity } from '@entities/user-role-permission-setting/user-role-permission-setting.entity';

export type PermissionSettingReporitoryInterface =
  BaseInterfaceRepository<UserRolePermissionSettingEntity>;
