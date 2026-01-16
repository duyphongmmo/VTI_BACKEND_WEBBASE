import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { UserRole } from '@entities/user-role/user-role.entity';

export interface UserRoleRepositoryInterface
  extends BaseInterfaceRepository<UserRole> {
  getDataUsed(ids: number[]): Promise<any[]>;
}
