import { CreateUserRequestDto } from '@components/user/dto/request/create-user.request.dto';
import { ForgotPasswordCheckOtpRequestDto } from '@components/user/dto/request/forgot-password-check-otp.request.dto';
import { ForgotPasswordGenerateRequestDto } from '@components/user/dto/request/forgot-password-generate.request.dto';
import { ForgotPasswordResetPasswordRequestDto } from '@components/user/dto/request/forgot-password-reset-password.request.dto';
import { GetListUserRequestDto } from '@components/user/dto/request/get-list-user.request.dto';
import { UpdateUserBodyDto } from '@components/user/dto/request/update-user.request.dto';
import { ForgotPasswordResponseDto } from '@components/user/dto/response/forgot-password.response.dto';
import { GetListUserResponseDto } from '@components/user/dto/response/get-list-user.response.dto';
import { UserResponseDto } from '@components/user/dto/response/user.response.dto';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { UNAUTHORIZE_KEY } from '@constant/common';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { PermissionCode } from '@core/decorator/get-code.decorator';
import { AuthorizeMessage } from '@core/decorator/set-authorize-message';
import { Public } from '@core/decorator/set-public.decorator';
import { BaseDto } from '@core/dto/base.dto';
import { DeleteMultipleDto } from '@core/dto/multiple/delete-multiple.dto';
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
import isEmpty from '@utils/helper';
import {
  CONFIRM_USER_PERMISSION,
  CREATE_USER_PERMISSION,
  DELETE_USER_PERMISSION,
  DETAIL_USER_PERMISSION,
  LIST_USER_PERMISSION,
  REJECT_USER_PERMISSION,
  SEARCH_USER_PERMISSION,
  UPDATE_USER_PERMISSION,
} from '@utils/permissions/user';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { SuccessResponse } from '@utils/success.response.dto';
import { ChangePasswordMeRequestDto } from './dto/request/change-password-me.request.dto';
import { ChangePasswordRequestDto } from './dto/request/change-password.request.dto';
import { ChangeStatusNotificationBodyDto } from './dto/request/change-status-notification.request.dto';
import { GetUsersRequestDto } from './dto/request/get-users-request.dto';
import { SetStatusRequestDto } from './dto/request/set-status-user.request.dto';
import { UpdateInfoCurrentUserRequestDto } from './dto/request/update-info-current-user.request.dto';
import { ChangePasswordResponseDto } from './dto/response/change-password.response.dto';
import { TypeEnum } from '@components/auth/auth.constant';

@AuthorizeMessage(UNAUTHORIZE_KEY.USER_MESSAGE_UNAUTHORIZE)
@Controller('users')
export class UserController {
  constructor(
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
  ) {}

  @Get('ping')
  public async get(): Promise<any> {
    return new ResponseBuilder('PONG')
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  @PermissionCode(CREATE_USER_PERMISSION.code)
  @Post('create')
  @ApiOperation({
    tags: ['User'],
    summary: 'Register User',
    description: 'Register User',
  })
  @ApiResponse({
    status: 200,
    description: 'Register successfully',
    type: UserResponseDto,
  })
  public async register(
    @Body() data: CreateUserRequestDto,
  ): Promise<ResponsePayload<UserResponseDto | any>> {
    const { request, responseError } = data;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.create({
      ...request,
      type: request.type || TypeEnum.SYSTEM,
    });
  }

  @PermissionCode(DELETE_USER_PERMISSION.code)
  @Delete('/:id')
  @ApiOperation({
    tags: ['User'],
    summary: 'Delete User',
    description: 'Delete User',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete successfully',
    type: SuccessResponse,
  })
  public async delete(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ResponsePayload<SuccessResponse | any>> {
    return await this.userService.remove(id);
  }

  @PermissionCode(DELETE_USER_PERMISSION.code)
  @Delete('/multiple')
  @ApiOperation({
    tags: ['User'],
    summary: 'Delete multiple User',
    description: 'Delete multiple User',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete successfully',
    type: SuccessResponse,
  })
  public async deleteMultiple(
    @Query() payload: DeleteMultipleDto,
  ): Promise<ResponsePayload<SuccessResponse | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.userService.deleteMultiple(request);
  }

  @PermissionCode(UPDATE_USER_PERMISSION.code)
  @Put('/:id')
  @ApiOperation({
    tags: ['User'],
    summary: 'Update User',
    description: 'Update User',
  })
  @ApiResponse({
    status: 200,
    description: 'Update successfully',
    type: UserResponseDto,
  })
  public async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: UpdateUserBodyDto,
  ): Promise<ResponsePayload<UserResponseDto | any>> {
    const { request, responseError } = body;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.update({ ...request, id });
  }

