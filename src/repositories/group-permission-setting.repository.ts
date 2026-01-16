import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { GroupPermissionSettingEntity } from '@entities/group-permission-setting/group-permission-setting.entity';
import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';

import { GroupPermissionByRoleIdRequestDto } from '@components/settings/user-role-setting/dto/request/group-permission-by-role-id.request.dto';
import { GroupPermissionSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/group-permission-setting.repository.interface';
import { PermissionSettingEntity } from '@entities/permission-setting/permission-setting.entity';
import { UserRolePermissionSettingEntity } from '@entities/user-role-permission-setting/user-role-permission-setting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GroupPermissionSettingRepository
  extends BaseAbstractRepository<GroupPermissionSettingEntity>
  implements GroupPermissionSettingRepositoryInterface
{
  constructor(
    @InjectRepository(GroupPermissionSettingEntity)
    private readonly groupPermissionSettingRepository: Repository<GroupPermissionSettingEntity>,
  ) {
    super(groupPermissionSettingRepository);
  }

  async groupPermissionByRoleId(
    request: GroupPermissionByRoleIdRequestDto,
  ): Promise<any> {
    const { roleId, filter, skip, take } = request;
    const query = this.groupPermissionSettingRepository
      .createQueryBuilder('gps')
      .select([
        'gps.id AS "id"',
        'gps.name AS "name"',
        'gps.code AS "code"',
        'gps.status AS "status"',
        `CASE WHEN COUNT(ps) = 0 THEN '[]' ELSE JSON_AGG(
          DISTINCT JSONB_BUILD_OBJECT('id', ps.id, 'code', ps.code, 'name', ps.name, 'status', COALESCE(urps.status, 0))) END AS "permissionSettings"`,
      ])
      .innerJoin(
        PermissionSettingEntity,
        'ps',
        'ps.groupPermissionSettingCode = gps.code',
      )
      .leftJoin(
        UserRolePermissionSettingEntity,
        'urps',
        `urps.permission_setting_code = ps.code AND urps.user_role_id = ${roleId}`,
      )
      .addGroupBy('gps.id')
      .addGroupBy('gps.name')
      .addGroupBy('gps.code')
      .addGroupBy('gps.status')
      .orderBy('gps.name', 'ASC');

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'status':
            query.andWhere(`"dgp"."status" = :status`, {
              status: item.text,
            });
            break;
          default:
            break;
        }
      });
    }

    const data = await query.offset(skip).limit(take).getRawMany();
    const count = await query.getCount();

    return { data, count };
  }
}
