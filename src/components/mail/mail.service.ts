import { SendMailForgotPassword } from '@components/mail/dto/request/send-mail.request.dto';
import { BINARY_ENUM } from '@constant/common';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { SuccessResponse } from '@utils/success.response.dto';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { I18nService } from 'nestjs-i18n';
import * as path from 'path';
import { firstValueFrom } from 'rxjs';
import { MailHistoryRepositoryInterface } from './interface/mail-history.repository.interface';
import { MailServiceInterface } from './interface/mail.service.interface';
import { MAIL_TEMPLATE_FORGET_PASSWORD_FILE } from './mail.constant';

@Injectable()
export class MailService implements MailServiceInterface {
  constructor(
    @Inject('MailHistoryRepositoryInterface')
    private readonly mailHistoryRepository: MailHistoryRepositoryInterface,

    private mailerService: MailerService,

    private httpService: HttpService,

    private readonly i18n: I18nService,
  ) {}

  public async sendMail(
    request: SendMailForgotPassword,
  ): Promise<ResponsePayload<SuccessResponse>> {
    try {
      const { email, body } = request;
      const emailTemplateSource = fs.readFileSync(
        path.join(__dirname, MAIL_TEMPLATE_FORGET_PASSWORD_FILE),
        'utf8',
      );
      const template = handlebars.compile(emailTemplateSource);

      const htmlToSend = template(body.context);

      const data = {
        message: {
          subject: 'Yêu cầu thay đổi mật khẩu hệ thống Smart BusEye',
          body: {
            contentType: 'HTML',
            content: htmlToSend,
          },
          toRecipients: [
            {
              emailAddress: {
                address: email,
              },
            },
          ],
        },
      };
      const token = await this.getTokenSendEmail();

      try {
        const response = await firstValueFrom(
          this.httpService.post(
            process.env.MAIL_HOST_MICROSOFT + process.env.USERID + '/sendMail',
            data,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            },
          ),
        );
        if (response.status === ResponseCodeEnum.ACCEPTED) {
          return new ResponseBuilder()
            .withCode(ResponseCodeEnum.SUCCESS)
            .build() as any;
        } else {
          return new ResponseBuilder()
            .withCode(ResponseCodeEnum.BAD_REQUEST)
            .build() as any;
        }
      } catch (error) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .build() as any;
      }
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .build() as any;
    }
  }

  async sendMailGraph(data, request, email) {
    const { cc, bcc, userId } = request;
    const token = await this.getTokenSendEmail();
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          process.env.MAIL_HOST_MICROSOFT + process.env.USERID + '/sendMail',
          data,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );
      if (response.status === ResponseCodeEnum.ACCEPTED) {
        await this.mailHistoryRepository.create({
          sentBy: userId,
          sentTo: email,
          cc: cc,
          bcc: bcc,
          status: BINARY_ENUM.YES,
        });
        return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
      } else {
        await this.mailHistoryRepository.create({
          sentBy: userId,
          sentTo: email,
          cc: cc,
          bcc: bcc,
          status: BINARY_ENUM.NO,
        });
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .build();
      }
    } catch (error) {
      console.log('___error___', error.response.data);
      await this.mailHistoryRepository.create({
        sentBy: userId,
        sentTo: email,
        cc: cc,
        bcc: bcc,
        status: BINARY_ENUM.NO,
      });
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .build();
    }
  }

  private async getTokenSendEmail() {
    // function handle call api token
    try {
      const getTokenSendMail = async () => {
        const response = await firstValueFrom(
          this.httpService.get(
            process.env.LOGIN_MICROSOFT_URL +
              process.env.TENANT_ID +
              '/oauth2/v2.0/token',
            {
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              data: {
                grant_type: process.env.LOGIN_MICROSOFT_TYPE,
                client_id: process.env.LOGIN_MICROSOFT_CLIENT_ID,
                scope: process.env.LOGIN_MICROSOFT_SCOPE,
                client_secret: process.env.LOGIN_MICROSOFT_CLIENT_SECRET,
              },
            },
          ),
        );
        if (response.status === ResponseCodeEnum.SUCCESS)
          return response.data.access_token;
        return null;
      };
      return await getTokenSendMail();
    } catch (error) {
      console.log('___error___', error);
      return null;
    }
  }
}
