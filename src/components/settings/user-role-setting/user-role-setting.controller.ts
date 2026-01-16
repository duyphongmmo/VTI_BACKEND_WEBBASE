import { CheckUserPermissionRequestDto } from '@components/settings/user-role-setting/dto/request/check-user-permission.request.dto';
import { CreateUserPermissionRequestDto } from '@components/settings/user-role-setting/dto/request/create-user-permission.request.dto';
import { CreateUserRoleSettingRequestDto } from '@components/settings/user-role-setting/dto/request/create-user-role-setting.request.dto';
import { DeleteRequestDto } from '@components/settings/user-role-setting/dto/request/delete.request.dto';
import { FinalCheckUserPermissionRequestDto } from '@components/settings/user-role-setting/dto/request/final-check-user-permission.request.dto';
import { PermissionForListRequestDto } from '@components/settings/user-role-setting/dto/request/permission-for-list.request.dto';
import { CreateUserPermissionResponseDto } from '@components/settings/user-role-setting/dto/response/create-user-permission.response.dto';
import { DeleteSuccessfullyResponseDto } from '@components/settings/user-role-setting/dto/response/delete-successfully.response.dto';
import { UserRoleSetting } from '@entities/user-role-setting/user-role-setting.entity';
import { GroupPermissionSettingEntity } from '@entities/group-permission-setting/group-permission-setting.entity';
import { UserRoleSettingServiceInterface } from '@components/settings/user-role-setting/interface/user-role-setting.service.interface';
import { UNAUTHORIZE_KEY } from '@constant/common';
import { PermissionCode } from '@core/decorator/get-code.decorator';
import { AuthorizeMessage } from '@core/decorator/set-authorize-message';
import { IdParamRequestDto } from '@core/dto/id-param.request.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EnumStatus } from '@utils/common';
import isEmpty from '@utils/helper';
import {
  LIST_PERMISSION_USER_PERMISSION,
  SEARCH_PERMISSION_USER_PERMISSION,
  SET_PERMISSION_USER_PERMISSION,
} from '@utils/permissions/permission-setting';
import {
  CREATE_USER_PERMISSION,
  UPDATE_USER_PERMISSION,
} from '@utils/permissions/user';
import {
  CHANGE_STATUS_USER_ROLE_SETTING_PERMISSION,
  CREATE_USER_ROLE_SETTING_PERMISSION,
  DELETE_USER_ROLE_SETTING_PERMISSION,
  DETAIL_USER_ROLE_SETTING_PERMISSION,
  LIST_USER_ROLE_SETTING_PERMISSION,
  SEARCH_USER_ROLE_SETTING_PERMISSION,
  UPDATE_USER_ROLE_SETTING_PERMISSION,
} from '@utils/permissions/user-role-setting';
import { ResponsePayload } from '@utils/response-payload';
import { SuccessResponse } from '@utils/success.response.dto';
import { ChangeStatusUserRoleMultiDto } from './dto/request/change-status-user-role-multiple.request.dto';
import { DeleteMultipleUserRoleDto } from './dto/request/delete-multiple.request.dto';
import { GetListUserRoleSettingRequestDto } from './dto/request/get-list-user-role-setting.request.dto';
import { GetPermissionByConditionRequestDto } from './dto/request/get-permission-by-condition.request.dto';
import { GroupPermissionByRoleIdRequestDto } from './dto/request/group-permission-by-role-id.request.dto';
import { UpdateUserRolePermissionRequestDto } from './dto/request/update-user-role-permission.request.dto';
import { UpdateUserRoleSettingRequestDto } from './dto/request/update-user-role-setting.request';
import { GetListUserRoleSettingResponseDto } from './dto/response/get-list-user-role-setting.response.dto';
import { PermissionWithGroupResponseDto } from './dto/response/permission-with-group.response.dto';

@Controller('users')
export class UserRoleSettingController {
  constructor(
    @Inject('UserRoleSettingServiceInterface')
    private readonly userRoleSettingService: UserRoleSettingServiceInterface,
  ) {}

  @PermissionCode(CREATE_USER_ROLE_SETTING_PERMISSION.code)
  @AuthorizeMessage(UNAUTHORIZE_KEY.USER_ROLE_UNAUTHORIZE)
  @Post('user-role-settings')
  @ApiOperation({
    tags: ['User Role Setting'],
    summary: 'Create user role setting',
    description: 'Tao vai tro',
  })
  @ApiResponse({
    status: 200,
    description: 'Create user role setting successfully',
    type: SuccessResponse,
  })
  public async createUserRole(
    @Body() body: CreateUserRoleSettingRequestDto,
  ): Promise<ResponsePayload<UserRoleSetting>> {
    const { request, responseError } = body;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.createUserRole(request);
  }
  // @TODO: remove when refactor done
  // @MessagePattern(`${NATS_USER}.create_user_role`)
  public async createUserRoleTcp(
    @Body() body: CreateUserRoleSettingRequestDto,
  ): Promise<ResponsePayload<UserRoleSetting>> {
    const { request, responseError } = body;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.createUserRole(request);
  }

