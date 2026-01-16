import { MailService } from '@components/mail/mail.service';
import { UserRoleSettingModule } from '@components/settings/user-role-setting/user-role-setting.module';
import { MailConfig } from '@config/mail.config';
import { MailHistoryEntity } from '@entities/mail/mail-history.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailHistoryRepository } from '@repositories/mail/mail-history.repository';
import { join } from 'path';
import { MailController } from './mail.controller';
import { HttpModule } from '@nestjs/axios';
@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 15000,
      maxRedirects: 5,
    }),
    MailerModule.forRoot({
      transport: {
        host: new MailConfig().get('host'),
        port: new MailConfig().get('port'),
        secureConnection: false, // TLS requires secureConnection to be false
        auth: false,
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: `"No Reply" <${new MailConfig().get('noReply')}>`,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    TypeOrmModule.forFeature([
      MailHistoryEntity,
    ]),
    UserRoleSettingModule,
  ],
  exports: [MailService],
  providers: [
    MailService,
    {
      provide: 'MailHistoryRepositoryInterface',
      useClass: MailHistoryRepository,
    },
  ],
  controllers: [MailController],
})
export class MailModule {}
