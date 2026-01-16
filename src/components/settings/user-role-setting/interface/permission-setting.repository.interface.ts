import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { PermissionSettingEntity } from '@entities/permission-setting/permission-setting.entity';

export interface PermissionSettingRepositoryInterface
  extends BaseInterfaceRepository<PermissionSettingEntity> {
  getPermissionsByIds(groupPermissionId: number): Promise<any>;
  deletePermissionNotActive(): Promise<any>;
}
