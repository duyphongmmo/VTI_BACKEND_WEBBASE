import { Inject, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Alignment, Borders, Font, Workbook } from 'exceljs';
import { isEmpty } from 'lodash';
import { ReportRepositoryInterface } from '@repositories/report/report.repository.interface';
import { BusinessException } from '@core/exception-filters/business-exception.filter';
import {
  EXCEL_CONVERT_UNIT,
  EXCEL_STYLE,
  ExportTypeEnum,
  MAX_NUMBER_PAGE,
  ROW,
  SHEET,
} from './export.constant';
import { ExportServiceInterface } from './interface/export.service.interface';
import { ExportRequestDto } from './dto/request/export.request.dto';
import { ExportStatsDto } from './dto/response/export-stats.response.dto';
import { ExportResponseDto } from './dto/response/export.response.dto';

@Injectable()
export class ExportService implements ExportServiceInterface {
  constructor(
    private readonly i18n: I18nService,
    @Inject('ReportRepositoryInterface')
    private readonly reportRepository: ReportRepositoryInterface,
  ) {}

  async export(request: ExportRequestDto): Promise<ExportResponseDto> {
    const { type } = request;
    let workbook: Workbook;

    switch (type) {
      case ExportTypeEnum.DASHBOARD:
        workbook = await this.exportDashboard(request);
        break;
      default:
        throw new BusinessException(
          await this.i18n.translate('error.INVALID_EXPORT_TYPE'),
        );
    }

    if (workbook?.xlsx) {
      const buffer = await workbook.xlsx.writeBuffer();

      // await workbook.xlsx.writeFile('export.xlsx');

      return {
        statusCode: 200,
        data: buffer,
        message: 'Success',
      };
    } else {
      throw new BusinessException(
        await this.i18n.translate('error.EXPORT_FAILED'),
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async exportDashboard(_request: ExportRequestDto): Promise<Workbook> {
    let allReports: any[] = [];

    // Fetch all data with pagination
    for (let page = 1; page <= MAX_NUMBER_PAGE; page++) {
      const skip = (page - 1) * ROW.LIMIT_EXPORT_ON_SHEET;
      const take = ROW.LIMIT_EXPORT_ON_SHEET;

      const [reports, count] = await this.reportRepository.getListForDashboard({
        skip,
        take,
      });

      if (page === 1) {
        if (count > MAX_NUMBER_PAGE * ROW.LIMIT_EXPORT_ON_SHEET) {
          throw new BusinessException(
            await this.i18n.translate('error.EXPORT_DATA_TOO_LARGE'),
          );
        }
      }

      if (!isEmpty(reports)) {
        allReports = allReports.concat(reports);
      }

      if (reports.length < ROW.LIMIT_EXPORT_ON_SHEET) {
        break;
      }
    }

    // Calculate statistics
    const stats = this.calculateStats(allReports);

    // Transform data for Excel
    const records = allReports.map((report, index) => ({
      no: index + 1,
      title: report.title || '',
      reportType: report.reportType || '',
      reportDate: report.reportDate ? this.formatDate(report.reportDate) : '',
      totalValue: report.totalValue ? Number(report.totalValue) : 0,
      quantity: report.quantity ? Number(report.quantity) : 0,
      status: this.getStatusText(report.status),
      createdAt: report.createdAt ? this.formatDateTime(report.createdAt) : '',
    }));

    // Define Excel headers
    const headers = [
      {
        key: 'no',
        width: 5,
        widthInExcel: 0.5 * EXCEL_CONVERT_UNIT,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_CENTER },
        title: await this.i18n.translate('export.dashboard.no'),
      },
      {
        key: 'title',
        width: 30,
        widthInExcel: 3 * EXCEL_CONVERT_UNIT,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.dashboard.title'),
      },
      {
        key: 'reportType',
        width: 15,
        widthInExcel: 1.5 * EXCEL_CONVERT_UNIT,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_CENTER },
        title: await this.i18n.translate('export.dashboard.reportType'),
      },
      {
        key: 'reportDate',
        width: 15,
        widthInExcel: 1.5 * EXCEL_CONVERT_UNIT,
        style: {
          alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_CENTER,
          numFmt: EXCEL_STYLE.DDMMYYYY,
        },
        title: await this.i18n.translate('export.dashboard.reportDate'),
      },
      {
        key: 'totalValue',
        width: 15,
        widthInExcel: 1.5 * EXCEL_CONVERT_UNIT,
        style: {
          alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_RIGHT_MIDDLE,
          numFmt: '#,##0.00',
        },
        title: await this.i18n.translate('export.dashboard.totalValue'),
      },
      {
        key: 'quantity',
        width: 12,
        widthInExcel: 1.2 * EXCEL_CONVERT_UNIT,
        style: {
          alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_RIGHT_MIDDLE,
          numFmt: '#,##0',
        },
        title: await this.i18n.translate('export.dashboard.quantity'),
      },
      {
        key: 'status',
        width: 12,
        widthInExcel: 1.2 * EXCEL_CONVERT_UNIT,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_CENTER },
        title: await this.i18n.translate('export.dashboard.status'),
      },
      {
        key: 'createdAt',
        width: 20,
        widthInExcel: 2 * EXCEL_CONVERT_UNIT,
        style: {
          alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_CENTER,
          numFmt: EXCEL_STYLE.DDMMYYYYHHMMSS,
        },
        title: await this.i18n.translate('export.dashboard.createdAt'),
      },
    ];

    // Create workbook with title
    const title = await this.i18n.translate('export.dashboard.title_sheet');
    const sheetName = await this.i18n.translate('export.dashboard.sheet_name');

    const workbook = await this.exportToExcel(
      records,
      headers,
      sheetName,
      title,
      stats,
    );

    return workbook;
  }

