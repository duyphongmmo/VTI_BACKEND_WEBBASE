import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from '@entities/report/report.entity';
import { ReportRepository } from '@repositories/report/report.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  providers: [
    {
      provide: 'ExportServiceInterface',
      useClass: ExportService,
    },
    {
      provide: 'ReportRepositoryInterface',
      useClass: ReportRepository,
    },
  ],
  controllers: [ExportController],
  exports: [
    {
      provide: 'ExportServiceInterface',
      useClass: ExportService,
    },
  ],
})
export class ExportModule {}
