import { SendMailForgotPassword } from '@components/mail/dto/request/send-mail.request.dto';
import { MailService } from '@components/mail/mail.service';
import { UserRolePermisisonSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/user-role-permission-setting.repository.interface';
import { UserRoleSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/user-role-setting.repository.interface';
import { UserRoleSettingServiceInterface } from '@components/settings/user-role-setting/interface/user-role-setting.service.interface';
import { CreateUserRequestDto } from '@components/user/dto/request/create-user.request.dto';
import { ForgotPasswordCheckOtpRequestDto } from '@components/user/dto/request/forgot-password-check-otp.request.dto';
import { ForgotPasswordGenerateRequestDto } from '@components/user/dto/request/forgot-password-generate.request.dto';
import { ForgotPasswordResetPasswordRequestDto } from '@components/user/dto/request/forgot-password-reset-password.request.dto';
import { GetListUserRequestDto } from '@components/user/dto/request/get-list-user.request.dto';
import { UpdateUserRequestDto } from '@components/user/dto/request/update-user.request.dto';
import { ForgotPasswordResponseDto } from '@components/user/dto/response/forgot-password.response.dto';
import { GetListUserResponseDto } from '@components/user/dto/response/get-list-user.response.dto';
import { UserResponseDto } from '@components/user/dto/response/user.response.dto';
import { UserRepositoryInterface } from '@components/user/interface/user.repository.interface';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { ConfigService } from '@config/config.service';
import {
  ACTIVE_ENUM,
  DATA_NOT_CHANGE,
  DEFAULT_ROLES,
  SUPER_ADMIN,
} from '@constant/common';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { BaseDto } from '@core/dto/base.dto';
import { DeleteMultipleDto } from '@core/dto/multiple/delete-multiple.dto';
import { UserRolePermissionSettingEntity } from '@entities/user-role-permission-setting/user-role-permission-setting.entity';
import { UserRoleSetting } from '@entities/user-role-setting/user-role-setting.entity';
import { UserRole } from '@entities/user-role/user-role.entity';
import { User } from '@entities/user/user.entity';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiError } from '@utils/api.error';
import { EnumStatus } from '@utils/common';
import { stringFormat } from '@utils/object.util';
import { PagingResponse } from '@utils/paging.response';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { SuccessResponse } from '@utils/success.response.dto';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { first, has, isEmpty, keyBy, map, uniq } from 'lodash';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { DataSource, In, Not } from 'typeorm';
import { ChangePasswordMeRequestDto } from './dto/request/change-password-me.request.dto';
import { ChangePasswordRequestDto } from './dto/request/change-password.request.dto';
import { ChangeStatusNotificationRequestDto } from './dto/request/change-status-notification.request.dto';
import { DetailUserByUsernameRequestDto } from './dto/request/detail-user-by-username.request';
import { GetUsersRequestDto } from './dto/request/get-users-request.dto';
import { SetStatusRequestDto } from './dto/request/set-status-user.request.dto';
import { UpdateInfoCurrentUserRequestDto } from './dto/request/update-info-current-user.request.dto';
import { ChangePasswordResponseDto } from './dto/response/change-password.response.dto';
import { UserSyncResponseDto } from './dto/response/user-sync.response.dto';
import { StatusUserEnum, USER_ROLE_DEFAULT } from './user.constant';
import { TypeEnum } from '@components/auth/auth.constant';

@Injectable()
export class UserService implements UserServiceInterface {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,

    @Inject('UserRoleSettingRepositoryInterface')
    private readonly userRoleSettingRepository: UserRoleSettingRepositoryInterface,

    @Inject('UserRoleSettingServiceInterface')
    private readonly userRoleSettingService: UserRoleSettingServiceInterface,

    @Inject('UserRolePermissionSettingRepositoryInterface')
    private readonly userRolePermissionSettingRepository: UserRolePermisisonSettingRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,
    private readonly mailService: MailService,
    @InjectDataSource()
    private readonly connection: DataSource,
  ) {}

  async getListByRelations(
    relation: any,
  ): Promise<ResponsePayload<UserResponseDto[]>> {
    const users = await this.userRepository.findWithRelations(relation);
    return new ResponseBuilder(users)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build() as any;
  }

  /**
   * generate opt
   * @param request
   * @returns
   */
  public async generateOpt(
    request: ForgotPasswordGenerateRequestDto,
  ): Promise<ResponsePayload<ForgotPasswordResponseDto | any>> {
    const { email } = request;
    const d = new Date();
    const user = await this.userRepository.findOneByCondition({ email: email });

    if (!user) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_NOT_FOUND'),
      ).toResponse();
    }

    const response = {
      email: email,
    };

    const optCode = await this.randomNumber(
      new ConfigService().get('otpMinNumber') || 100000,
      new ConfigService().get('otpMaxNumber') || 999999,
    );

    const timeout = new ConfigService().get('otpTimeout') || 900;
    const expire = new Date(
      new Date().setTime(d.getTime() + parseInt(timeout) * 1000),
    );
    user.otpCode = String(optCode);
    user.expire = expire;

    await this.userRepository.update(user);

    const body = {
      subject: 'OTP CODE',
      template: './forgot-password-generate',
      context: {
        code: optCode,
        timeout: timeout / 60,
      },
    };

    const requestMail = new SendMailForgotPassword();
    requestMail.email = email;
    requestMail.body = body;

    const sendMail = await this.mailService.sendMail(requestMail);

    if (sendMail.statusCode !== ResponseCodeEnum.SUCCESS) {
      return new ApiError(
        ResponseCodeEnum.INTERNAL_SERVER_ERROR,
        await this.i18n.translate('error.SEND_MAIL_FAIL'),
      ).toResponse();
    }

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .withMessage(await this.i18n.translate('message.success'))
      .build();
  }

  /**
   * generate opt
   * @param request
   * @returns
   */
  public async testOpt(): Promise<
    ResponsePayload<ForgotPasswordResponseDto | any>
  > {
    const body = {
      subject: 'OTP CODE',
      template: 'templates/forgot-password-generate',
      context: {
        code: 'test-mail',
        timeout: 600 / 60,
      },
    };

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.success'))
      .build();
  }

  /**
   * check opt user
   * @param request
   * @returns
   */
  public async checkOtp(
    request: ForgotPasswordCheckOtpRequestDto,
  ): Promise<ResponsePayload<ForgotPasswordResponseDto> | any> {
    const { email, code } = request;
    const d = new Date();
    const user = await this.userRepository.findOneByCondition({ email: email });

    if (!user) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_NOT_FOUND'),
      ).toResponse();
    }

    if (code !== user.otpCode) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.OTP_CODE_NOT_CORRECT'),
      ).toResponse();
    }
    if (user.expire < new Date(d.getTime())) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.OTP_CODE_EXPIRED'),
      ).toResponse();
    }

    return new ResponseBuilder({
      email: email,
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.success'))
      .build();
  }

  /**
   * reset password user
   * @param request
   * @returns
   */
  public async forgotPasswordResetPassword(
    request: ForgotPasswordResetPasswordRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { email, password, code } = request;
    const user = await this.userRepository.findOneByCondition({
      email: email,
    });

    if (!user) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_NOT_FOUND'),
      ).toResponse();
    }

    const checkOtp = new ForgotPasswordCheckOtpRequestDto();
    checkOtp.email = email;
    checkOtp.code = code;

    try {
      const otpValid = await this.checkOtp(checkOtp);
      if (otpValid.statusCode !== ResponseCodeEnum.SUCCESS) {
        return otpValid;
      }
      const saltOrRounds = new ConfigService().get('saltOrRounds');
      user.password = await bcrypt.hashSync(password, saltOrRounds);

      await this.userRepository.update(user);

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('message.success'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(error?.message || error)
        .build();
    }
  }

  public async changePasswordMe(
    request: ChangePasswordMeRequestDto,
  ): Promise<ResponsePayload<ChangePasswordResponseDto>> {
    const { oldPassword, password, userId } = request;

    const users = await this.userRepository.findWithRelations({
      where: { id: userId },
      select: ['id', 'code', 'password'],
    });

    if (users.length === 0) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_NOT_FOUND'),
      ).toResponse();
    }
    const user = users[0];
    const isValidOldPassword = await bcrypt.compareSync(
      oldPassword,
      user.password,
    );
    if (!isValidOldPassword) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.OLD_PASSWORD_IS_INCORRECT'),
      ).toResponse() as any;
    }
    try {
      const saltOrRounds = new ConfigService().get('saltOrRounds');
      user.password = await bcrypt.hashSync(password, saltOrRounds);

      await this.userRepository.update({
        id: user.id,
        password: user.password,
      });

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('message.success'))
        .build() as any;
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(error?.message || error)
        .build() as any;
    }
  }

  public async changePassword(
    request: ChangePasswordRequestDto,
  ): Promise<ResponsePayload<ChangePasswordResponseDto | any>> {
    const { email, password, code } = request;
    const users = await this.userRepository.findWithRelations({
      where: { email: email, otpCode: code },
      select: ['id', 'code', 'password'],
    });

    if (users.length === 0) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_NOT_FOUND'),
      ).toResponse();
    }

    const user = first(users);
    try {
      const saltOrRounds = new ConfigService().get('saltOrRounds');
      user.password = await bcrypt.hashSync(password, saltOrRounds);

      await this.userRepository.update({
        id: user.id,
        password: user.password,
        otp_code: null,
        expire: null,
      });

      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(error?.message || error)
        .build();
    }
  }

  private async randomNumber(min: number, max: number): Promise<number> {
    return Math.floor(Math.random() * (max - min)) + Math.floor(min);
  }

  async runSeeders(): Promise<void> {
    const codes = DATA_NOT_CHANGE.DEFAULT_USERS.map((item) => item.code);

    const canRunSeeder = await this.userRepository.findByCondition({
      code: In(codes),
    });
    if (canRunSeeder.length > 0) {
      return;
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.query(
        `TRUNCATE tbl_user_role_settings RESTART IDENTITY CASCADE;`,
      );
      const roleEntities = [];
      for (let i = 0; i < DEFAULT_ROLES.length; i++) {
        const roleEntity = new UserRoleSetting();
        roleEntity.id = DEFAULT_ROLES[i].id;
        roleEntity.name = DEFAULT_ROLES[i].name;
        roleEntity.code = DEFAULT_ROLES[i].code;
        roleEntities.push(roleEntity);
      }

      await queryRunner.manager.save(UserRoleSetting, roleEntities);

      const userRolePermissionSettingsExist =
        await this.userRolePermissionSettingRepository.findAll();

      const dataUserRolePermissionSettings =
        await this.setDataUserRolePermissionSetting();

      if (!isEmpty(userRolePermissionSettingsExist)) {
        await queryRunner.manager.delete(
          UserRolePermissionSettingEntity,
          userRolePermissionSettingsExist,
        );
      }

      await queryRunner.manager.save(
        UserRolePermissionSettingEntity,
        dataUserRolePermissionSettings,
      );

      const userEnities = [];
      const saltOrRounds = new ConfigService().get('saltOrRounds');
      for (let i = 0; i < DATA_NOT_CHANGE.DEFAULT_USERS.length; i++) {
        const userEnity = new User();
        userEnity.id = DATA_NOT_CHANGE.DEFAULT_USERS[i].id;
        userEnity.username = DATA_NOT_CHANGE.DEFAULT_USERS[i].username;
        userEnity.code = DATA_NOT_CHANGE.DEFAULT_USERS[i].code;
        userEnity.password = await bcrypt.hashSync(
          DATA_NOT_CHANGE.DEFAULT_USERS[i].password,
          saltOrRounds,
        );
        userEnity.email = DATA_NOT_CHANGE.DEFAULT_USERS[i].email;
        userEnity.fullName = DATA_NOT_CHANGE.DEFAULT_USERS[i].fullName;
        userEnity.status = ACTIVE_ENUM.ACTIVE;
        userEnities[i] = userEnity;
      }
      await queryRunner.manager.save(User, userEnities);

      const userRoleEnities = [];
      for (let i = 0; i < DATA_NOT_CHANGE.DEFAULT_USERS_ROLES.length; i++) {
        const userRole = new UserRole();
        userRole.userId = DATA_NOT_CHANGE.DEFAULT_USERS_ROLES[i].userId;
        userRole.userRoleId = DATA_NOT_CHANGE.DEFAULT_USERS_ROLES[i].roldId;
        userRoleEnities[i] = userRole;
      }
      await queryRunner.manager.save(UserRole, userRoleEnities);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Create new user
   * @param payload
   * @returns
   */
  public async create(
    payload: CreateUserRequestDto,
  ): Promise<ResponsePayload<UserResponseDto | any>> {
    const { code, email, username } = payload;

    const usernameCondition = { username: username };
    const checkUniqueUsername = await this.checkUniqueUser(usernameCondition);

    if (checkUniqueUsername) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USERNAME_ALREADY_EXISTS'),
      ).toResponse();
    }

    const codeCondition = { code: code };
    const checkUniqueCode = await this.checkUniqueUser(codeCondition);

    if (checkUniqueCode) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.CODE_ALREADY_EXISTS'),
      ).toResponse();
    }

    const emailCondition = { email: email };
    const checkUniqueEmail = await this.checkUniqueUser(emailCondition);

    if (checkUniqueEmail) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.EMAIL_ALREADY_EXISTS'),
      ).toResponse();
    }

    const userEntity = await this.userRepository.createEntity(payload);
    return await this.save(
      userEntity,
      payload,
      'message.defineUser.createSuccess',
    );
  }

  private async save(
    userEntity: User,
    payload: any,
    message?: string,
  ): Promise<ResponsePayload<UserResponseDto> | any> {
    const { orgStructures, factories, userRoleSettings } = payload;
    const isUpdate = userEntity.id !== null;
    const orgStructureIds = [];
    let roleIds = [];
    const factoryIds = [];

    if (!isEmpty(userRoleSettings)) {
      roleIds = uniq(userRoleSettings.map((item) => item.id));

      const roleEntities = await this.userRoleSettingRepository.findByCondition(
        {
          id: In(roleIds),
        },
      );

      if (isEmpty(roleEntities) || roleEntities.length !== roleIds.length) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.USER_ROLE_NOT_FOUND'),
        ).toResponse();
      }
    }

    // TODO: Implement orgStructure logic if needed
    // if (!isEmpty(orgStructures)) {
    //   orgStructureIds = uniq(orgStructures.map((item) => item.id));
    //   const orgStructureEntities =
    //     await this.orgStructureRepository.findByCondition({
    //       id: In(orgStructureIds),
    //     });
    //   if (
    //     isEmpty(orgStructureEntities) ||
    //     orgStructureEntities.length !== orgStructureIds.length
    //   ) {
    //     return new ApiError(
    //       ResponseCodeEnum.BAD_REQUEST,
    //       await this.i18n.translate('error.DEPARTMENT_NOT_FOUND'),
    //     ).toResponse();
    //   }
    //   userEntity.orgStructures = orgStructureEntities;
    // }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.save(userEntity);

      if (!isEmpty(roleIds)) {
        const data = [];
        const userRoleEntities = this.userRepository.createUserRoleEntity(
          user.id,
          userRoleSettings[0].id,
        );
        data.push(userRoleEntities);
        if (isUpdate) {
          await queryRunner.manager.delete(UserRole, {
            userId: user.id,
          });
        }
        user.userRoleSettings = await queryRunner.manager.save(data);
      }

      await queryRunner.commitTransaction();

      const response = plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      });

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate(message || 'message.success'))
        .withData(response)
        .build();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Update User
   */
  public async update(
    payload: UpdateUserRequestDto,
  ): Promise<ResponsePayload<any>> {
    const {
      id,
      fullName,
      dateOfBirth,
      phone,
      email,
      username,
      code,
      status,
      factories,
      orgStructures,
      userRoleSettings,
    } = payload;
    const userEntity = await this.userRepository.findOneById(id);
    if (isEmpty(userEntity)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_NOT_FOUND'),
      ).toResponse();
    }

    if (username) {
      const usernameCondition = { username: username, id: Not(id) };
      const checkUniqueUsername = await this.checkUniqueUser(usernameCondition);

      if (checkUniqueUsername) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.USERNAME_ALREADY_EXISTS'),
        ).toResponse();
      }
    }

    if (code) {
      const codeCondition = { code: code, id: Not(id) };
      const checkUniqueCode = await this.checkUniqueUser(codeCondition);

      if (checkUniqueCode) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.CODE_ALREADY_EXISTS'),
        ).toResponse();
      }
    }

    const emailCondition = { email: email, id: Not(id) };
    const checkUniqueEmail = await this.checkUniqueUser(emailCondition);

    if (checkUniqueEmail) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.EMAIL_ALREADY_EXISTS'),
      ).toResponse();
    }

    if (!isEmpty(userRoleSettings)) {
      const userRoleIds = userRoleSettings.map((i) => i.id);
      const userRoleList = await this.userRoleSettingRepository.findByCondition(
        {
          id: In(userRoleIds),
          status: ACTIVE_ENUM.ACTIVE,
        },
      );

      if (userRoleIds.length !== userRoleList.length) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('statusMessage.BAD_REQUEST'))
          .build();
      }
      userEntity.userRoleSettings = userRoleList;
    }

    userEntity.fullName = fullName || '';
    userEntity.phone = phone || null;
    userEntity.email = email;
    userEntity.dateOfBirth = dateOfBirth || null;
    userEntity.status = status || ACTIVE_ENUM.INACTIVE;
    return await this.save(
      userEntity,
      payload,
      'message.defineUser.updateSuccess',
    );
  }

  public async remove(
    id: number,
  ): Promise<ResponsePayload<SuccessResponse | any>> {
    const user = await this.userRepository.findOneById(id);
    if (isEmpty(user)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_NOT_FOUND'),
      ).toResponse();
    }

    const checkUniqueDataDefault = DATA_NOT_CHANGE.DEFAULT_USERS.filter(
      (item) => item.code === user.code,
    );

    if (checkUniqueDataDefault.length > 0) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.CAN_NOT_DELETE'),
      ).toResponse();
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(User, { id: id });

      await queryRunner.commitTransaction();

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(
          await this.i18n.translate('message.defineUser.deleteSuccess'),
        )
        .build();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    } finally {
      await queryRunner.release();
    }
  }

  async deleteMultiple(
    request: DeleteMultipleDto,
  ): Promise<ResponsePayload<any>> {
    const failIdsList = [];
    const ids = request.ids.split(',').map((id) => parseInt(id));

    const users = await this.userRepository.findByCondition({
      id: In(ids),
    });
    const userIds = users.map((user) => user.id);
    if (users.length !== ids.length) {
      ids.forEach((id) => {
        if (!userIds.includes(id)) failIdsList.push(id);
      });
    }

    const checkUniqueDataDefault = users.filter((user) =>
      DATA_NOT_CHANGE.DEFAULT_USERS.find((item) => item.code === user.code),
    );
    if (checkUniqueDataDefault.length > 0) {
      checkUniqueDataDefault.forEach((user) => {
        failIdsList.push(user.id);
      });
    }

    const validIds = users
      .filter((user) => !failIdsList.includes(user.id))
      .map((user) => user.id);

    try {
      if (!isEmpty(validIds)) {
        await this.userRepository.multipleRemove(validIds);
      }
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_DELETE'))
        .build();
    }

    if (isEmpty(failIdsList))
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
        .build();

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.BAD_REQUEST)
      .withMessage(
        stringFormat(
          await this.i18n.t('error.DELETE_MULTIPLE_FAIL'),
          validIds.length,
          ids.length,
        ),
      )
      .build();
  }

  public async confirm(
    request: SetStatusRequestDto,
  ): Promise<ResponsePayload<SuccessResponse>> {
    const { id } = request;

    const user = await this.userRepository.findOneById(id);

    if (!user) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('statusMessage.NOT_FOUND'))
        .build() as any;
    }

    user.status = StatusUserEnum.ACTIVE;
    const result = await this.userRepository.create(user);
    const response = plainToInstance(UserResponseDto, result, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.changeStatusSuccess'))
      .build() as any;
  }

  public async reject(
    request: SetStatusRequestDto,
  ): Promise<ResponsePayload<SuccessResponse>> {
    const { id } = request;
    const user = await this.userRepository.findOneById(id);

    if (!user) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('statusMessage.NOT_FOUND'))
        .build() as any;
    }
    user.status = StatusUserEnum.INACTIVE;
    const result = await this.userRepository.create(user);
    const response = plainToInstance(UserResponseDto, result, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.changeStatusSuccess'))
      .build() as any;
  }

  /**
   * Get user list
   * @param request
   * @returns
   */
  public async getList(
    payload: GetListUserRequestDto,
  ): Promise<ResponsePayload<GetListUserResponseDto | any>> {
    const { data, count, countTotal, countActive, countInActive, countAzure } =
      await this.userRepository.getListUser(payload);
    let result;

    if (!isEmpty(data) && count !== 0) {
      const users = data.map((user) => ({
        ...user,
      }));

      result = plainToInstance(UserResponseDto, users, {
        excludeExtraneousValues: true,
      });
    }

    return new ResponseBuilder<PagingResponse>({
      items: !isEmpty(result) ? result : [],
      meta: {
        count: count,
        page: payload.page,
        total: countTotal,
        totalActive: countActive,
        totalInActive: countInActive,
        totalAzure: countAzure,
      },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async getListSync(): Promise<
    ResponsePayload<GetListUserResponseDto | any>
  > {
    const data = await this.userRepository.findWithRelations({
      relations: ['userWarehouses'],
      select: ['password', 'id', 'username', 'fullName'],
    });
    const dataReturn = plainToInstance(UserSyncResponseDto, data, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async getDetail(
    id: number,
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    withoutExtraInfo: boolean = true,
  ): Promise<ResponsePayload<UserResponseDto | any>> {
    const dataUser = (await this.userRepository.findOneWithRelations({
      where: { id: id },
      relations: ['userRoles'],
    })) as any;
    if (!dataUser) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_NOT_FOUND'),
      ).toResponse();
    }
    if (dataUser.createdBy) {
      const responseUserService = await this.userRepository.findOneById(
        dataUser.createdBy,
      );
      dataUser.createdBy = responseUserService;
    }

    const userRolesList = await this.userRoleSettingRepository.findAll();

    if (dataUser.code === SUPER_ADMIN.code) {
      dataUser.userRoles = userRolesList.map((v) => {
        return { ...v, userRoleId: v.id };
      });
    } else {
      const userRolesListMap = keyBy(userRolesList, 'id');
      if (dataUser.userRoles.length) {
        dataUser.userRoles = dataUser.userRoles.map((v) => {
          return {
            ...v,
            userRoleName: userRolesListMap[v.userRoleId].name,
          };
        });
      }
    }

    if (!withoutExtraInfo) {
      const userPermissions =
        await this.userRoleSettingService.getPermissionByUser(
          map(dataUser.userRoles, 'userRoleId'),
        );

      dataUser.userPermissions = userPermissions;
    }
    dataUser.factoryIds = map(dataUser.factories, 'id');
    dataUser.userRoleIds = map(dataUser.userRoles, 'userRoleId');
    const dataReturn = plainToInstance(UserResponseDto, dataUser, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(dataReturn)
      .build();
  }

  public async detailByUsername(
    request: DetailUserByUsernameRequestDto,
  ): Promise<ResponsePayload<UserResponseDto | any>> {
    const dataUser = await this.userRepository.findOneByCondition({
      username: request.username,
    });
    if (!dataUser) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_NOT_FOUND'),
      ).toResponse();
    }

    return new ResponseBuilder(dataUser)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(dataUser)
      .build();
  }

  private async checkUniqueUser(condition: any): Promise<boolean> {
    const user = await this.userRepository.checkUniqueUser(condition);

    return user.length > 0;
  }

  private async validateUser(payload: CreateUserRequestDto): Promise<boolean> {
    const { factories, userWarehouses, userRoleSettings } = payload;

    if (!isEmpty(userWarehouses)) {
      const warehouseIds = uniq(
        userWarehouses.map((warehouse) => warehouse.id),
      );
      const warehouseEntities = null;

      if (
        isEmpty(warehouseEntities) ||
        warehouseEntities.length !== warehouseIds.length
      ) {
        throw new Error(await this.i18n.translate('error.WAREHOUSE_NOT_FOUND'));
      }
    }

    return false;
  }

  /**
   * Get list from other services
   * @param payload
   * @returns
   */
  public async getListByIds(
    payload: GetUsersRequestDto,
  ): Promise<ResponsePayload<UserResponseDto[]>> {
    const data = await this.userRepository.findWithRelations({
      where: {
        id: In(payload.userIds),
      },
      relations: [
        'userRoles',
        'userWarehouses',
        'userDepartments',
        'departmentSettings',
        'factories',
        'company',
      ],
    });

    if (!data.length) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .build() as any;
    }

    return new ResponseBuilder(data)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build() as any;
  }

  async getListByCondition(
    condition: any,
  ): Promise<ResponsePayload<UserResponseDto[]>> {
    let users = [];
    if (typeof condition === 'string')
      users = await this.userRepository.getUsersByCondition(condition);
    else users = await this.userRepository.findByCondition(condition);
    return new ResponseBuilder(users)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async getUsersByRoleCodes(
    roleCodes?: string[],
  ): Promise<ResponsePayload<UserResponseDto[]>> {
    const data = await this.userRepository.getUserNotInRoleCodes(roleCodes);

    if (isEmpty(data)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .build() as any;
    }

    return new ResponseBuilder(data)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build() as any;
  }

  public async changeStatusUserNotification(
    payload: ChangeStatusNotificationRequestDto,
  ): Promise<ResponsePayload<UserResponseDto>> {
    const { id, statusNotification } = payload;
    const userEntity = await this.userRepository.findOneById(id);
    if (isEmpty(userEntity)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_NOT_FOUND'),
      ).toResponse() as any;
    }

    userEntity.statusNotification = statusNotification;
    return await this.save(userEntity, payload);
  }

  public async updateInfoCurrentUser(
    request: UpdateInfoCurrentUserRequestDto,
  ): Promise<ResponsePayload<UserResponseDto | any>> {
    const { userId, phone, dateOfBirth } = request;
    const user = await this.userRepository.findOneById(userId);
    if (isEmpty(user)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_NOT_FOUND'),
      ).toResponse() as any;
    }
    user.phone = phone;
    user.dateOfBirth = dateOfBirth;
    await this.userRepository.update(user);

    const response = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
      .build() as any;
  }

  public async getInfoCurrentUser(
    request: BaseDto,
  ): Promise<ResponsePayload<UserResponseDto>> {
    const { userId } = request;
    try {
      return await this.getDetail(userId, false);
    } catch (error) {
      this.logger.error('GET ME ERROR:', error);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(
          await this.i18n.translate('statusMessage.INTERNAL_SERVER_ERROR'),
        )
        .build() as any;
    }
  }

  public async getInfoCurrentUserMobile(
    request: BaseDto,
  ): Promise<ResponsePayload<UserResponseDto>> {
    const { code } = request;
    try {
      // TODO: Implement profile custom logic if needed
      // const pro = await this.profileCustomRepository.findOneByCondition({
      //   code: Equal(code)
      // });
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData({
          code: code,
          fullname: '',
          email: '',
        })
        .build() as any;
    } catch (error) {
      this.logger.error('GET ME ERROR:', error);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(
          await this.i18n.translate('statusMessage.INTERNAL_SERVER_ERROR'),
        )
        .build() as any;
    }
  }

  async getUsersByNameKeyword(
    nameKeyword: string,
  ): Promise<ResponsePayload<UserResponseDto[]>> {
    const users = await this.userRepository.findUsersByNameKeyword(nameKeyword);
    const dataReturn = plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
      .build() as any;
  }

  private async setDataUserRolePermissionSetting(): Promise<
    UserRolePermissionSettingEntity[]
  > {
    const DataUserRolePermissionSetting = [];
    USER_ROLE_DEFAULT.forEach((item) => {
      DataUserRolePermissionSetting.push(
        ...item.listPers.map((record) => ({
          permissionSettingCode: record,
          userRoleId: item.roldId,
          status: EnumStatus.YES,
        })),
      );
    });
    return DataUserRolePermissionSetting;
  }

  async import(data: any, userId: number): Promise<ResponsePayload<any>> {
    const userEntitys: any[] = [];
    const dataCreate: any[] = [];
    const dataEdit: any[] = [];
    let result: any[] = [];
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      if (
        element.action ===
        (await this.i18n.translate('import.common.add')).toLocaleLowerCase()
      ) {
        delete element.action;
        dataCreate.push(element);
      }
      if (
        element.action ===
        (await this.i18n.translate('import.common.edit')).toLocaleLowerCase()
      ) {
        delete element.action;
        dataEdit.push(element);
      }
    }
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();

    // create
    if (dataCreate.length > 0) {
      const listCode = dataCreate.map((i) => {
        return i.code;
      });
      const listUserName = dataCreate.map((i) => {
        return i.userName;
      });
      const listEmail = dataCreate.map((i) => {
        return i.email;
      });
      const users = await this.userRepository.findByCondition([
        { code: In(listCode) },
        { username: In(listUserName) },
        { email: In(listEmail) },
      ]);
      const userMapCode = keyBy(users, 'code');
      const userMapUserName = keyBy(users, 'username');
      const userMapEmail = keyBy(users, 'email');
      if (users.length > 0) {
        for (let i = 0; i < dataCreate.length; i++) {
          const data = dataCreate[i];
          if (
            has(userMapCode, data.code) ||
            has(userMapUserName, data.userName)
          ) {
            return new ResponseBuilder()
              .withCode(ResponseCodeEnum.BAD_REQUEST)
              .withMessage(
                await this.i18n.translate('error.CODE_OR_NAME_ALREADY_EXISTS'),
              )
              .build();
          }
          if (has(userMapEmail, data.email)) {
            return new ResponseBuilder()
              .withCode(ResponseCodeEnum.BAD_REQUEST)
              .withMessage(
                await this.i18n.translate('error.EMAIL_ALREADY_EXISTS'),
              )
              .build();
          }
        }
      }
      for (let i = 0; i < dataCreate.length; i++) {
        const user = dataCreate[i];
        const userDto = new CreateUserRequestDto();
        userDto.code = user.code;
        userDto.username = user.userName;
        userDto.fullName = user.fullName;
        userDto.password = user.password;
        if (user.dateOfBirth) userDto.dateOfBirth = new Date(user.dateOfBirth);
        userDto.email = user.email;
        userDto.phone = user.phone;
        userDto.status =
          user.status === (await this.i18n.translate('import.common.active'))
            ? ACTIVE_ENUM.ACTIVE
            : ACTIVE_ENUM.INACTIVE;
        userDto.userId = userId;

        const userCreate = await this.userRepository.createEntity(userDto);

        // Factory feature removed - no longer needed

        if (user.orgStructureIds) {
          const orgStructureIds = user.orgStructureIds?.split(',');
          if (orgStructureIds.includes(NaN)) {
            return new ResponseBuilder()
              .withCode(ResponseCodeEnum.BAD_REQUEST)
              .withMessage(
                await this.i18n.translate(
                  'error.IMPORT_FIELD_TYPE_TEMPLATE_ERROR',
                  {
                    args: {
                      field: await this.i18n.translate(
                        'import.user.orgStructureIds',
                      ),
                    },
                  },
                ),
              )
              .build();
          }
          // TODO: Implement orgStructure logic if needed
          // const orgStructureList =
          //   await this.orgStructureRepository.findByCondition({
          //     code: In(orgStructureIds),
          //     isActive: ACTIVE_ENUM.ACTIVE,
          //   });
          // if (orgStructureIds.length !== orgStructureList.length) {
          //   return new ResponseBuilder()
          //     .withCode(ResponseCodeEnum.BAD_REQUEST)
          //     .withMessage(
          //       await this.i18n.translate('import.error.codeOrgInvalid'),
          //     )
          //     .build();
          // }
          // userCreate.orgStructures = orgStructureList;
        }

        if (user.userRoleIds) {
          const userRoleIds = user.userRoleIds?.split(',');
          if (userRoleIds.includes(NaN)) {
            return new ResponseBuilder()
              .withCode(ResponseCodeEnum.BAD_REQUEST)
              .withMessage(
                await this.i18n.translate(
                  'error.IMPORT_FIELD_TYPE_TEMPLATE_ERROR',
                  {
                    args: {
                      field: await this.i18n.translate(
                        'import.user.userRoleIds',
                      ),
                    },
                  },
                ),
              )
              .build();
          }
          const userRoleList =
            await this.userRoleSettingRepository.findByCondition({
              code: In(userRoleIds),
              status: ACTIVE_ENUM.ACTIVE,
            });

          if (userRoleIds.length !== userRoleList.length) {
            return new ResponseBuilder()
              .withCode(ResponseCodeEnum.BAD_REQUEST)
              .withMessage(
                await this.i18n.translate('import.error.codeRoleInvalid'),
              )
              .build();
          }
          const userRes = await queryRunner.manager.save(userCreate);
          const userRoleEntities = this.userRepository.createUserRoleEntity(
            userRes.id,
            userRoleList[0].id,
          );
          await queryRunner.manager.save(userRoleEntities);
        }
      }
    }

    // edit
    if (dataEdit.length > 0) {
      const dataMapCode = keyBy(dataEdit, 'code');
      const dataMapName = keyBy(dataEdit, 'userName');
      const dataMapEmail = keyBy(dataEdit, 'email');
      const listCode = dataEdit.map((i) => {
        return i.code;
      });
      const listUserName = dataCreate.map((i) => {
        return i.userName;
      });
      const listEmail = dataCreate.map((i) => {
        return i.email;
      });
      const users = await this.userRepository.findByCondition([
        { code: In(listCode) },
        { username: In(listUserName) },
        { email: In(listEmail) },
      ]);
      const userMapCode = keyBy(users, 'code');
      const userMapName = keyBy(users, 'username');
      const userMapEmail = keyBy(users, 'email');
      for (let i = 0; i < dataEdit.length; i++) {
        const data = dataEdit[i];
        if (!has(userMapCode, data.code) && !has(userMapName, data.userName)) {
          return new ResponseBuilder()
            .withCode(ResponseCodeEnum.BAD_REQUEST)
            .withMessage(
              await this.i18n.translate(
                'import.error.codeAnduserNameAndEmailNotMap',
              ),
            )
            .build();
        } else {
          let userUpdate;
          let userDto;
          if (has(userMapCode, data.code)) {
            userUpdate = userMapCode[data.code];
            userDto = dataMapCode[data.code];
          } else if (has(userMapName, data.userName)) {
            userUpdate = userMapName[data.userName];
            userDto = dataMapName[data.userName];
          } else {
            userUpdate = userMapEmail[data.email];
            userDto = dataMapName[data.email];
          }
          if (
            userUpdate.username !== data.userName ||
            userUpdate.code !== data.code
          ) {
            return new ResponseBuilder()
              .withCode(ResponseCodeEnum.BAD_REQUEST)
              .withMessage(
                await this.i18n.translate('import.error.codeAnduserNameNotMap'),
              )
              .build();
          }
          if (
            has(userMapEmail, data.email) &&
            userDto.email !== userUpdate.email
          ) {
            return new ResponseBuilder()
              .withCode(ResponseCodeEnum.BAD_REQUEST)
              .withMessage(
                await this.i18n.translate('error.EMAIL_ALREADY_EXISTS'),
              )
              .build();
          }
          userUpdate.fullName = userDto.fullName;
          userUpdate.phone = userDto.phone ? userDto.phone : null;
          if (userUpdate.type !== TypeEnum.AZURE)
            userUpdate.email = userDto.email;
          userUpdate.dateOfBirth = userDto.dateOfBirth
            ? new Date(userDto.dateOfBirth)
            : null;
          userUpdate.status =
            userDto.status ===
            (await this.i18n.translate('import.common.active'))
              ? ACTIVE_ENUM.ACTIVE
              : ACTIVE_ENUM.INACTIVE;

          if (userDto.userRoleIds) {
            const userRoleIds = userDto.userRoleIds?.split(',');
            const userRoleList =
              await this.userRoleSettingRepository.findByCondition({
                code: In(userRoleIds),
                status: ACTIVE_ENUM.ACTIVE,
              });

            if (userRoleIds.length !== userRoleList.length) {
              return new ResponseBuilder()
                .withCode(ResponseCodeEnum.BAD_REQUEST)
                .withMessage(
                  await this.i18n.translate('statusMessage.BAD_REQUEST'),
                )
                .build();
            }
            const userRoleEntities = this.userRepository.createUserRoleEntity(
              userUpdate.id,
              userRoleList[0].id,
            );
            await queryRunner.manager.delete(UserRole, {
              userId: userUpdate.id,
            });
            await queryRunner.manager.save(userRoleEntities);
          }
          userEntitys.push(userUpdate);
        }
      }
    }

    try {
      result = await queryRunner.manager.save(userEntitys);
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
      .build();
  }
}
