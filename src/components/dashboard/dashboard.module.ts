import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from '@entities/report/report.entity';
import { ReportRepository } from '@repositories/report/report.repository';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ReportOracleRepository } from '@repositories/report/report.oracle.repository';
import { OracleService } from '@components/oracle/oracle.service';
import { OracleModule } from '@components/oracle/oracle.module';

@Module({
  imports: [TypeOrmModule.forFeature([Report]), OracleModule],
  controllers: [DashboardController],
  providers: [
    {
      provide: 'DashboardServiceInterface',
      useClass: DashboardService,
    },
    {
      provide: 'ReportRepositoryInterface',
      useClass: ReportRepository,
    },
    ReportOracleRepository,
    OracleService,
  ],
  exports: [
    {
      provide: 'DashboardServiceInterface',
      useClass: DashboardService,
    },
  ],
})
export class DashboardModule {}
