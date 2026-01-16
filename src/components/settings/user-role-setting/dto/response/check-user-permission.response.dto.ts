import { Expose } from 'class-transformer';

export class CheckUserPermissionResponseDto {
  @Expose()
  id: number;

  @Expose()
  permissionId: number;

  @Expose()
  userRoleId: number;

  @Expose()
  departmentSettingId: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
