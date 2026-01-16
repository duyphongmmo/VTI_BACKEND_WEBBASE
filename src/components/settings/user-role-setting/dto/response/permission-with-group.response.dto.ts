import { Expose, Type } from 'class-transformer';

class PermissionSetting {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  status: number;
}
class GroupPermission {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  status: number;

  @Expose()
  permissionSettings: PermissionSetting[];
}

class Meta {
  @Expose()
  total: number;

  @Expose()
  page: number;
}

export class PermissionWithGroupResponseDto {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  groupPermissions: GroupPermission[];

  @Expose()
  @Type(() => Meta)
  meta: Meta;
}
