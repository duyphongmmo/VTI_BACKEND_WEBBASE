import { Controller, Inject } from '@nestjs/common';
import { MailService } from './mail.service';
import { I18nService } from 'nestjs-i18n';
import { UserRoleSettingServiceInterface } from '@components/settings/user-role-setting/interface/user-role-setting.service.interface';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,

    @Inject('UserRoleSettingServiceInterface')
    private readonly userRoleSettingService: UserRoleSettingServiceInterface,

    private readonly i18n: I18nService,
  ) {}
}
