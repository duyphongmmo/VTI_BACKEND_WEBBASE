import { GetListUserRoleSettingRequestDto } from '@components/settings/user-role-setting/dto/request/get-list-user-role-setting.request.dto';
import { UpdateUserRoleSettingRequestDto } from '@components/settings/user-role-setting/dto/request/update-user-role-setting.request';
import { UserRoleSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/user-role-setting.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { UserRoleSetting } from '@entities/user-role-setting/user-role-setting.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { escapeCharForSearch } from '@utils/common';
import { isEmpty } from 'lodash';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class UserRoleSettingRepository
  extends BaseAbstractRepository<UserRoleSetting>
  implements UserRoleSettingRepositoryInterface
{
  constructor(
    @InjectRepository(UserRoleSetting)
    private readonly userRoleRepository: Repository<UserRoleSetting>,
  ) {
    super(userRoleRepository);
  }

  async getList(request: GetListUserRoleSettingRequestDto): Promise<any> {
    const { filter, sort } = request;
    let query = this.userRoleRepository
      .createQueryBuilder('urs')
      .select([
        'urs.id AS "id"',
        'urs.code AS "code"',
        'urs.name AS "name"',
        'urs.description AS "description"',
        'urs.status AS "status"',
      ]);
    const countTotal = await query.getCount();

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'keyword':
            query.andWhere(
              new Brackets((qb) => {
                qb.where(
                  `lower("urs"."name") LIKE lower(:pkeyWord) escape '\\'`,
                  {
                    pkeyword: `%${escapeCharForSearch(item.text)}%`,
                  },
                );
                qb.orWhere(
                  `lower("urs"."code") LIKE lower(:pkeyWord) escape '\\'`,
                  {
                    pkeyWord: `%${escapeCharForSearch(item.text)}%`,
                  },
                );
              }),
            );
            break;
          case 'name':
            query.andWhere(
              `lower("urs"."name") like lower(:name) escape '\\'`,
              {
                name: `%${escapeCharForSearch(item.text)}%`,
              },
            );
            break;
          case 'code':
            query.andWhere(
              `lower("urs"."code") like lower(:code) escape '\\'`,
              {
                code: `%${escapeCharForSearch(item.text)}%`,
              },
            );
            break;
          case 'description':
            query.andWhere(
              `lower("urs"."description") like lower(:description) escape '\\'`,
              {
                description: `%${escapeCharForSearch(item.text)}%`,
              },
            );
            break;
          case 'createdAt':
            const createdFrom = item.text.split('|')[0];
            const createdTo = item.text.split('|')[1];
            query.andWhere(
              `"urs"."created_at" between :createdFrom AND :createdTo`,
              {
                createdFrom: createdFrom,
                createdTo: createdTo,
              },
            );
            break;
          case 'status':
            query.andWhere(`"urs"."status" = :status`, {
              status: item.text,
            });
            break;
          default:
            break;
        }
      });
    }
    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        switch (item.column) {
          case 'name':
            query = query.orderBy(
              '"urs"."name"',
              item.order === 'ASC' ? 'ASC' : 'DESC',
            );
            break;
          case 'code':
            query = query.orderBy(
              '"urs"."code"',
              item.order === 'ASC' ? 'ASC' : 'DESC',
            );
            break;

          case 'createdAt':
            query = query.orderBy(
              '"urs"."created_At"',
              item.order === 'ASC' ? 'ASC' : 'DESC',
            );
            break;
          default:
            break;
        }
      });
    } else {
      query.orderBy('urs.id', 'DESC');
    }

    const data = await query
      .offset(request.skip)
      .limit(request.take)
      .getRawMany();
    const count = await query.getCount();
    const countActive = await query.where('urs.status = 1').getCount();
    const countInActive = await query.where('urs.status = 0').getCount();

    return {
      data: data,
      count: count,
      countTotal: countTotal,
      countActive: countActive,
      countInActive: countInActive,
    };
  }

  updateEntity(
    userRoleEntity: UserRoleSetting,
    request: UpdateUserRoleSettingRequestDto,
  ): UserRoleSetting {
    if (request.name !== undefined && request.name !== '') {
      userRoleEntity.name = request.name;
    }

    userRoleEntity.description = request.description;
    return userRoleEntity;
  }

  async getUserRoleSettingByIds(ids: number[]): Promise<any> {
    let result = [];
    if (!isEmpty(ids)) {
      const query = this.userRoleRepository
        .createQueryBuilder('urs')
        .select([
          'urs.id AS "id"',
          'urs.code AS "code"',
          'urs.name AS "name"',
          'urs.description AS "description"',
        ]);
      query.where('id IN(:...ids)', ids);
      result = await query.getRawMany();
    }
    return result;
  }
}
