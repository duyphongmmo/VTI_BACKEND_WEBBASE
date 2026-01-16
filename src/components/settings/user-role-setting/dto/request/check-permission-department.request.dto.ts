import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';

export class CheckPermissionDepartmentRequestDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  departmentId: number;
}