  // @MessagePattern(`${NATS_USER}.get_all_user_roles`)
  async getAllUserRole(
    @Body() request: any,
  ): Promise<ResponsePayload<UserRoleSetting[]>> {
    return await this.userRoleSettingService.getAllUserRole(request);
  }
  // @TODO: remove when refactor done
  async getAllUserRoleTcp(
    @Body() request: any,
  ): Promise<ResponsePayload<UserRoleSetting[]>> {
    return await this.userRoleSettingService.getAllUserRole(request);
  }

  @PermissionCode(SET_PERMISSION_USER_PERMISSION.code)
  @AuthorizeMessage(UNAUTHORIZE_KEY.MANAGE_PERMISSION_UNAUTHORIZE)
  // @MessagePattern(`${NATS_USER}.set_user_permission`)
  @Post('user-permission-settings/set-user-permission')
  @ApiOperation({
    tags: ['User Permission Setting'],
    summary: 'Set user permission',
    description: 'Phan quyen cho user',
  })
  @ApiResponse({
    status: 200,
    description: 'Create user permission successfully',
    type: CreateUserPermissionResponseDto,
  })
  async setUserPermission(
    @Body() body: CreateUserPermissionRequestDto,
  ): Promise<ResponsePayload<CreateUserPermissionResponseDto>> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.permissionSettings = [...request.permissionSettings];

