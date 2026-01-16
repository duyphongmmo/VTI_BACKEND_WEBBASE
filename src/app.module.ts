import { I18nJsonLoader, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { DashboardModule } from '@components/dashboard/dashboard.module';
import { ExportModule } from '@components/export/export.module';
import { MailModule } from '@components/mail/mail.module';
import { UserRoleSettingModule } from '@components/settings/user-role-setting/user-role-setting.module';
import { AuthorizationGuard } from '@core/guards/authorization.guard';
import { ValidationPipe } from '@core/pip/validation.pipe';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './components/auth/auth.module';
import { UserModule } from './components/user/user.module';
import { OracleModule } from '@components/oracle/oracle.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'vi',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [{ use: QueryResolver, options: ['lang', 'locale', 'l'] }],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_POSTGRES_HOST,
      port: parseInt(process.env.DATABASE_POSTGRES_PORT),
      username: process.env.DATABASE_POSTGRES_USERNAME,
      password: process.env.DATABASE_POSTGRES_PASSWORD,
      database: process.env.DATABASE_NAME,
      logging: true,
      ssl:
        process.env.DATABASE_SSL_REQUIRED === 'true'
          ? { rejectUnauthorized: false }
          : null,
      entities: [
        path.join(__dirname, '/entities/**/*.entity.{ts,js}'),
        path.join(
          __dirname,
          '/components/**/entities/*.entity.{ts,js}' /* search in components */,
        ),
      ],
      migrations: [path.join(__dirname, '/database/*.{ts,js}')],
      subscribers: ['dist/observers/subscribers/*.subscriber.{ts,js}'],
      // We are using migrations, synchronize should be set to false.
      synchronize: false,
      // Run migrations automatically,
      // you can disable this if you prefer running migration manually.
      migrationsRun: true,
      extra: {
        max: parseInt(process.env.DATABASE_MAX_POOL) || 20,
      },
      namingStrategy: new SnakeNamingStrategy(),
    }),
    AuthModule,
    UserModule,
    UserRoleSettingModule,
    MailModule,
    DashboardModule,
    ExportModule,
    OracleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
})
export class AppModule {}
