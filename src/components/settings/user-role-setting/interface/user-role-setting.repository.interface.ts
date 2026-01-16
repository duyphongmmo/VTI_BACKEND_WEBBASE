import { UpdateUserRoleSettingRequestDto } from './../dto/request/update-user-role-setting.request';
import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { UserRoleSetting } from '@entities/user-role-setting/user-role-setting.entity';
import { GetListUserRoleSettingRequestDto } from '../dto/request/get-list-user-role-setting.request.dto';

export interface UserRoleSettingRepositoryInterface
  extends BaseInterfaceRepository<UserRoleSetting> {
  getList(request: GetListUserRoleSettingRequestDto): Promise<any>;
  updateEntity(
    userRoleEntity: UserRoleSetting,
    request: UpdateUserRoleSettingRequestDto,
  ): UserRoleSetting;
  getUserRoleSettingByIds(ids: number[]): Promise<any>;
}