    return await this.userRoleSettingService.setUserPermission(request);
  }

  // @MessagePattern(`${NATS_USER}.get_user_permission`)
  async getUserPermission(
    request: any,
  ): Promise<ResponsePayload<GroupPermissionSettingEntity[]>> {
    return await this.userRoleSettingService.getAllGroupPermission(request);
  }

  // @MessagePattern(`${NATS_USER}.check_user_permission`)
  public async checkUserPermission(
    body: CheckUserPermissionRequestDto,
  ): Promise<ResponsePayload<boolean>> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.checkUserPermission(request);
  }

  // @MessagePattern(`${NATS_USER}.check_user_permission_for_list`)
  public async checkUserPermissionForList(
    body: PermissionForListRequestDto,
  ): Promise<ResponsePayload<SuccessResponse>> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.checkUserPermissionForList(
      request,
    );
  }

  // @MessagePattern(`${NATS_USER}.final_check_user_permission`)
  public async finalCheckUserPermission(
    body: FinalCheckUserPermissionRequestDto,
  ): Promise<ResponsePayload<boolean>> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.finalCheckUserPermission(request);
  }
  // @TODO: remove when refactor done
  // @MessagePattern(`${NATS_USER}.final_check_user_permission`)
  public async finalCheckUserPermissionTcp(
    body: FinalCheckUserPermissionRequestDto,
  ): Promise<ResponsePayload<boolean>> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.finalCheckUserPermission(request);
  }

  // @MessagePattern(`${NATS_USER}.delete_permission`)
  public async deletePermission(
    @Body() body: DeleteRequestDto,
  ): Promise<ResponsePayload<DeleteSuccessfullyResponseDto>> {
    const { request, responseError } = body;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.deletePermission(request);
  }
  // @TODO: remove when refactor done
  // @MessagePattern(`${NATS_USER}.delete_permission`)
  public async deletePermissionTcp(
    @Body() body: DeleteRequestDto,
  ): Promise<ResponsePayload<DeleteSuccessfullyResponseDto>> {
    const { request, responseError } = body;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.deletePermission(request);
  }

  @Get('/get-user-permission')
  @ApiOperation({
    tags: ['User Permission Setting'],
    summary: 'Get User Permisison',
    description: 'Lay thong tin phan quyen user',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully',
  })
  public async getAllGroupPermission(
    @Param() param: any,
  ): Promise<ResponsePayload<GroupPermissionSettingEntity[]>> {
    return await this.userRoleSettingService.getAllGroupPermission(param);
  }

  public async getPermissionCodeByName(
    request: string,
  ): Promise<ResponsePayload<string>> {
    return await this.userRoleSettingService.getPermissionCodeByName(request);
  }

  public async getPermissionCodeByNameTcp(
    request: string,
  ): Promise<ResponsePayload<string>> {
    return await this.userRoleSettingService.getPermissionCodeByName(request);
  }

  public async insertPermissionTcp(
    request,
  ): Promise<ResponsePayload<SuccessResponse>> {
    return await this.userRoleSettingService.insertPermission(request);
  }

  public async deletePermissionNotActiveTcp(): Promise<
    ResponsePayload<SuccessResponse>
  > {
    return await this.userRoleSettingService.deletePermissionNotActive();
  }

  public async getPermissionsByCondition(
    @Param('departmentId', new ParseIntPipe()) departmentId,
    @Param('roleId', new ParseIntPipe()) roleId,
  ): Promise<ResponsePayload<any>> {
    return await this.userRoleSettingService.getPermissionsByCondition({
      departmentId,
      roleId,
    } as GetPermissionByConditionRequestDto);
  }

  @PermissionCode(
    LIST_PERMISSION_USER_PERMISSION.code,
    SEARCH_PERMISSION_USER_PERMISSION.code,
  )
  @AuthorizeMessage(UNAUTHORIZE_KEY.MANAGE_PERMISSION_UNAUTHORIZE)
  @Get('/role/permission')
  @ApiOperation({
    tags: ['User Role - Permission Setting'],
    summary: 'List User Role- Permission Setting',
    description: 'Danh sách Role - Permission',
  })
  @ApiResponse({
    status: 200,
    description: 'Get Role - Permission Setting List successfully',
    type: PermissionWithGroupResponseDto,
  })
  public async departmentGroupPermissionByDepartmentId(
    @Query() payload: GroupPermissionByRoleIdRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.userRoleSettingService.getListPermissionWithGroup(
      request,
    );
  }

  @PermissionCode(
    LIST_USER_ROLE_SETTING_PERMISSION.code,
    SEARCH_USER_ROLE_SETTING_PERMISSION.code,
    UPDATE_USER_ROLE_SETTING_PERMISSION.code,
    CREATE_USER_PERMISSION.code,
    UPDATE_USER_PERMISSION.code,
  )
  @AuthorizeMessage(UNAUTHORIZE_KEY.USER_ROLE_UNAUTHORIZE)
  @Get('/user-role-settings/list')
  @ApiOperation({
    tags: ['User Role Setting'],
    summary: 'List User Role Setting',
    description: 'Danh sách role',
  })
  @ApiResponse({
    status: 200,
    description: 'Get Department Setting List successfully',
    type: GetListUserRoleSettingResponseDto,
  })
  public async getList(
    @Query() payload: GetListUserRoleSettingRequestDto,
  ): Promise<ResponsePayload<GetListUserRoleSettingResponseDto | any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.getList(request);
  }

  @PermissionCode(DETAIL_USER_ROLE_SETTING_PERMISSION.code)
  @AuthorizeMessage(UNAUTHORIZE_KEY.USER_ROLE_UNAUTHORIZE)
  @Get('user-role-settings/:id')
  @ApiOperation({
    tags: ['User Role Setting'],
    summary: 'Detail user role',
    description: 'Chi tiet vai tro',
  })
  @ApiResponse({
    status: 200,
    description: 'Get user role detail successfully',
    type: SuccessResponse,
  })
  public async getDetail(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ResponsePayload<SuccessResponse | any>> {
    return await this.userRoleSettingService.getDetail(id);
  }

  @PermissionCode(UPDATE_USER_ROLE_SETTING_PERMISSION.code)
  @AuthorizeMessage(UNAUTHORIZE_KEY.USER_ROLE_UNAUTHORIZE)
  @Post('/user-role-settings/set-permissions')
  @ApiOperation({
    tags: ['User Role Setting'],
    summary: 'Post User Role Setting',
    description: 'Update User Role Permission',
  })
  @ApiResponse({
    status: 200,
    type: null,
  })
  public async updateUserPermission(
    @Body() payload: UpdateUserRolePermissionRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.userRoleSettingService.updateUserPermission(request);
  }

  @PermissionCode(UPDATE_USER_ROLE_SETTING_PERMISSION.code)
  @AuthorizeMessage(UNAUTHORIZE_KEY.USER_ROLE_UNAUTHORIZE)
  @Put('user-role-settings/:id')
  @ApiOperation({
    tags: ['User Role Setting'],
    summary: 'Update user role setting',
    description: 'Cap nhat vai tro',
  })
  @ApiResponse({
    status: 200,
    description: 'Update user role setting successfully',
    type: SuccessResponse,
  })
  public async update(
    @Param('id', new ParseIntPipe()) userRoleSettingId: number,
    @Body() payload: UpdateUserRoleSettingRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.userRoleSettingService.update(userRoleSettingId, request);
  }

  @PermissionCode(DELETE_USER_ROLE_SETTING_PERMISSION.code)
  @AuthorizeMessage(UNAUTHORIZE_KEY.USER_ROLE_UNAUTHORIZE)
  @Delete('user-role-settings/:id')
  @ApiOperation({
    tags: ['User Role Setting'],
    summary: 'Delete user role setting',
    description: 'Xoa vai tro',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete user role setting successfully',
    type: SuccessResponse,
  })
  public async delete(
    @Param('id', new ParseIntPipe()) userRoleSettingId: number,
  ): Promise<ResponsePayload<any>> {
    return this.userRoleSettingService.delete(userRoleSettingId);
  }

  @PermissionCode(DELETE_USER_ROLE_SETTING_PERMISSION.code)
  @AuthorizeMessage(UNAUTHORIZE_KEY.USER_ROLE_UNAUTHORIZE)
  @Delete('user-role-settings/multiple')
  @ApiOperation({
    tags: ['User Role Setting'],
    summary: 'Delete user role setting multiple',
    description: 'Xoa vai tro',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete user role setting successfully',
    type: SuccessResponse,
  })
  public async deleteMultiple(
    @Body() payload: DeleteMultipleUserRoleDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.userRoleSettingService.deleteMulti(request);
  }

  // @MessagePattern(`${NATS_USER}.get_role_setting_by_ids`)
  public async getRoleSettingByIds(
    ids: number[],
  ): Promise<ResponsePayload<UserRoleSetting[]>> {
    return await this.userRoleSettingService.getUserRoleSettingByIds(ids);
  }

  @PermissionCode(CHANGE_STATUS_USER_ROLE_SETTING_PERMISSION.code)
  @AuthorizeMessage(UNAUTHORIZE_KEY.USER_ROLE_UNAUTHORIZE)
  @Put('/user-role-settings/:id/lock')
  @ApiOperation({
    tags: ['User Role Setting'],
    summary: 'Lock User Role Setting',
    description: 'Khóa role',
  })
  @ApiResponse({
    status: 200,
    description: 'Lock User Role Setting Detail successfully',
    type: SuccessResponse,
  })
  public async lock(
    @Param() param: IdParamRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = param;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.userRoleSettingService.updateStatus({
      ...request,
      status: EnumStatus.NO,
    });
  }

  @PermissionCode(CHANGE_STATUS_USER_ROLE_SETTING_PERMISSION.code)
  @AuthorizeMessage(UNAUTHORIZE_KEY.USER_ROLE_UNAUTHORIZE)
  @Put('/user-role-settings/lock/multiple')
  @ApiOperation({
    tags: ['User Role Setting'],
    summary: 'Lock User Role Setting Multiple',
    description: 'Khóa role Multiple',
  })
  @ApiResponse({
    status: 200,
    description: 'Lock User Role Setting Multiple Detail successfully',
    type: SuccessResponse,
  })
  public async lockMultiple(
    @Body() payload: ChangeStatusUserRoleMultiDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.userRoleSettingService.updateStatusMulti({
      ...request,
      status: EnumStatus.NO,
    });
  }

  @PermissionCode(CHANGE_STATUS_USER_ROLE_SETTING_PERMISSION.code)
  @AuthorizeMessage(UNAUTHORIZE_KEY.USER_ROLE_UNAUTHORIZE)
  @Put('/user-role-settings/:id/unlock')
  @ApiOperation({
    tags: ['User Role Setting'],
    summary: 'unlock User Role Setting',
    description: 'Khóa role',
  })
  @ApiResponse({
    status: 200,
    description: 'Unlock User Role Setting Detail successfully',
    type: SuccessResponse,
  })
  public async unlock(
    @Param() param: IdParamRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = param;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.userRoleSettingService.updateStatus({
      ...request,
      status: EnumStatus.YES,
    });
  }

  @PermissionCode(CHANGE_STATUS_USER_ROLE_SETTING_PERMISSION.code)
  @AuthorizeMessage(UNAUTHORIZE_KEY.USER_ROLE_UNAUTHORIZE)
  @Put('/user-role-settings/unlock')
  @ApiOperation({
    tags: ['User Role Setting'],
    summary: 'unlock User Role Setting Multiple',
    description: 'Khóa role Multiple',
  })
  @ApiResponse({
    status: 200,
    description: 'Unlock User Role Setting Multiple Detail successfully',
    type: SuccessResponse,
  })
  public async unlockMultiple(
    @Body() payload: ChangeStatusUserRoleMultiDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.userRoleSettingService.updateStatusMulti({
      ...request,
      status: EnumStatus.YES,
    });
  }
}
