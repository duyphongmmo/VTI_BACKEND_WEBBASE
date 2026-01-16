import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';

import { GetPermissionByConditionRequestDto } from '@components/settings/user-role-setting/dto/request/get-permission-by-condition.request.dto';
import { UserRolePermisisonSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/user-role-permission-setting.repository.interface';
import { UserRolePermissionSettingEntity } from '@entities/user-role-permission-setting/user-role-permission-setting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ACTIVE_ENUM } from '@constant/common';

@Injectable()
export class UserRolePermissionSettingRepository
  extends BaseAbstractRepository<UserRolePermissionSettingEntity>
  implements UserRolePermisisonSettingRepositoryInterface
{
  constructor(
    @InjectRepository(UserRolePermissionSettingEntity)
    private readonly userRolePermissionSettingRepository: Repository<UserRolePermissionSettingEntity>,
  ) {
    super(userRolePermissionSettingRepository);
  }

  createEntity(data: any): UserRolePermissionSettingEntity {
    const entity = new UserRolePermissionSettingEntity();
    entity.userRoleId = data.roleId;
    entity.permissionSettingCode = data.permissionSettingCode;
    entity.status = data.status;
    return entity;
  }

  async checkUserPermission(condition): Promise<any> {
    return await this.userRolePermissionSettingRepository
      .createQueryBuilder('urps')
      .select(['urps.id AS "id"'])
      .leftJoin('tbl_user_roles', 'ur', 'ur.user_role_id = urps.user_role_id')
      .where('ur.user_id = :userId', { userId: condition.userId })
      .andWhere('urps.permissionSettingCode IN (:...permissionCodes)', {
        permissionCodes: condition.permissionCodes,
      })
      .andWhere('urps.status = :status', { status: ACTIVE_ENUM.ACTIVE })
      .getRawMany();
  }

  async getDepartmentRole(): Promise<any> {
    return this.userRolePermissionSettingRepository
      .createQueryBuilder('urps')
      .select([
        'urps.department_id',
        `CASE WHEN COUNT(urs) = 0 THEN '[]' ELSE JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
          'id',urs.id, 
          'name', urs.name, 
          'code', urs.code
          )
        ) END AS "roles"`,
      ])
      .leftJoin(
        (qb) =>
          qb
            .select(['urs.id as id', 'urs.name as name', 'urs.code as code'])
            .from('tbl_user_role_settings', 'urs')
            .groupBy('urs.id'),
        'urs',
        'urs."id" = urps.user_role_id',
      )
      .leftJoin('department_settings', 'd', 'd.id = urps.department_id')
      .groupBy('urps.department_id')
      .addGroupBy('urps.user_role_id')
      .getRawMany();
  }

  async getPermisionsByCondition(
    request: GetPermissionByConditionRequestDto,
  ): Promise<any> {
    const { roleId, departmentId } = request;

    return await this.userRolePermissionSettingRepository
      .createQueryBuilder('urps')
      .select(['urps.permission_setting_code AS "permissionSettingCode"'])
      .where('urps.user_role_id = :roleId', { roleId: roleId })
      .andWhere('urps.department_id = :departmentId', {
        departmentId: departmentId,
      })
      .getRawMany();
  }
}
