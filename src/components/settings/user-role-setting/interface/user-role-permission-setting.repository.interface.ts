import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { UserRolePermissionSettingEntity } from '@entities/user-role-permission-setting/user-role-permission-setting.entity';
import { GetPermissionByConditionRequestDto } from '../dto/request/get-permission-by-condition.request.dto';

export interface UserRolePermisisonSettingRepositoryInterface
  extends BaseInterfaceRepository<UserRolePermissionSettingEntity> {
  createEntity(request: any): UserRolePermissionSettingEntity;
  checkUserPermission(condition): Promise<any>;
  getDepartmentRole(): Promise<any>;
  getPermisionsByCondition(
    request: GetPermissionByConditionRequestDto,
  ): Promise<any>;
}
