import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ImportRequestDto extends BaseDto {
  @ApiProperty({
    example: 'SnP_Template.xlsx',
    description: 'Name of the file to be imported',
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    description: 'Buffer of the file to be imported',
  })
  @IsNotEmpty()
  buffer: ArrayBuffer;

  @ApiProperty({
    example:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    description: 'Mime type of the file to be imported',
  })
  @IsString()
  @IsNotEmpty()
  mimeType: string;
}
