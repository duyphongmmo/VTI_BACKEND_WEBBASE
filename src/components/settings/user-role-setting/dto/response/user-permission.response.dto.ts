import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserRolePermissionSettingEntity } from '@entities/user-role-permission-setting/user-role-permission-setting.entity';

export class UserPermissionResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  userRoleId: number;

  @ApiProperty()
  @Expose()
  permissionSettingCode: string;

  @ApiProperty()
  @Expose()
  permissions: UserRolePermissionSettingEntity[];
}
