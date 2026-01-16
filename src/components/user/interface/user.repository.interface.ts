import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { UserRole } from '@entities/user-role/user-role.entity';
import { User } from '@entities/user/user.entity';

export interface UserRepositoryInterface extends BaseInterfaceRepository<User> {
  checkUniqueUser(condition: any): Promise<any>;
  validateUser(username: string, password: string): Promise<any>;
  getListUser(request, arrWarehouseIdFilter?): Promise<any>;
  createEntity(userData: any): Promise<User>;
  getDetail(id: number, withoutExtraInfo?: boolean): Promise<any>;
  delete(id: number): Promise<any>;
  isSuperAdmin(code: string): boolean;
  getUserNotInRoleCodes(roleCodes: string[]): Promise<any>;
  getCount(): Promise<any>;
  getUsersByCondition(condition: string): Promise<any[]>;
  findUsersByNameKeyword(nameKeyword: any): Promise<any>;
  createUserRoleEntity(userId: number, userRoleId: number): UserRole;
}
