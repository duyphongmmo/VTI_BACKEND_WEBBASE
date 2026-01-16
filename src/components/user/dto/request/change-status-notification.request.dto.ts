import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class ChangeStatusNotificationBodyDto extends BaseDto {
  @ApiProperty({
    example: 'Bật thông báo: 1',
    description: 'status notification',
  })
  @IsNotEmpty()
  statusNotification: boolean;
}
export class ChangeStatusNotificationRequestDto extends ChangeStatusNotificationBodyDto {
  @ApiProperty({ example: 1, description: 'id' })
  @IsNotEmpty()
  @IsInt()
  id: number;
}
