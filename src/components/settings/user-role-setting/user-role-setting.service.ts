import { CheckPermissionDepartmentRequestDto } from '@components/settings/user-role-setting/dto/request/check-permission-department.request.dto';
import { CreateUserPermissionRequestDto } from '@components/settings/user-role-setting/dto/request/create-user-permission.request.dto';
import { CreateUserRoleSettingRequestDto } from '@components/settings/user-role-setting/dto/request/create-user-role-setting.request.dto';
import { DeleteRequestDto } from '@components/settings/user-role-setting/dto/request/delete.request.dto';
import { FinalCheckUserPermissionRequestDto } from '@components/settings/user-role-setting/dto/request/final-check-user-permission.request.dto';
import { GetPermissionIdRequestDto } from '@components/settings/user-role-setting/dto/request/get-permission-id.request.dto';
import { GetUserRoleDepartmentRequestDto } from '@components/settings/user-role-setting/dto/request/get-user-role-department.request.dto';
import { PermissionForListRequestDto } from '@components/settings/user-role-setting/dto/request/permission-for-list.request.dto';
import { CreateUserPermissionResponseDto } from '@components/settings/user-role-setting/dto/response/create-user-permission.response.dto';
import { CreateUserRoleSettingResponseDto } from '@components/settings/user-role-setting/dto/response/create-user-role-setting.response.dto';
import { DeleteSuccessfullyResponseDto } from '@components/settings/user-role-setting/dto/response/delete-successfully.response.dto';
import { GroupPermission } from '@components/settings/user-role-setting/dto/response/get-full-permisison-response.dto';
import { GetPermissionIdResponseDto } from '@components/settings/user-role-setting/dto/response/get-permission-id.response.dto';
import { IdResponseDto } from '@components/settings/user-role-setting/dto/response/id-response.dto';
import { GroupPermissionSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/group-permission-setting.repository.interface';
import { PermissionSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/permission-setting.repository.interface';
import { UserRolePermisisonSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/user-role-permission-setting.repository.interface';
import { UserRoleSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/user-role-setting.repository.interface';
import { UserRoleSettingServiceInterface } from '@components/settings/user-role-setting/interface/user-role-setting.service.interface';
import { UserRoleRepositoryInterface } from '@repositories/user-role.repository.interface';
import { UserRoleSetting } from '@entities/user-role-setting/user-role-setting.entity';
import { ACTIVE_ENUM, ROLE_SUPER_ADMIN } from '@constant/common';
import { ErrorMessageEnum } from '@constant/error-message.enum';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { GroupPermissionSettingEntity } from '@entities/group-permission-setting/group-permission-setting.entity';
import { PermissionSettingEntity } from '@entities/permission-setting/permission-setting.entity';
import { UserRolePermissionSettingEntity } from '@entities/user-role-permission-setting/user-role-permission-setting.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiError } from '@utils/api.error';
import { SuccessResponse } from '@utils/success.response.dto';
import { EnumStatus } from '@utils/common';
import { StatusPermission } from '@utils/constant';
import { PagingResponse } from '@utils/paging.response';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { plainToInstance } from 'class-transformer';
import { flatMap, isEmpty, keyBy, map, uniq } from 'lodash';
import { I18nService } from 'nestjs-i18n';
import { DataSource, Equal, In } from 'typeorm';
import { GetListUserRoleSettingRequestDto } from './dto/request/get-list-user-role-setting.request.dto';
import { GetPermissionByConditionRequestDto } from './dto/request/get-permission-by-condition.request.dto';
import { GroupPermissionByRoleIdRequestDto } from './dto/request/group-permission-by-role-id.request.dto';
import { UpdateStatusUserRoleSettingRequestDto } from './dto/request/update-status-user-role-setting.request';
import { UpdateUserRolePermissionRequestDto } from './dto/request/update-user-role-permission.request.dto';
import { UpdateUserRoleSettingRequestDto } from './dto/request/update-user-role-setting.request';
import { GetListUserRoleSettingResponseDto } from './dto/response/get-list-user-role-setting.response.dto';
import {
  GetPermissionsByConditionResponseDto,
  PermissionSettingResponseDto,
} from './dto/response/get-permissions-by-condition.response.dto';
import { PermissionWithGroupResponseDto } from './dto/response/permission-with-group.response.dto';
import { UserRoleResponseDto } from './dto/response/user-role.response.dto';
import { ChangeStatusUserRoleMultiDto } from './dto/request/change-status-user-role-multiple.request.dto';
import { DeleteMultipleUserRoleDto } from './dto/request/delete-multiple.request.dto';

@Injectable()
export class UserRoleSettingService implements UserRoleSettingServiceInterface {
  constructor(
    @Inject('UserRoleSettingRepositoryInterface')
    private readonly userRoleSettingRepository: UserRoleSettingRepositoryInterface,

    @Inject('UserRolePermissionSettingRepositoryInterface')
    private readonly userRolePermissionSettingRepository: UserRolePermisisonSettingRepositoryInterface,

    @Inject('UserRoleRepositoryInterface')
    private readonly userRoleRepository: UserRoleRepositoryInterface,

    @Inject('PermissionSettingRepositoryInterface')
    private readonly permissionSettingRepository: PermissionSettingRepositoryInterface,

    @Inject('GroupPermissionSettingRepositoryInterface')
    private readonly groupPermissionSettingRepository: GroupPermissionSettingRepositoryInterface,

    private readonly i18n: I18nService,

    @InjectDataSource()
    private readonly connection: DataSource,
  ) {}

  public async createUserRole(
    request: CreateUserRoleSettingRequestDto,
  ): Promise<ResponsePayload<CreateUserRoleSettingResponseDto | any>> {
    const condition = { code: request.code };
    const userRole =
      await this.userRoleSettingRepository.findByCondition(condition);

    if (!isEmpty(userRole)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        ErrorMessageEnum.CODE_ALREADY_EXISTS,
      ).toResponse();
    }

    const data = await this.userRoleSettingRepository.create(request);
    const response = plainToInstance(CreateUserRoleSettingResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
      .build();
  }

  async getAllUserRole(): Promise<ResponsePayload<UserRoleSetting[]>> {
    const data = await this.userRoleSettingRepository.findAll();
    return new ResponseBuilder(data)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
      .build();
  }

  public async setUserPermission(
    request: CreateUserPermissionRequestDto,
  ): Promise<ResponsePayload<CreateUserPermissionResponseDto>> {
    const permissionSettings = Object.assign({}, request.permissionSettings);
    for (const index of Object.keys(permissionSettings)) {
      const permission = permissionSettings[index];
      const condition = new CheckPermissionDepartmentRequestDto();
      condition.departmentId = permission.departmentId;
      condition.code = permission.code;

      const userPermission = {
        permissionSettingCode: permission.code,
        departmentId: permission.departmentId,
        userRoleId: permission.userRoleId,
        status: EnumStatus.YES,
      };
      if (permission.status) {
        const getUserPermission =
          await this.userRolePermissionSettingRepository.findOneByCondition(
            userPermission,
          );

        if (getUserPermission) continue;
        if (!getUserPermission) {
          await this.userRolePermissionSettingRepository.create(userPermission);
        }
      } else {
        const getUserPermission =
          await this.userRolePermissionSettingRepository.findOneByCondition(
            userPermission,
          );
        if (!getUserPermission) continue;
        if (getUserPermission) {
          await this.userRolePermissionSettingRepository.remove(
            getUserPermission.id,
          );
        }
      }
    }

    return new ResponseBuilder(request)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
      .build() as any;
  }

  async getUserRoleDepartment(
    request: GetUserRoleDepartmentRequestDto,
  ): Promise<ResponsePayload<IdResponseDto | any>> {
    const data = await this.userRoleRepository.findOneByCondition(request);
    const response = plainToInstance(
      IdResponseDto,
      { id: data.userRoleId },
      {
        excludeExtraneousValues: true,
      },
    );
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
      .build();
  }

  async checkUserPermission(request: any): Promise<ResponsePayload<boolean>> {
    const data =
      await this.userRolePermissionSettingRepository.checkUserPermission(
        request,
      );

    if (data.length > 0) {
      return new ResponseBuilder(true)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
        .build();
    } else {
      return new ResponseBuilder(false)
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(
          await this.i18n.translate('statusMessage.INTERNAL_SERVER_ERROR'),
        )
        .build();
    }
  }

  async checkUserPermissionForList(
    request: PermissionForListRequestDto,
  ): Promise<ResponsePayload<boolean>> {
    const data =
      await this.userRolePermissionSettingRepository.findOneByCondition(
        request,
      );
    return new ResponseBuilder(!!data)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
      .build();
  }

  async finalCheckUserPermission(
    request: FinalCheckUserPermissionRequestDto,
  ): Promise<ResponsePayload<boolean>> {
    const arrPermissionCode = request.permissionCode;
    const condition = {
      userId: request.userId,
      permissionCodes: arrPermissionCode,
    };

    const response = await this.checkUserPermission(condition);

    if (response.statusCode === ResponseCodeEnum.SUCCESS) {
      return new ResponseBuilder(true)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
        .build();
    } else {
      return new ResponseBuilder(false)
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(
          await this.i18n.translate('statusMessage.INTERNAL_SERVER_ERROR'),
        )
        .build();
    }
  }

  async deletePermission(
    request: DeleteRequestDto,
  ): Promise<ResponsePayload<DeleteSuccessfullyResponseDto | any>> {
    try {
      const permission = await this.permissionSettingRepository.findOneById(
        request.id,
      );
      if (!permission) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('statusMessage.NOT_FOUND'),
        ).toResponse();
      }

      await this.permissionSettingRepository.remove(request.id);
      const response = plainToInstance(
        DeleteSuccessfullyResponseDto,
        { id: request.id },
        {
          excludeExtraneousValues: true,
        },
      );
      return new ResponseBuilder(response)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.CAN_NOT_DELETE'))
        .build();
    }
  }

  //List Permission
  async getAllGroupPermission(): Promise<
    ResponsePayload<GroupPermissionSettingEntity[]>
  > {
    const groupPermission =
      await this.groupPermissionSettingRepository.findAll();
    const fullyPermission = [];
    const userRole = await this.userRoleSettingRepository.findAll();
    for (const group of groupPermission) {
      const groupPermission = new GroupPermission();
      groupPermission.id = group.id;
      groupPermission.name = group.name;
      groupPermission.code = group.code;
      const groupPermissionId = group.id;
      const Permissions =
        await this.permissionSettingRepository.getPermissionsByIds(
          groupPermissionId,
        );
      const ModifiedPermissions = [];
      for (const individualPermission of Permissions) {
        const Roles = [];
        const ModifiedIndividualPermission = {
          id: individualPermission.id,
          name: individualPermission.name,
          code: individualPermission.code,
          roles: [],
        };
        for (const role of userRole) {
          const condition = {
            userRoleId: role.id,
            permissionId: individualPermission.id,
          };
          const rawValue =
            await this.userRolePermissionSettingRepository.findOneByCondition(
              condition,
            );
          let value = true;
          if (!rawValue) {
            value = false;
          }
          const individualRole = { name: role.name, value: value };
          await Roles.push(individualRole);
        }
        ModifiedIndividualPermission.roles = Roles;
        await ModifiedPermissions.push(ModifiedIndividualPermission);
      }
      groupPermission.permission = ModifiedPermissions;
      await fullyPermission.push(groupPermission);
    }
    return new ResponseBuilder(fullyPermission)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
      .build();
  }

  async getPermissionIdByCode(
    condition: GetPermissionIdRequestDto,
  ): Promise<ResponsePayload<GetPermissionIdResponseDto | any>> {
    const data =
      await this.permissionSettingRepository.findOneByCondition(condition);
    const response = plainToInstance(GetPermissionIdResponseDto, data, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
      .build();
  }

  public async getPermissionCodeByName(
    request: string,
  ): Promise<ResponsePayload<string>> {
    const condition = { name: request };
    const data =
      await this.permissionSettingRepository.findOneByCondition(condition);
    return new ResponseBuilder(data.code)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
      .build();
  }

  public async getPermissionByUser(
    userRoleIds: number[],
    status?: number,
  ): Promise<any> {
    const conditionFilterUserRole = {
      userRoleId: In(userRoleIds),
    } as any;
    if (status) {
      conditionFilterUserRole.status = status;
    }
    const userRolePermissionSettings =
      await this.userRolePermissionSettingRepository.findByCondition(
        conditionFilterUserRole,
      );

    const permissionCodes = uniq(
      map(flatMap(userRolePermissionSettings), 'permissionSettingCode'),
    );

    return await this.permissionSettingRepository.findWithRelations({
      select: ['code'],
      where: {
        code: In(permissionCodes),
        status: StatusPermission.ACTIVE,
      },
    });
  }

  public async insertPermission(
    request,
  ): Promise<ResponsePayload<SuccessResponse>> {
    await this.userRoleSettingRepository.findOneByCondition({
      code: ROLE_SUPER_ADMIN.code,
    });

    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(
        GroupPermissionSettingEntity,
        request.groupPermission,
      );
      await queryRunner.manager.save(
        PermissionSettingEntity,
        request.permission,
      );

      //auto set permission super-admin
      // if (dataRoleAndDepartment.length > 0) {
      //   const permissionCodes = map(request.permission, 'code');
      //   const userRolePermissionSettingsExist =
      //     await this.userRolePermissionSettingRepository.findByCondition({
      //       permissionSettingCode: In(permissionCodes),
      //       userRoleId: roleSuperAdmin.id,
      //       departmentId: departmentSuperAdmin.id,
      //     });
      //   if (!isEmpty(userRolePermissionSettingsExist)) {
      //     await queryRunner.manager.delete(
      //       UserRolePermissionSettingEntity,
      //       userRolePermissionSettingsExist,
      //     );
      //   }

      //   const dataUserRolePermissionSettings =
      //     await this.setDataUserRolePermissionSetting(
      //       dataRoleAndDepartment,
      //       request.permission,
      //     );
      //   await queryRunner.manager.save(
      //     UserRolePermissionSettingEntity,
      //     dataUserRolePermissionSettings,
      //   );
      // }

      await queryRunner.commitTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
        .build() as any;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(
          await this.i18n.translate('statusMessage.INTERNAL_SERVER_ERROR'),
        )
        .build() as any;
    } finally {
      await queryRunner.release();
    }
  }

  public async deletePermissionNotActive(): Promise<
    ResponsePayload<SuccessResponse>
  > {
    const permissionNotActive =
      await this.permissionSettingRepository.findByCondition({
        status: StatusPermission.INACTIVE,
      });

    if (isEmpty(permissionNotActive)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
        .build() as any;
    }
    const permissionCodes = uniq(map(permissionNotActive, 'code'));

    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(
        PermissionSettingEntity,
        permissionNotActive,
      );

      if (!isEmpty(permissionCodes)) {
        const userRolePermissionSettings =
          await this.userRolePermissionSettingRepository.findByCondition({
            permissionSettingCode: In(permissionCodes),
          });
        if (userRolePermissionSettings.length > 0) {
          await queryRunner.manager.delete(
            UserRolePermissionSettingEntity,
            userRolePermissionSettings,
          );
        }
      }
      await queryRunner.commitTransaction();
      return new ResponseBuilder<SuccessResponse>()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
        .build();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder<SuccessResponse>()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(
          await this.i18n.translate('statusMessage.INTERNAL_SERVER_ERROR'),
        )
        .build();
    } finally {
      await queryRunner.release();
    }
  }

  public async getPermissionsByCondition(
    request: GetPermissionByConditionRequestDto,
  ): Promise<ResponsePayload<GetPermissionsByConditionResponseDto | any>> {
    const result =
      await this.userRolePermissionSettingRepository.getPermisionsByCondition(
        request,
      );
    const response = plainToInstance(PermissionSettingResponseDto, result, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
      .build() as any;
  }

  private async setDataUserRolePermissionSetting(
    dataRoleAndDepartment: any[],
    permissions: any[],
  ): Promise<UserRolePermissionSettingEntity[]> {
    const DataUserRolePermissionSetting = [];
    dataRoleAndDepartment.forEach((item) => {
      DataUserRolePermissionSetting.push(
        ...permissions.map((record) => ({
          permissionSettingCode: record.code,
          departmentId: item.departmentId,
          userRoleId: item.userRoleId,
          status: EnumStatus.YES,
        })),
      );
    });
    return DataUserRolePermissionSetting;
  }

  async getList(
    request: GetListUserRoleSettingRequestDto,
  ): Promise<ResponsePayload<PagingResponse>> {
    const { data, count, countTotal, countActive, countInActive } =
      await this.userRoleSettingRepository.getList(request);

    const response = plainToInstance(GetListUserRoleSettingResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder<PagingResponse>({
      items: response,
      meta: {
        count: count,
        page: request.page,
        total: countTotal,
        totalActive: countActive,
        totalInActive: countInActive,
      },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async updateUserPermission(
    request: UpdateUserRolePermissionRequestDto,
  ): Promise<any> {
    const { roleId, permissions } = request;

    const role = await this.userRoleSettingRepository.findOneById(roleId);
    if (isEmpty(role)) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.USER_ROLE_NOT_FOUND'),
      ).toResponse();
    }

    const permissionCodes = map(permissions, 'code');

    const permissionExist =
      await this.permissionSettingRepository.findByCondition({
        code: In(permissionCodes),
      });

    if (permissionExist.length != permissionCodes.length) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.PERMISSION_NOT_FOUND'),
      ).toResponse();
    }

    const permissionMap = keyBy(permissions, 'code');

    const conditionUserRolePermission = permissions.map((permission) => {
      return {
        userRoleId: roleId,
        permissionSettingCode: permission.code,
      };
    });
    let oldUserRolePermissions =
      await this.userRolePermissionSettingRepository.findByCondition(
        conditionUserRolePermission,
      );

    if (!isEmpty(oldUserRolePermissions)) {
      oldUserRolePermissions = oldUserRolePermissions.map((i) => {
        return {
          ...i,
          status: permissionMap[i.permissionSettingCode]?.status,
        };
      });
    }

    const newUserRolePermissions = permissions.filter(
      ({ code: code, status: status }) =>
        !oldUserRolePermissions.some(
          ({ permissionSettingCode: permissionSettingCode }) =>
            permissionSettingCode === code,
        ) && status == 1,
    );
    const newUserRolePermissionEntities = newUserRolePermissions?.map((i) => {
      return this.userRolePermissionSettingRepository.createEntity({
        ...i,
        roleId: roleId,
        permissionSettingCode: i.code,
        status: EnumStatus.YES,
      });
    });

    let result;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      if (!isEmpty(oldUserRolePermissions))
        await queryRunner.manager.save(
          UserRolePermissionSettingEntity,
          oldUserRolePermissions,
        );
      if (!isEmpty(newUserRolePermissionEntities))
        await queryRunner.manager.save(newUserRolePermissionEntities);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder(error)
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .build();
    } finally {
      await queryRunner.release();
    }

    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
      .build();
  }

  public async update(
    userRoleId: number,
    request: UpdateUserRoleSettingRequestDto,
  ): Promise<ResponsePayload<UserRoleSetting>> {
    const userRole = await this.userRoleSettingRepository.findOneByCondition({
      id: userRoleId,
    });

    if (!userRole) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('statusMessage.NOT_FOUND'))
        .build() as any;
    }

    const userRoleEntity = this.userRoleSettingRepository.updateEntity(
      userRole,
      request,
    );
    await this.userRoleSettingRepository.update(userRoleEntity);

    return new ResponseBuilder(userRoleEntity)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
      .build();
  }

  public async delete(
    userRoleId: number,
  ): Promise<ResponsePayload<SuccessResponse>> {
    const userRole = await this.userRoleSettingRepository.findOneByCondition({
      id: Equal(userRoleId),
    });

    if (!userRole) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('statusMessage.NOT_FOUND'))
        .build() as any;
    }

    if (userRole.status === ACTIVE_ENUM.ACTIVE) {
      const resultValidate = await this.validateInUsed([userRole.id]);
      if (resultValidate.statusCode !== ResponseCodeEnum.SUCCESS) {
        return resultValidate as any;
      }
    }

    await this.userRoleSettingRepository.remove(userRoleId);

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
      .build() as any;
  }

  async deleteMulti(
    request: DeleteMultipleUserRoleDto,
  ): Promise<ResponsePayload<SuccessResponse>> {
    const { codes } = request;
    const userRoles = await this.userRoleSettingRepository.findByCondition({
      code: In(codes),
    });

    if (userRoles.length !== codes.length) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('statusMessage.BAD_REQUEST'))
        .build() as any;
    }

    const userRolesActive = userRoles.filter((u) => {
      return u.status === ACTIVE_ENUM.ACTIVE;
    });
    const userRoleIds = userRolesActive.map((u) => u.id);
    const resultValidate = await this.validateInUsed(userRoleIds);
    if (resultValidate.statusCode !== ResponseCodeEnum.SUCCESS) {
      return resultValidate as any;
    }

    await this.userRoleSettingRepository.removeByCondition({
      code: In(codes),
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
      .build() as any;
  }

  public async getDetail(
    userRoleId: number,
  ): Promise<ResponsePayload<UserRoleSetting>> {
    const userRole = await this.userRoleSettingRepository.findOneByCondition({
      id: userRoleId,
    });
    if (!userRole) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('statusMessage.NOT_FOUND'))
        .build() as any;
    }

    const dataReturn = plainToInstance(UserRoleResponseDto, userRole, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
      .build() as any;
  }

  async getUserRoleSettingByIds(
    ids: number[],
  ): Promise<ResponsePayload<UserRoleSetting[]>> {
    try {
      const result =
        await this.userRoleSettingRepository.getUserRoleSettingByIds(ids);
      return new ResponseBuilder(result)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder(error?.message)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
        .build();
    }
  }

  async updateStatus(
    request: UpdateStatusUserRoleSettingRequestDto,
  ): Promise<any> {
    const { id, status } = request;
    const userRoleSetting =
      await this.userRoleSettingRepository.findOneById(id);

    if (isEmpty(userRoleSetting)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('statusMessage.NOT_FOUND'))
        .build();
    }

    if (status === ACTIVE_ENUM.INACTIVE) {
      const resultValidate = await this.validateInUsed([userRoleSetting.id]);
      if (resultValidate.statusCode !== ResponseCodeEnum.SUCCESS) {
        return resultValidate;
      }
    }

    await this.userRoleSettingRepository.update({
      ...userRoleSetting,
      status,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
      .build();
  }

  async updateStatusMulti(
    request: ChangeStatusUserRoleMultiDto & { status: EnumStatus },
  ): Promise<any> {
    const { ids, status } = request;

    if (status === EnumStatus.NO) {
      const resultValidate = await this.validateInUsed(ids);
      if (resultValidate.statusCode !== ResponseCodeEnum.SUCCESS) {
        return resultValidate;
      }
    }

    const userRole = await this.userRoleSettingRepository.findByCondition({
      id: In(ids),
    });

    const dataUpdate = userRole.map((i) => {
      return {
        ...i,
        status,
      };
    });

    await this.userRoleSettingRepository.update(dataUpdate);

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
      .build();
  }

  async getListPermissionWithGroup(
    request: GroupPermissionByRoleIdRequestDto,
  ): Promise<ResponsePayload<PagingResponse>> {
    const { roleId, page } = request;

    const role = await this.userRoleSettingRepository.findOneById(roleId);

    if (isEmpty(role)) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.USER_ROLE_NOT_FOUND'),
      ).toResponse();
    }

    const { data, count } =
      await this.groupPermissionSettingRepository.groupPermissionByRoleId(
        request,
      );

    const result = {
      groupPermissions: data,
      meta: { total: count, page: page },
    };

    const response = plainToInstance(PermissionWithGroupResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder<PagingResponse>({
      items: response as any,
      meta: { total: count, page: page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
      .build();
  }

  private async validateInUsed(ids: number[]) {
    const dataInUse = await this.userRoleRepository.getDataUsed(ids);

    if (dataInUse.length)
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('message.userRole.codeInUse'))
        .build();

    return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
  }
}
