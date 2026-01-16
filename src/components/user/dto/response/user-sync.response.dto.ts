import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from './user.response.dto';

class WarehouseResponseDto {
  @Expose({ name: 'warehouseId' })
  id: number;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  factoryId: number;

  @ApiProperty()
  @Expose()
  factoryName: string;

  @ApiProperty({ name: 'id' })
  @Expose()
  warehouseId: number;

  @ApiProperty()
  @Expose()
  name: string;
}
export class UserSyncResponseDto extends UserResponseDto {
  @Expose()
  password: string;

  @ApiProperty({
    type: WarehouseResponseDto,
    example: [{ id: 1 }],
    description: '',
  })
  @Expose()
  @Type(() => WarehouseResponseDto)
  userWarehouses: WarehouseResponseDto[];
}
