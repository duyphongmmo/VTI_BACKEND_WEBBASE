import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ExportStatsDto {
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
