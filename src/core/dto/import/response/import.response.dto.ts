import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ImportResultDto } from '@core/dto/import/response/import.result.dto';

export class ImportResponseDto {
  @ApiProperty({ description: 'File name' })
  @Expose()
  logFileBase64: string;

  @ApiProperty({ description: 'Mimetype of the file' })
  @Expose()
  mimeType: string;

  @ApiProperty({ description: 'Import result log' })
  @Expose()
  result: ImportResultDto[];

  @ApiProperty({
    example: 10,
    description: 'Number of successfully imported records',
  })
  @Expose()
  successCount: number;

  @ApiProperty({ example: 20, description: 'Number of all records' })
  @Expose()
  totalCount: number;
}
