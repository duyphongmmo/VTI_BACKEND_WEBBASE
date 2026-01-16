import { PermissionSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/permission-setting.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { PermissionSettingEntity } from '@entities/permission-setting/permission-setting.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusPermission } from '@utils/constant';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionSettingRepository
  extends BaseAbstractRepository<PermissionSettingEntity>
  implements PermissionSettingRepositoryInterface
{
  constructor(
    @InjectRepository(PermissionSettingEntity)
    private readonly permissionSettingRepository: Repository<PermissionSettingEntity>,
  ) {
    super(permissionSettingRepository);
  }

  async getPermissionsByIds(groupPermissionId: number): Promise<any> {
    return await this.permissionSettingRepository
      .createQueryBuilder('ps')
      .where('groupPermissionSettingId = :groupPermissionId', {
        groupPermissionId: groupPermissionId,
      })
      .andWhere('status = :status', { status: StatusPermission.ACTIVE })
      .getMany();
  }

  async deletePermissionNotActive(): Promise<any> {
    return await this.permissionSettingRepository.delete({
      status: StatusPermission.INACTIVE,
    });
  }
}
