import { Report } from '@entities/report/report.entity';

export interface ReportRepositoryInterface {
  findOneById(id: number): Promise<Report>;
  getListForDashboard(request: any): Promise<[Report[], number]>;
}
