import { Expose } from 'class-transformer';

export class GetDepartmentIdResponseDto {
  @Expose()
  id: number;

  @Expose()
  departmentId: number;

  @Expose()
  permissionSettingId: number;
}
