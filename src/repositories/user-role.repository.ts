import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '@entities/user-role/user-role.entity';
import { UserRoleRepositoryInterface } from './user-role.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';

@Injectable()
export class UserRoleRepository
  extends BaseAbstractRepository<UserRole>
  implements UserRoleRepositoryInterface
{
  constructor(
    @InjectRepository(UserRole)
    private readonly userRolesRepository: Repository<UserRole>,
  ) {
    super(userRolesRepository);
  }

  async getDataUsed(ids: number[]) {
    const query = await this.userRolesRepository
      .createQueryBuilder('ur')
      .where('ur.user_role_id IN (:...ids)', { ids: ids });

    return query.getRawMany();
  }
}