  private async exportToExcel(
    data: any[],
    headers: any[],
    sheetName: string,
    title: string,
    stats?: any,
  ): Promise<Workbook> {
    const workbook = new Workbook();
    let countRowData = ROW.COUNT_START_ROW;
    let countSheet = SHEET.START_SHEET;
    let sheet = sheetName || SHEET.NAME;

    data.forEach((element, index) => {
      let sheetNameFile = sheet;
      if (data.length > ROW.LIMIT_EXPORT_ON_SHEET) {
        sheetNameFile = `${sheet}_${countSheet}`;
      }

      let worksheet = workbook.getWorksheet(sheetNameFile);

      if (countRowData === ROW.COUNT_START_ROW) {
        worksheet = workbook.addWorksheet(sheetNameFile);

        // Add title row
        const titleRow = worksheet.getRow(1);
        titleRow.values = [title];
        titleRow.font = <Font>EXCEL_STYLE.TITLE_FONT;
        titleRow.height = 25;
        worksheet.mergeCells(1, 1, 1, headers.length);
        titleRow.getCell(1).alignment = <Partial<Alignment>>(
          EXCEL_STYLE.ALIGN_CENTER
        );

        // Add statistics row if provided
        let headerRowIndex = 2;
        if (stats && index === 0) {
          const statsRow = worksheet.getRow(2);
          const totalReportsLabel = this.i18n.translate(
            'export.dashboard.totalReports',
          );
          const totalValueLabel = this.i18n.translate(
            'export.dashboard.totalValue',
          );
          const totalQuantityLabel = this.i18n.translate(
            'export.dashboard.totalQuantity',
          );
          const avgValueLabel = this.i18n.translate(
            'export.dashboard.avgValue',
          );
          const statsLabel = this.i18n.translate('export.dashboard.stats');
          const statsText = `${statsLabel} | ${totalReportsLabel}: ${
            stats.totalReports
          } | ${totalValueLabel}: ${stats.totalValue.toLocaleString()} | ${totalQuantityLabel}: ${stats.totalQuantity.toLocaleString()} | ${avgValueLabel}: ${stats.avgValue.toLocaleString()}`;
          statsRow.values = [statsText];
          statsRow.font = <Font>EXCEL_STYLE.TOTAL_FONT;
          statsRow.height = 20;
          worksheet.mergeCells(2, 1, 2, headers.length);
          headerRowIndex = 3;
        }

        // Add header row
        const headerRow = worksheet.getRow(headerRowIndex);
        headerRow.values = headers.map((header) => header.title);
        headerRow.font = <Font>EXCEL_STYLE.TITLE_FONT;
        headerRow.height = 30;
        headerRow.eachCell((cell) => {
          cell.fill = <any>EXCEL_STYLE.HEADER_FILL;
          cell.alignment = <Partial<Alignment>>EXCEL_STYLE.ALIGN_CENTER;
          cell.border = <Partial<Borders>>EXCEL_STYLE.BORDER_ALL;
        });

        // Set column widths
        worksheet.columns = headers.map((header) => ({
          key: header.key,
          width: header.widthInExcel || header.width,
        }));
      }

      // Add data row
      worksheet
        .addRow({
          ...element,
        })
        .eachCell({ includeEmpty: true }, (cell) => {
          cell.font = <Font>EXCEL_STYLE.DEFAULT_FONT;
          cell.border = <Partial<Borders>>EXCEL_STYLE.BORDER_ALL;
        });

      countRowData++;
      if (countRowData === ROW.COUNT_END_ROW) {
        countSheet++;
        countRowData = ROW.COUNT_START_ROW;
        sheet = sheetName || SHEET.NAME;
      }
    });

    return workbook;
  }

  private calculateStats(reports: any[]): ExportStatsDto {
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

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private formatDateTime(date: Date | string): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  private getStatusText(status: number): string {
    const statusMap = {
      0: 'Draft',
      1: 'Active',
      2: 'Completed',
      3: 'Cancelled',
    };
    return statusMap[status] || 'Unknown';
  }
}