  @PermissionCode(UPDATE_USER_PERMISSION.code)
  @Put('/:id/change-status-notification')
  @ApiOperation({
    tags: ['User'],
    summary: 'Change status notification',
    description: 'Change status notification',
  })
  @ApiResponse({
    status: 200,
    description: 'Change status successfully',
    type: UserResponseDto,
  })
  public async changeStatusUserNotification(
    @Body()
    data: ChangeStatusNotificationBodyDto,
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ResponsePayload<UserResponseDto | any>> {
    const { request, responseError } = data;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.id = id;
    return await this.userService.changeStatusUserNotification(request);
  }

  public async getWarehouseByIds(
    @Body() payload: GetUsersRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.getListByIds(request);
  }

  @PermissionCode(LIST_USER_PERMISSION.code, SEARCH_USER_PERMISSION.code)
  @Get('/list')
  @ApiOperation({
    tags: ['User'],
    summary: 'List User',
    description: 'List User',
  })
  @ApiResponse({
    status: 200,
    description: 'List successfully',
    type: GetListUserResponseDto,
  })
  public async getList(
    @Query() requests: GetListUserRequestDto,
  ): Promise<ResponsePayload<GetListUserResponseDto | any>> {
    const { request, responseError } = requests;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.getList(request);
  }

  @Get('/me')
  @ApiOperation({
    tags: ['App', 'Users'],
    summary: 'Env',
    description: 'Lấy dữ liệu người dùng',
  })
  @ApiResponse({
    status: 200,
  })
  public async getInfoCurrentUser(
    @Query() query: BaseDto,
  ): Promise<ResponsePayload<UserResponseDto>> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.userService.getInfoCurrentUser(request);
  }

