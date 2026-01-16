import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationQuery } from '@utils/pagination.query';

export class GetDashboardDto extends PaginationQuery {
  @ApiPropertyOptional({ description: 'Start date (YYYY-MM-DD)' })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date (YYYY-MM-DD)' })
  @IsString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Report type filter' })
  @IsString()
  @IsOptional()
  reportType?: string;

  @ApiPropertyOptional({ description: 'Factory ID filter' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  factoryId?: number;
}
