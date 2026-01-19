import { Module } from '@nestjs/common';

import { DataSource } from 'typeorm';
import { OracleService } from './oracle.service';
import { ConfigService } from '@config/config.service';
import * as oracledb from 'oracledb';

@Module({
  imports: [],
  controllers: [],
  providers: [
    ConfigService,
    {
      provide: 'ORACLE_DATA_SOURCE',
      useFactory: async (configService: ConfigService) => {
        const { host, port, username, password, serviceName, logging, instantClientDir } =
          configService.get('oracle');

       
        // 🔥 BẮT BUỘC: bật Thick mode TRƯỚC khi tạo DataSource
        try {
          oracledb.initOracleClient({
            libDir: instantClientDir,
          });
        } catch (err: any) {
          // nếu đã init rồi thì bỏ qua
          if (!String(err?.message).includes('DPI-1047')) {
            console.warn('Oracle client init warning:', err?.message);
          }
        }

        // ✅ EZCONNECT (khuyên dùng)
        const connectString = `${host}:${port}/${serviceName}`;

        const dataSource = new DataSource({
          type: 'oracle',
          username,
          password,
          connectString,
          logging,
        } as any);

        return dataSource.initialize();
      },
      inject: [ConfigService],
    },
    OracleService,
  ],
  exports: ['ORACLE_DATA_SOURCE'],
})
export class OracleModule {}
