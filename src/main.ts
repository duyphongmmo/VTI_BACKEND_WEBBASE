import { ExceptionInterceptor } from '@core/interceptors/exception.interceptor';
import { FilterQueryPipe } from '@core/pipe/filter-query.pipe';
import { SortQueryPipe } from '@core/pipe/sort-query.pipe';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { isDevMode } from '@utils/helper';
import fastifyMultipart from 'fastify-multipart';
import { types } from 'pg';
import { AppModule } from './app.module';
import { APIPrefix } from './common';
import { ConfigService } from './config/config.service';

process.on('unhandledRejection', function (reason) {
  console.log('Unhandled Rejection:', reason);
});

async function bootstrap() {
  types.setTypeParser(types.builtins.INT8, (value: string): number =>
    parseFloat(value),
  );
  const fastifyAdapter = new FastifyAdapter();

  fastifyAdapter.register(fastifyMultipart, {
    attachFieldsToBody: true,
    addToBody: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      logger: isDevMode()
        ? ['debug', 'error', 'log', 'verbose', 'warn']
        : ['error', 'debug', 'log'],
    },
  );

  app.setGlobalPrefix(APIPrefix.Version);
  const options = new DocumentBuilder()
    .setTitle('DKT-Report API docs')
    .addBearerAuth(
      { type: 'http', description: 'Access token' },
      'access-token',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/v1/dkt-report/swagger-docs', app, document);

  let corsOptions = {};
  const configService = new ConfigService();
  if (configService.get('corsOrigin')) {
    corsOptions = {
      origin: new ConfigService().get('corsOrigin'),
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app.register(require('@fastify/cors'), corsOptions);

  app.useGlobalPipes(new SortQueryPipe());
  app.useGlobalPipes(new FilterQueryPipe());
  app.useGlobalInterceptors(new ExceptionInterceptor());

  await app.listen(new ConfigService().get('httpPort'), '0.0.0.0');
}

export const SRC_DIR = __dirname;

bootstrap();
