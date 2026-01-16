import { CreateUserRequestDto } from '@components/user/dto/request/create-user.request.dto';
import { UserRepositoryInterface } from '@components/user/interface/user.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { UserRoleSetting } from '@entities/user-role-setting/user-role-setting.entity';
import { UserRole } from '@entities/user-role/user-role.entity';
import { User } from '@entities/user/user.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { isDateString } from 'class-validator';
import { isEmpty } from 'lodash';
import { Repository } from 'typeorm';
import { SUPER_ADMIN } from './../constant/common';
import { escapeCharForSearch } from './../utils/common';
import { TypeEnum } from '@components/auth/auth.constant';

@Injectable()
export class UserRepository
  extends BaseAbstractRepository<User>
  implements UserRepositoryInterface
{
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }

  /**
   * Validate user by password
   * @param username
   * @param password
   * @returns
   */
  public async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersRepository
      .createQueryBuilder('u')
      .select(['u.id AS id', 'u.password as password', 'u.code as code'])
      .where('username = :username', { username: username })
      .getRawOne();
    if (!user) return false;
    const isValidPassword = await bcrypt.compareSync(password, user.password);
    if (!isValidPassword) return false;

    return user;
  }

  /**
   * Create User Entity
   * @param userDto
   * @returns
   */
  async createEntity(userDto: CreateUserRequestDto): Promise<User> {
    const saltOrRounds = new ConfigService().get('saltOrRounds');
    const user = new User();

    user.email = userDto.email;
    user.username = userDto.username;
    user.fullName = userDto.fullName;
    user.password = await bcrypt.hashSync(userDto.password, saltOrRounds);
    userDto.password;
    user.dateOfBirth = userDto.dateOfBirth;
    user.code = userDto.code;
    user.phone = userDto.phone;
    user.createdBy = userDto.userId;
    user.status = userDto.status;
    user.type = userDto.type;

    return user;
  }

  public createUserRoleEntity(userId: number, userRoleId: number): UserRole {
    const userRole = new UserRole();

    userRole.userId = userId;
    userRole.userRoleId = userRoleId;

    return userRole;
  }

  public async checkUniqueUser(condition: any): Promise<any> {
    return await this.usersRepository.find({
      where: condition,
      select: ['id'],
      withDeleted: true,
    });
  }

  /**
   * Get use detail
   * @param id number
   * @returns
   */
  public async getDetail(id: number): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });
    return user;
  }

  /**
   * Get user List
   * @param request
   * @returns
   */
  public async getListUser(payload): Promise<any> {
    const { skip, take, keyword, sort, filter, isGetAll } = payload;
    let query = this.usersRepository
      .createQueryBuilder('u')
      .select([
        'u.id AS id',
        'u.full_name AS "fullName"',
        'u.code AS "code"',
        'u.email AS "email"',
        'u.username AS "username"',
        'u.date_of_birth AS "dateOfBirth"',
        'u.status_notification AS "statusNotification"',
        'u.phone AS "phone"',
        'u.status AS "status"',
        'u.created_by AS "createdBy"',
        'u.createdAt AS "createdAt"',
        'u.updatedAt AS "updatedAt"',
        `CASE WHEN COUNT(ur) = 0 THEN '[]' ELSE JSON_AGG(
          DISTINCT JSONB_BUILD_OBJECT('id', ur.id, 'userRoleId', ur.user_role_id, 'userRoleName', urs.name)) END AS "userRoles"`,
      ])
      .leftJoin('u.userRoles', 'ur')
      .leftJoin(UserRoleSetting, 'urs', 'urs.id = ur.user_role_id');
    const countTotal = await query.getCount();

    if (!isEmpty(keyword)) {
      query
        .orWhere(`lower("u"."username") like lower(:pkeyWord) escape '\\'`, {
          pkeyWord: `%${escapeCharForSearch(keyword)}%`,
        })
        .orWhere('lower("u"."code") like lower(:pkeyWord)', {
          pkeyWord: `%${escapeCharForSearch(keyword)}%`,
        });
    }

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'username':
            query.andWhere(
              `lower("u"."username") like lower(:username) escape '\\'`,
              {
                username: `%${escapeCharForSearch(item.text)}%`,
              },
            );
            break;
          case 'usernames':
            query.andWhere(`"u"."username" IN (:...listUsername)`, {
              listUsername: item.text,
            });
            break;
          case 'fullName':
            query.andWhere(
              `lower("u"."full_name") like lower(:fullName) escape '\\'`,
              {
                fullName: `%${escapeCharForSearch(item.text)}%`,
              },
            );
            break;
          case 'status':
            query.andWhere(`"u"."status" = :status`, {
              status: item.text,
            });
            break;
          case 'createdAt':
            query.andWhere(
              `"u"."created_at"::DATE >= :createdAtFrom::DATE AND "u"."created_at"::DATE <= :createdAtTo::DATE`,
              {
                createdAtFrom: isDateString(item.text.split('|')[0])
                  ? item.text.split('|')[0]
                  : new Date(),
                createdAtTo: isDateString(item.text.split('|')[1])
                  ? item.text.split('|')[1]
                  : new Date(),
              },
            );
            break;
          case 'roleName':
            query.andWhere(
              `lower("urs"."name") like lower(:userRoleSetting) escape '\\'`,
              {
                userRoleSetting: `%${escapeCharForSearch(item.text)}%`,
              },
            );
            break;
          case 'userId':
            query.andWhere(`u.id = :userId`, {
              userId: item.text,
            });
            break;
          case 'code':
            query.andWhere(`lower("u"."code") like lower(:code) escape '\\'`, {
              code: `%${escapeCharForSearch(item.text)}%`,
            });
            break;
          case 'email':
            query.andWhere(
              `lower("u"."email") like lower(:email) escape '\\'`,
              {
                email: `%${escapeCharForSearch(item.text)}%`,
              },
            );
            break;
          case 'factoryId':
            query.andWhere(`f.id = :factoryId`, {
              factoryId: item.text,
            });
            break;
          case 'type':
            query.andWhere(`u.type = :type`, {
              type: item.text,
            });
            break;
          case 'userIds':
            query.andWhere(`"u"."id" IN (:...ids)`, {
              ids: item.text.split(','),
            });
            break;
          case 'orgStructureIds':
            let stringQuery = '1=0';
            item.text.split(',').forEach((v) => {
              stringQuery += ` OR ',' || string_agg(os.id::character varying, ',') || ',' ILIKE '%,${v},%'`;
            });
            query.having(stringQuery);
            break;
          default:
            break;
        }
      });
    }

    if (payload.ids) {
      query.andWhere(`"u"."id" IN (:...ids)`, {
        ids: payload.ids.split(','),
      });
    }

    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        switch (item.column) {
          case 'username':
            query = query.orderBy('"u"."username"', item.order);
            break;
          case 'fullName':
            query = query.orderBy('"u"."full_name"', item.order);
            break;
          case 'code':
            query = query.orderBy('"u"."code"', item.order);
            break;
          default:
            break;
        }
      });
    } else {
      query.orderBy('u.id', 'DESC');
    }

    query.groupBy('u.id');

    const data = parseInt(isGetAll)
      ? await query.getRawMany()
      : await query.offset(skip).limit(take).getRawMany();
    const count = await query.getCount();
    const countActive = await query.where('u.status = 1').getCount();
    const countInActive = await query.where('u.status = 0').getCount();
    const countAzure = await query
      .where(`u.type = ${TypeEnum.AZURE}`)
      .getCount();

    return {
      data: data,
      count: count,
      countTotal: countTotal,
      countActive: countActive,
      countInActive: countInActive,
      countAzure,
    };
  }

  public async delete(id: number): Promise<any> {
    return await this.usersRepository
      .createQueryBuilder()
      .softDelete()
      .where('id = :id', { id: id })
      .execute();
  }

  public isSuperAdmin(code: string): boolean {
    return code === SUPER_ADMIN.code;
  }

  //Todo Can Query them Department
  public async getUserNotInRoleCodes(roleCodes: string[]): Promise<any> {
    const query = await this.usersRepository
      .createQueryBuilder('u')
      .select([`u.id as "userId"`]);
    if (roleCodes) {
      query.where(`urs.code NOT IN (:roleCodes)`, { roleCodes });
    }
    return query.getRawMany();
  }

  async getCount(): Promise<any> {
    return await this.usersRepository
      .createQueryBuilder('c')
      .select([`COUNT("c"."id") AS "cnt"`])
      .getRawOne();
  }

  getUsersByCondition(condition: string): Promise<any[]> {
    return this.usersRepository.createQueryBuilder().where(condition).getMany();
  }

  public async findUsersByNameKeyword(nameKeyword: any): Promise<any> {
    const query = this.usersRepository
      .createQueryBuilder('u')
      .select([])
      .andWhere(
        `LOWER(unaccent(full_name)) LIKE ` +
          `LOWER(unaccent('%${escapeCharForSearch(
            nameKeyword,
          )}%')) escape '\\'`,
      );
    return await query.getRawMany();
  }
}
