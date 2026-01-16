import { CheckUserPermissionRequestDto } from '@components/settings/user-role-setting/dto/request/check-user-permission.request.dto';
import { CreateUserPermissionRequestDto } from '@components/settings/user-role-setting/dto/request/create-user-permission.request.dto';
import { CreateUserRoleSettingRequestDto } from '@components/settings/user-role-setting/dto/request/create-user-role-setting.request.dto';
import { DeleteRequestDto } from '@components/settings/user-role-setting/dto/request/delete.request.dto';
import { FinalCheckUserPermissionRequestDto } from '@components/settings/user-role-setting/dto/request/final-check-user-permission.request.dto';
import { GetPermissionIdRequestDto } from '@components/settings/user-role-setting/dto/request/get-permission-id.request.dto';
import { PermissionForListRequestDto } from '@components/settings/user-role-setting/dto/request/permission-for-list.request.dto';
import { CreateUserPermissionResponseDto } from '@components/settings/user-role-setting/dto/response/create-user-permission.response.dto';
import { CreateUserRoleSettingResponseDto } from '@components/settings/user-role-setting/dto/response/create-user-role-setting.response.dto';
import { DeleteSuccessfullyResponseDto } from '@components/settings/user-role-setting/dto/response/delete-successfully.response.dto';
import { GetPermissionIdResponseDto } from '@components/settings/user-role-setting/dto/response/get-permission-id.response.dto';
import { ResponsePayload } from '@utils/response-payload';
import { GetListUserRoleSettingRequestDto } from '../dto/request/get-list-user-role-setting.request.dto';
import { GetPermissionByConditionRequestDto } from '../dto/request/get-permission-by-condition.request.dto';
import { GroupPermissionByRoleIdRequestDto } from '../dto/request/group-permission-by-role-id.request.dto';
import { UpdateStatusUserRoleSettingRequestDto } from '../dto/request/update-status-user-role-setting.request';
import { UpdateUserRolePermissionRequestDto } from '../dto/request/update-user-role-permission.request.dto';
import { GetListRolePermissionOfDepartmentResponseDto } from '../dto/response/get-list-role-permission-department.response.dto';
import { UpdateUserRoleSettingRequestDto } from './../dto/request/update-user-role-setting.request';
import { ChangeStatusUserRoleMultiDto } from '../dto/request/change-status-user-role-multiple.request.dto';
import { EnumStatus } from '@utils/common';
import { DeleteMultipleUserRoleDto } from '../dto/request/delete-multiple.request.dto';
import { UserPermissionResponseDto } from '../dto/response/user-permission.response.dto';
import { UserRoleSetting } from '@entities/user-role-setting/user-role-setting.entity';
import { SuccessResponse } from '@utils/success.response.dto';

export interface UserRoleSettingServiceInterface {
  createUserRole(
    request: CreateUserRoleSettingRequestDto,
  ): Promise<ResponsePayload<CreateUserRoleSettingResponseDto | any>>;
  getAllUserRole(request?: any): Promise<ResponsePayload<UserRoleSetting[]>>;
  setUserPermission(
    request: CreateUserPermissionRequestDto,
  ): Promise<ResponsePayload<CreateUserPermissionResponseDto>>;
  checkUserPermission(request: CheckUserPermissionRequestDto): Promise<ResponsePayload<boolean>>;
  checkUserPermissionForList(
    request: PermissionForListRequestDto,
  ): Promise<ResponsePayload<any>>;
  finalCheckUserPermission(
    request: FinalCheckUserPermissionRequestDto,
  ): Promise<ResponsePayload<boolean>>;
  deletePermission(
    request: DeleteRequestDto,
  ): Promise<ResponsePayload<DeleteSuccessfullyResponseDto>>;
  getAllGroupPermission(request: any): Promise<ResponsePayload<any>>;
  getPermissionIdByCode(
    condition: GetPermissionIdRequestDto,
  ): Promise<ResponsePayload<GetPermissionIdResponseDto>>;
  getPermissionCodeByName(request: string): Promise<ResponsePayload<string>>;
  getPermissionByUser(userRoleIds: number[], status?: number): Promise<ResponsePayload<UserPermissionResponseDto[]>>;
  insertPermission(permisions): Promise<ResponsePayload<SuccessResponse>>;
  deletePermissionNotActive(): Promise<ResponsePayload<SuccessResponse>>;
  getPermissionsByCondition(
    request: GetPermissionByConditionRequestDto,
  ): Promise<ResponsePayload<GetListRolePermissionOfDepartmentResponseDto>>;
  getList(request: GetListUserRoleSettingRequestDto): Promise<ResponsePayload<any>>;
  updateUserPermission(
    request: UpdateUserRolePermissionRequestDto,
  ): Promise<ResponsePayload<SuccessResponse>>;
  delete(userRoleId: number): Promise<ResponsePayload<SuccessResponse>>;
  update(
    userRoleId: number,
    request: UpdateUserRoleSettingRequestDto,
  ): Promise<ResponsePayload<UserRoleSetting>>;
  getDetail(userRoleId: number): Promise<ResponsePayload<UserRoleSetting>>;
  getUserRoleSettingByIds(ids: number[]): Promise<ResponsePayload<UserRoleSetting[]>>;
  updateStatus(request: UpdateStatusUserRoleSettingRequestDto): Promise<ResponsePayload<SuccessResponse>>;
  getListPermissionWithGroup(
    request: GroupPermissionByRoleIdRequestDto,
  ): Promise<ResponsePayload<any>>;
  updateStatusMulti(
    request: ChangeStatusUserRoleMultiDto & { status: EnumStatus },
  ): Promise<ResponsePayload<SuccessResponse>>;
  deleteMulti(request: DeleteMultipleUserRoleDto): Promise<ResponsePayload<SuccessResponse>>;
}
