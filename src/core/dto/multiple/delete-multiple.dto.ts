import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from '../base.dto';

export class DeleteMultipleDto extends BaseDto {
  @ApiProperty({ example: '1, 2, 3', description: '1, 2, 3' })
  @IsString()
  @IsNotEmpty()
  ids: string;
}