  @Get('/me-mobile')
  @ApiOperation({
    tags: ['App', 'Users'],
    summary: 'Env',
    description: 'Lấy dữ liệu người dùng',
  })
  @ApiResponse({
    status: 200,
  })
  public async getInfoCurrentUserMobile(
    @Query() query: BaseDto,
  ): Promise<ResponsePayload<UserResponseDto>> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.userService.getInfoCurrentUserMobile(request);
  }

  @PermissionCode(DETAIL_USER_PERMISSION.code)
  @Get('/:id')
  public async detail(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ResponsePayload<UserResponseDto | any>> {
    return await this.userService.getDetail(id, false);
  }

  // @MessagePattern('list_sync')
  @Get('/list-sync')
  @ApiOperation({
    tags: ['User'],
    summary: 'List User',
    description: 'List User',
  })
  @ApiResponse({
    status: 200,
    description: 'List successfully',
    type: GetListUserResponseDto,
  })
  public async getListSync(): // request: BaseDto,
  Promise<ResponsePayload<GetListUserResponseDto | any>> {
    return await this.userService.getListSync();
  }

  @PermissionCode(CONFIRM_USER_PERMISSION.code)
  @Put('/:id/confirm')
  @ApiOperation({
    tags: ['User'],
    summary: 'Confirm User',
    description: 'Xác nhận người dùng',
  })
  @ApiResponse({
    status: 200,
    description: 'Confirm successfully',
    type: UserResponseDto,
  })
  public async confirm(
    @Param() payload: SetStatusRequestDto,
  ): Promise<ResponsePayload<SuccessResponse>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.confirm(request);
  }

  @PermissionCode(REJECT_USER_PERMISSION.code)
  @Put('/:id/reject')
  @ApiOperation({
    tags: ['User'],
    summary: 'Reject User',
    description: 'Từ chối người dùng',
  })
  @ApiResponse({
    status: 200,
    description: 'Reject successfully',
    type: UserResponseDto,
  })
  public async reject(
    @Param() payload: SetStatusRequestDto,
  ): Promise<ResponsePayload<SuccessResponse>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.reject(request);
  }

  @Public()
  @Get('/seeders/nagf8gCudw=2313ndnkfjy24091u30932gsjknkjn2i3y1293820k,cn,')
  public async runSeeders(): Promise<void> {
    return await this.userService.runSeeders();
  }

  @Public()
  @Post('/forgot-password/generate')
  @ApiOperation({
    tags: ['User'],
    summary: 'Generate opt code',
    description: 'tạo opt code',
  })
  @ApiResponse({
    status: 200,
    description: 'Generate opt code successfully',
    type: ForgotPasswordResponseDto,
  })
  public async forgotPasswordGenerate(
    @Body() payload: ForgotPasswordGenerateRequestDto,
  ): Promise<ResponsePayload<ForgotPasswordResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.userService.generateOpt(request);
  }

  @Public()
  @Get('/forgot-password/test')
  @ApiOperation({
    tags: ['User'],
    summary: 'Generate opt code',
    description: 'tạo opt code',
  })
  @ApiResponse({
    status: 200,
    description: 'Generate opt code successfully',
    type: ForgotPasswordResponseDto,
  })
  public async testPasswordGenerate(): Promise<
    ResponsePayload<ForgotPasswordResponseDto | any>
  > {
    return await this.userService.testOpt();
  }

  @Public()
  @Post('/forgot-password/otp')
  @ApiOperation({
    tags: ['User'],
    summary: 'Check opt code',
    description: 'kiểm tra opt code',
  })
  @ApiResponse({
    status: 200,
    description: 'Check opt code successfully',
    type: ForgotPasswordResponseDto,
  })
  public async forgotPasswordCheckOtp(
    @Body() payload: ForgotPasswordCheckOtpRequestDto,
  ): Promise<ResponsePayload<ForgotPasswordResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.userService.checkOtp(request);
  }

  // @MessagePattern('forgot_password_reset_password')
  @Public()
  @Post('/forgot-password/password')
  @ApiOperation({
    tags: ['User'],
    summary: 'Reset password',
    description: 'Thay đổi password',
  })
  @ApiResponse({
    status: 200,
    description: 'Reset password successfully',
    type: SuccessResponse,
  })
  public async forgotPasswordResetPassword(
    @Body() payload: ForgotPasswordResetPasswordRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.forgotPasswordResetPassword(request);
  }

  @Public()
  @Put('/change-password')
  @ApiOperation({
    tags: ['User'],
    summary: 'Change password',
    description: 'Thay đổi password',
  })
  @ApiResponse({
    status: 200,
    description: 'Change password successfully',
    type: ChangePasswordResponseDto,
  })
  public async changePassword(
    @Body() payload: ChangePasswordRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.changePassword(request);
  }

  @Put('/change-password-me')
  @ApiOperation({
    tags: ['User'],
    summary: 'Change password',
    description: 'Thay đổi password',
  })
  @ApiResponse({
    status: 200,
    description: 'Change password successfully',
    type: ChangePasswordResponseDto,
  })
  public async changePasswordMe(
    @Body() payload: ChangePasswordMeRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.userService.changePasswordMe(request);
  }

  @Put('me')
  @ApiOperation({
    tags: ['User'],
    summary: 'Update Current User',
    description: 'Update Current User',
  })
  @ApiResponse({
    status: 200,
    description: 'Update successfully',
    type: UserResponseDto,
  })
  public async updateInfoCurrentUser(
    @Body() body: UpdateInfoCurrentUserRequestDto,
  ): Promise<ResponsePayload<GetListUserResponseDto | any>> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.updateInfoCurrentUser(request);
  }
}
