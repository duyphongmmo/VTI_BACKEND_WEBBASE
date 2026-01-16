import { Inject, Injectable } from '@nestjs/common';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import { I18nService } from 'nestjs-i18n';
import { plainToInstance } from 'class-transformer';
import { ReportRepositoryInterface } from '@repositories/report/report.repository.interface';
import { GetDashboardDto } from './dto/request/get-dashboard.request.dto';
import { DashboardServiceInterface } from './interface/dashboard.service.interface';
import {
  DashboardReportDto,
  DashboardStatsDto,
} from './dto/response/dashboard.response.dto';
import { ResponsePayload } from '@utils/response-payload';
import { ReportOracleRepository } from '@repositories/report/report.oracle.repository';

@Injectable()
export class DashboardService implements DashboardServiceInterface {
  constructor(
    @Inject('ReportRepositoryInterface')
    private readonly reportRepository: ReportRepositoryInterface,
    private readonly reportOracleRepository: ReportOracleRepository,
    private readonly i18n: I18nService,
  ) {}

  async getDashboardData(
    request: GetDashboardDto,
  ): Promise<ResponsePayload<any>> {
    const { page } = request;

    // Get reports list
    const [reports, total] =
      await this.reportRepository.getListForDashboard(request);

    // Calculate statistics
    const stats = this.calculateStats(reports);

    // Transform to DTO
    const reportsDto = plainToInstance(DashboardReportDto, reports, {
      excludeExtraneousValues: true,
    });

    const response = {
      items: reportsDto,
      meta: {
        stats,
        total,
        page,
      },
    };

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
      .build();
  }

  private calculateStats(reports: any[]): DashboardStatsDto {
    const totalReports = reports.length;
    const totalValue = reports.reduce(
      (sum, report) => sum + Number(report.totalValue || 0),
      0,
    );
    const totalQuantity = reports.reduce(
      (sum, report) => sum + Number(report.quantity || 0),
      0,
    );
    const avgValue = totalReports > 0 ? totalValue / totalReports : 0;

    return {
      totalReports,
      totalValue: Number(totalValue.toFixed(2)),
      totalQuantity,
      avgValue: Number(avgValue.toFixed(2)),
    };
  }

  async getDashboardDataOracle(request: GetDashboardDto): Promise<any> {
    const { page } = request;

    // Get reports list
    const [reports, total] =
      await this.reportOracleRepository.getListForDashboard(request);

    // Calculate statistics
    const stats = this.calculateStats(reports);

    // Transform to DTO
    const reportsDto = plainToInstance(DashboardReportDto, reports, {
      excludeExtraneousValues: true,
    });

    const response = {
      items: reportsDto,
      meta: {
        stats,
        total,
        page,
      },
    };

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('statusMessage.SUCCESS'))
      .build();
  }
}
