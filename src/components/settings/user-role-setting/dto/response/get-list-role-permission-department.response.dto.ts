import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { SuccessResponse } from '@utils/success.response.dto';

class PermissionSetting {
  @ApiProperty({ example: 'Danh sách sản phẩm', description: '' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'ITEM_LIST_ITEM', description: '' })
  @Expose()
  code: string;

  @ApiProperty({ example: 'ITEM_ITEM_GROUP', description: '' })
  @Expose()
  groupPermissionSettingCode: string;
}

class Role {
  @ApiProperty({ example: 1, description: '' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'admin', description: '' })
  @Expose()
  name: string;

  @Expose()
  @Type(() => PermissionSetting)
  @IsArray()
  @ApiProperty({
    isArray: true,
    type: PermissionSetting,
  })
  permissionSettings: PermissionSetting[];
}

export class DepartmentResponseDto {
  @ApiProperty({ example: 1, description: '' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'department 1', description: '' })
  @Expose()
  name: string;

  @Expose()
  @Type(() => Role)
  @IsArray()
  @ApiProperty({
    isArray: true,
    type: Role,
  })
  roles: Role[];
}

export class GetListRolePermissionOfDepartmentResponseDto extends SuccessResponse {
  @Expose()
  @Type(() => DepartmentResponseDto)
  @IsArray()
  @ApiProperty({
    isArray: true,
    type: DepartmentResponseDto,
  })
  data: DepartmentResponseDto[];
}
