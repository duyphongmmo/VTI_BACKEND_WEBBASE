import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from '@utils/pagination.query';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class GroupPermissionByRoleIdRequestDto extends PaginationQuery {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Transform((v) => +v.value)
  roleId: number;
}
