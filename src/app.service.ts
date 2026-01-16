import { UserRoleSettingCronService } from '@components/settings/user-role-setting/user-role-setting.cron.service';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Injectable } from '@nestjs/common';
import { INSERT_PERMISSION } from '@utils/permissions/permission';
import { ResponseBuilder } from '@utils/response-builder';

@Injectable()
export class AppService {
  constructor(
    private readonly userRoleSettingService: UserRoleSettingCronService,
  ) {}
  async onModuleInit() {
    await this.updatePermissions();
  }

  getHello(): string {
    return 'Hello World!';
  }

  getHealth(): any {
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('This is DKT-Report-service')
      .build();
  }

  private async updatePermissions() {
    let status = false;
    let number = 1;
    do {
      try {
        const responseInsert =
          await this.userRoleSettingService.insertPermissionAndUserRole(
            INSERT_PERMISSION,
          );
        const responseDelete =
          await this.userRoleSettingService.deletePermissionNotActive();
        if (
          responseInsert.statusCode === ResponseCodeEnum.SUCCESS &&
          responseDelete.statusCode === ResponseCodeEnum.SUCCESS
        ) {
          status = true;
        } else {
          number++;
          setTimeout(function () {
            console.log('ERRROR_CHECK_PERMISSION');
          }, 5000);
        }
      } catch (err) {
        number++;
        setTimeout(function () {
          console.error(err);

          console.log('ERRROR_CHECK_PERMISSION');
        }, 5000);
      }
    } while (!status && number < 6);
  }
}
