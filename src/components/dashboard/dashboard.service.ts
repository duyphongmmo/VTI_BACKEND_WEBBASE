import { Inject, Injectable } from "@nestjs/common";
import { ResponseCodeEnum } from "@constant/response-code.enum";
import { ResponseBuilder } from "@utils/response-builder";
import { I18nService } from "nestjs-i18n";
import { plainToInstance } from "class-transformer";
import { ReportRepositoryInterface } from "@repositories/report/report.repository.interface";
import { GetDashboardDto } from "./dto/request/get-dashboard.request.dto";
import { DashboardServiceInterface } from "./interface/dashboard.service.interface";
import {
  DashboardReportDto,
  DashboardStatsDto,
} from "./dto/response/dashboard.response.dto";
import { ResponsePayload } from "@utils/response-payload";
import { ReportOracleRepository } from "@repositories/report/report.oracle.repository";

@Injectable()
export class DashboardService implements DashboardServiceInterface {
  constructor(
    @Inject("ReportRepositoryInterface")
    private readonly reportRepository: ReportRepositoryInterface,
    private readonly reportOracleRepository: ReportOracleRepository,
    private readonly i18n: I18nService,
  ) {}

  // =========================
  // DASHBOARD DATA (Normal)
  // =========================
  async getDashboardData(
    request: GetDashboardDto,
  ): Promise<ResponsePayload<any>> {
    const { page } = request;

    const [reports, total] =
      await this.reportRepository.getListForDashboard(request);

    const stats = this.calculateStats(reports);

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
      .withMessage(await this.i18n.translate("statusMessage.SUCCESS"))
      .build();
  }

  // =========================
  // DASHBOARD DATA (Oracle)
  // =========================
  async getDashboardDataOracle(request: GetDashboardDto): Promise<any> {
    const { page } = request;

    const [reports, total] =
      await this.reportOracleRepository.getListForDashboard(request);

    const stats = this.calculateStats(reports);

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
      .withMessage(await this.i18n.translate("statusMessage.SUCCESS"))
      .build();
  }

  // =========================
  // CHART: GROUP + SORT
  // =========================
  async getDashboardChartYield(request: GetDashboardDto): Promise<any> {
    const { page } = request;

    const [reports, total] =
      await this.reportOracleRepository.getDashboardChartYield(request);

    const charts = this.groupByKpiAndBusiDivi(reports);
    const chartsSorted = this.sortCharts(charts);

    return new ResponseBuilder({
      charts: chartsSorted,
      meta: {
        total,
        page,
      },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate("statusMessage.SUCCESS"))
      .build();
  }

  // =========================
  // UTIL: STATS
  // =========================
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

  // =========================
  // UTIL: GROUP KPI + BUSI
  // group key = KPI_ID + BUSI_DIVI_ID
  // =========================
  private groupByKpiAndBusiDivi(reports: any[]) {
    const map = new Map<string, any>();

    for (const item of reports ?? []) {
      const kpiId = item.KPI_ID;
      const busiDiviId = item.BUSI_DIVI_ID;
      const busiName = item.BUSI_NAME ?? `BUSI ${busiDiviId}`;

      const key = `${kpiId}_${busiDiviId}`;

      if (!map.has(key)) {
        map.set(key, {
          kpiId,
          busiDiviId,
          busiName,
          data: [],
        });
      }

      map.get(key).data.push({
        periodType: item.PERIOD_TYPE,
        periodKey: item.PERIOD_KEY,
        date: item.DT_FROM,
        ppm: item.PPM,
      });
    }

    return Array.from(map.values());
  }

  // =========================
  // UTIL: SORT CHARTS + DATA
  // sort charts: BUSI_DIVI_ID -> KPI_ID (đúng yêu cầu của bạn)
  // sort data: Q -> M -> W -> D, rồi date asc
  // =========================
  private sortCharts(charts: any[]) {
    const PERIOD_ORDER: Record<string, number> = { Q: 1, M: 2, W: 3, D: 4 };

    const normalizePeriodType = (t: string) => {
      const x = (t || "").toUpperCase().trim();
      return PERIOD_ORDER[x] ? x : "D";
    };

    // ✅ sort charts theo busiDiviId trước, rồi kpiId
    const sortedCharts = [...(charts ?? [])].sort((a, b) => {
      const ba = a.busiDiviId ?? 0;
      const bb = b.busiDiviId ?? 0;
      if (ba !== bb) return ba - bb;

      const ka = a.kpiId ?? 0;
      const kb = b.kpiId ?? 0;
      return ka - kb;
    });

    // ✅ sort data theo Q->M->W->D, rồi date asc, rồi periodKey asc
    for (const ch of sortedCharts) {
      ch.data = [...(ch.data ?? [])].sort((x, y) => {
        const ox = PERIOD_ORDER[normalizePeriodType(x.periodType)] ?? 999;
        const oy = PERIOD_ORDER[normalizePeriodType(y.periodType)] ?? 999;
        if (ox !== oy) return ox - oy;

        const dx = x.date ? new Date(x.date).getTime() : 0;
        const dy = y.date ? new Date(y.date).getTime() : 0;
        if (dx !== dy) return dx - dy;

        return String(x.periodKey ?? "").localeCompare(
          String(y.periodKey ?? ""),
        );
      });
    }

    return sortedCharts;
  }
}
