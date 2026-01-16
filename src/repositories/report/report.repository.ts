import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Report } from '@entities/report/report.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportRepositoryInterface } from './report.repository.interface';

@Injectable()
export class ReportRepository
  extends BaseAbstractRepository<Report>
  implements ReportRepositoryInterface
{
  constructor(
    @InjectRepository(Report)
    private readonly reportEntity: Repository<Report>,
  ) {
    super(reportEntity);
  }

  async getListForDashboard(request: any): Promise<[Report[], number]> {
    const { skip, take, startDate, endDate, reportType, factoryId } = request;

    const query = this.reportEntity
      .createQueryBuilder('r')
      .select([
        'r.id',
        'r.title',
        'r.reportType',
        'r.reportDate',
        'r.totalValue',
        'r.quantity',
        'r.status',
        'r.createdAt',
      ])
      .orderBy('r.reportDate', 'DESC')
      .addOrderBy('r.createdAt', 'DESC');

    if (startDate) {
      query.andWhere('r.reportDate >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('r.reportDate <= :endDate', { endDate });
    }

    if (reportType) {
      query.andWhere('r.reportType = :reportType', { reportType });
    }

    if (factoryId) {
      query.andWhere('r.factoryId = :factoryId', { factoryId });
    }

    if (skip !== undefined) {
      query.skip(skip);
    }

    if (take !== undefined) {
      query.take(take);
    }

    return await query.getManyAndCount();
  }
}
