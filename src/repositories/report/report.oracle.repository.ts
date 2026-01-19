import { Injectable } from '@nestjs/common';
import { OracleService } from '../../components/oracle/oracle.service';

@Injectable()
export class ReportOracleRepository {
  constructor(private readonly oracleService: OracleService) {}
  async getListForDashboard(request: any): Promise<[any[], number]> {
    const {
      skip = 0,
      take = 10,
      startDate,
      endDate,
      reportType,
      factoryId,
    } = request;

    const where: string[] = ['r.DELETED_AT IS NULL'];
    const binds: any[] = [];

    // ===== FILTERS =====
    if (startDate) {
      binds.push(startDate);
      where.push(`r.REPORT_DATE >= :${binds.length}`);
    }

    if (endDate) {
      binds.push(endDate);
      where.push(`r.REPORT_DATE < :${binds.length}`);
    }

    if (reportType) {
      binds.push(reportType);
      where.push(`r.REPORT_TYPE = :${binds.length}`);
    }

    if (factoryId) {
      binds.push(factoryId);
      where.push(`r.FACTORY_ID = :${binds.length}`);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    // ===== DATA QUERY =====
    const dataSql = `
      SELECT
        id          AS "id",
        title       AS "title",
        reportType  AS "reportType",
        reportDate  AS "reportDate",
        totalValue  AS "totalValue",
        quantity    AS "quantity",
        status      AS "status",
        createdAt   AS "createdAt"
      FROM (
        SELECT
          r.ID,
          r.TITLE,
          r.REPORT_TYPE     AS reportType,
          r.REPORT_DATE     AS reportDate,
          r.TOTAL_VALUE     AS totalValue,
          r.QUANTITY,
          r.STATUS,
          r.CREATED_AT      AS createdAt,
          ROW_NUMBER() OVER (
            ORDER BY r.REPORT_DATE DESC, r.CREATED_AT DESC
          ) rn
        FROM ADMIN.TBL_REPORTS r
        ${whereSql}
      )
      WHERE rn > :${binds.length + 1}
        AND rn <= :${binds.length + 2}
    `;

    // pagination binds
    const dataBinds = [...binds, skip, skip + take];

    // ===== COUNT QUERY =====
    const countSql = `
      SELECT COUNT(1) AS "total"
      FROM ADMIN.TBL_REPORTS r
      ${whereSql}
    `;

    // ===== EXECUTE =====


      const data2 = await this.oracleService.callRefCursorFunction(
  'DISVINA.PP_DEV_T.GET_ALL_KPI',
  {
    P_FROM_DATE: '2026-01-01',
    P_TO_DATE: '2026-01-19',
  },
  'P_CURSOR',
);


    return [[],0]
  }

    async getDashboardChartYield(request: any): Promise<[any[], number]> {
      const {fromDate,toDate} = request
      const data = await this.oracleService.callRefCursorFunction(
      'DISVINA.PP_DEV_T.GET_ALL_KPI',
      {
        P_FROM_DATE: fromDate,
        P_TO_DATE: toDate,
      },
      'P_CURSOR',
    );

    return [data,0]
  }

}
