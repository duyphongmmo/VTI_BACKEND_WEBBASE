import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ImportUserResultDto {
  @ApiProperty()
  @Expose()
  created: number;

  @ApiProperty()
  @Expose()
  updated: number;

  @ApiProperty()
  @Expose()
  failed: number;

  @ApiProperty()
  @Expose()
  errors?: any[];
}
