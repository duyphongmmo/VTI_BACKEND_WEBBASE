import { Expose } from 'class-transformer';

export class CreateUserPermissionResponseDto {
  @Expose()
  id: number;

  @Expose()
  userRoleId: number;

  @Expose()
  permissionId: number;

  @Expose()
  departmentSettingId: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
