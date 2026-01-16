import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DashboardReportDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  reportType: string;

  @ApiProperty()
  @Expose()
  reportDate: Date;

  @ApiProperty()
  @Expose()
  totalValue: number;

  @ApiProperty()
  @Expose()
  quantity: number;

  @ApiProperty()
  @Expose()
  status: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}

export class DashboardStatsDto {
  @ApiProperty()
  @Expose()
  totalReports: number;

  @ApiProperty()
  @Expose()
  totalValue: number;

  @ApiProperty()
  @Expose()
  totalQuantity: number;

  @ApiProperty()
  @Expose()
  avgValue: number;
}

export class DashboardResponseDto {
  @ApiProperty({ type: [DashboardReportDto] })
  @Expose()
  reports: DashboardReportDto[];

  @ApiProperty({ type: DashboardStatsDto })
  @Expose()
  stats: DashboardStatsDto;

  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  page: number;
}
