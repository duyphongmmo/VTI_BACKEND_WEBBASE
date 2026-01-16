import { Expose } from 'class-transformer';

export class CheckPermissionDepartmentResponseDto {
  @Expose()
  id: number;

  @Expose()
  departmentId: number;

  @Expose()
  permissionSettingId: number;
}
