import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { GroupPermissionSettingEntity } from '@entities/group-permission-setting/group-permission-setting.entity';
import { GroupPermissionByRoleIdRequestDto } from '../dto/request/group-permission-by-role-id.request.dto';

export interface GroupPermissionSettingRepositoryInterface
  extends BaseInterfaceRepository<GroupPermissionSettingEntity> {
  groupPermissionByRoleId(
    request: GroupPermissionByRoleIdRequestDto,
  ): Promise<any>;
}
