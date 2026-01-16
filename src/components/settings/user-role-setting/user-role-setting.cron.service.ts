import { PermissionSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/permission-setting.repository.interface';
import { UserRolePermisisonSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/user-role-permission-setting.repository.interface';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { GroupPermissionSettingEntity } from '@entities/group-permission-setting/group-permission-setting.entity';
import { PermissionSettingEntity } from '@entities/permission-setting/permission-setting.entity';
import { UserRolePermissionSettingEntity } from '@entities/user-role-permission-setting/user-role-permission-setting.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { StatusPermission } from '@utils/constant';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { SuccessResponse } from '@utils/success.response.dto';
import { isEmpty, map, uniq } from 'lodash';
import { I18nService } from 'nestjs-i18n';
import { DataSource, In } from 'typeorm';

@Injectable()
export class UserRoleSettingCronService {
  constructor(
    @Inject('UserRolePermissionSettingRepositoryInterface')
    private readonly userRolePermissionSettingRepository: UserRolePermisisonSettingRepositoryInterface,

    @Inject('PermissionSettingRepositoryInterface')
    private readonly permissionSettingRepository: PermissionSettingRepositoryInterface,

    private readonly i18n: I18nService,

    @InjectDataSource()
    private readonly connection: DataSource,
  ) {}

  public async insertPermissionAndUserRole(request): Promise<ResponsePayload<SuccessResponse>> {
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

      await queryRunner.commitTransaction();
      return new ResponseBuilder<SuccessResponse>()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
        .build();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder<SuccessResponse>()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('statusMessage.INTERNAL_SERVER_ERROR'))
        .build();
    } finally {
      await queryRunner.release();
    }
  }

  public async deletePermissionNotActive(): Promise<ResponsePayload<SuccessResponse>> {
    const permissionNotActive =
      await this.permissionSettingRepository.findByCondition({
        status: StatusPermission.INACTIVE,
      });

    if (isEmpty(permissionNotActive)) {
      return new ResponseBuilder<SuccessResponse>()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
        .build();
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
        .withMessage(await this.i18n.translate('statusMessage.INTERNAL_SERVER_ERROR'))
        .build();
    } finally {
      await queryRunner.release();
    }
  }
}
