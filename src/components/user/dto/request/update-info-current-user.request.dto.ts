import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateInfoCurrentUserRequestDto extends BaseDto {
  @ApiProperty({ example: '0987654321', description: 'Phone number' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone: string;

  @ApiProperty({ example: '2021-07-18 17:34:02', description: 'date of birth' })
  @IsOptional()
  @IsDateString()
  dateOfBirth: Date;
}
