import { Module } from '@nestjs/common';

import { DataSource } from 'typeorm';
import { OracleService } from './oracle.service';
import { ConfigService } from '@config/config.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    ConfigService,
    {
      provide: 'ORACLE_DATA_SOURCE',
      useFactory: async (configService: ConfigService) => {
        const { host, port, username, password, serviceName, logging } =
          configService.get('oracle');

        const dataSource = new DataSource({
          type: 'oracle',
          host,
          port,
          username,
          password,
          serviceName,
          logging,
        });

        return dataSource.initialize();
      },
      inject: [ConfigService],
    },
    OracleService,
  ],
  exports: ['ORACLE_DATA_SOURCE'],
})
export class OracleModule {}
