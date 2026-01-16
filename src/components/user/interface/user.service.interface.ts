import { CreateUserRequestDto } from '@components/user/dto/request/create-user.request.dto';
import { ForgotPasswordCheckOtpRequestDto } from '@components/user/dto/request/forgot-password-check-otp.request.dto';
import { ForgotPasswordGenerateRequestDto } from '@components/user/dto/request/forgot-password-generate.request.dto';
import { ForgotPasswordResetPasswordRequestDto } from '@components/user/dto/request/forgot-password-reset-password.request.dto';
import { GetListUserRequestDto } from '@components/user/dto/request/get-list-user.request.dto';
import { UpdateUserRequestDto } from '@components/user/dto/request/update-user.request.dto';
import { ForgotPasswordResponseDto } from '@components/user/dto/response/forgot-password.response.dto';
import { GetListUserResponseDto } from '@components/user/dto/response/get-list-user.response.dto';
import { BaseDto } from '@core/dto/base.dto';
import { DeleteMultipleDto } from '@core/dto/multiple/delete-multiple.dto';
import { ResponsePayload } from '@utils/response-payload';
import { SuccessResponse } from '@utils/success.response.dto';
import { ChangePasswordMeRequestDto } from '../dto/request/change-password-me.request.dto';
import { ChangePasswordRequestDto } from '../dto/request/change-password.request.dto';
import { ChangeStatusNotificationRequestDto } from '../dto/request/change-status-notification.request.dto';
import { DetailUserByUsernameRequestDto } from '../dto/request/detail-user-by-username.request';
import { GetUsersRequestDto } from '../dto/request/get-users-request.dto';
import { SetStatusRequestDto } from '../dto/request/set-status-user.request.dto';
import { UpdateInfoCurrentUserRequestDto } from '../dto/request/update-info-current-user.request.dto';
import { ChangePasswordResponseDto } from '../dto/response/change-password.response.dto';
import { UserResponseDto } from '../dto/response/user.response.dto';
import { ImportUserResultDto } from '../dto/response/import-user-result.response.dto';

export interface UserServiceInterface {
  create(
    request: CreateUserRequestDto,
  ): Promise<ResponsePayload<UserResponseDto | any>>;
  runSeeders(): Promise<void>;
  getListByIds(payload: GetUsersRequestDto): Promise<ResponsePayload<UserResponseDto[]>>;
  remove(id: number): Promise<ResponsePayload<SuccessResponse | any>>;
  getList(
    request: GetListUserRequestDto,
  ): Promise<ResponsePayload<GetListUserResponseDto | any>>;
  getListSync(): Promise<ResponsePayload<GetListUserResponseDto | any>>;
  getDetail(
    id: number,
    withoutExtraInfo?: boolean,
  ): Promise<ResponsePayload<UserResponseDto | any>>;
  update(
    request: UpdateUserRequestDto,
  ): Promise<ResponsePayload<UserResponseDto | any>>;
  changeStatusUserNotification(
    request: ChangeStatusNotificationRequestDto,
  ): Promise<ResponsePayload<UserResponseDto | any>>;
  generateOpt(
    request: ForgotPasswordGenerateRequestDto,
  ): Promise<ResponsePayload<ForgotPasswordResponseDto | any>>;
  testOpt(): Promise<ResponsePayload<ForgotPasswordResponseDto | any>>;
  checkOtp(
    request: ForgotPasswordCheckOtpRequestDto,
  ): Promise<ResponsePayload<ForgotPasswordResponseDto>>;
  forgotPasswordResetPassword(
    request: ForgotPasswordResetPasswordRequestDto,
  ): Promise<ResponsePayload<SuccessResponse>>;
  getListByCondition(condition: any): Promise<ResponsePayload<UserResponseDto[]>>;
  getListByRelations(relation: any): Promise<ResponsePayload<UserResponseDto[]>>;
  changePassword(
    request: ChangePasswordRequestDto,
  ): Promise<ResponsePayload<ChangePasswordResponseDto>>;

  changePasswordMe(request: ChangePasswordMeRequestDto): Promise<ResponsePayload<ChangePasswordResponseDto>>;

  deleteMultiple(request: DeleteMultipleDto): Promise<ResponsePayload<SuccessResponse>>;
  getUsersByRoleCodes(roleCodes?: string[]): Promise<ResponsePayload<UserResponseDto[]>>;
  updateInfoCurrentUser(
    request: UpdateInfoCurrentUserRequestDto,
  ): Promise<ResponsePayload<UserResponseDto>>;
  getInfoCurrentUser(request: BaseDto): Promise<ResponsePayload<UserResponseDto>>;
  getInfoCurrentUserMobile(request: BaseDto): Promise<ResponsePayload<UserResponseDto>>;
  confirm(request: SetStatusRequestDto): Promise<ResponsePayload<SuccessResponse>>;
  reject(request: SetStatusRequestDto): Promise<ResponsePayload<SuccessResponse>>;
  detailByUsername(request: DetailUserByUsernameRequestDto): Promise<ResponsePayload<UserResponseDto>>;
  getUsersByNameKeyword(nameKeyword: string): Promise<ResponsePayload<UserResponseDto[]>>;
}
