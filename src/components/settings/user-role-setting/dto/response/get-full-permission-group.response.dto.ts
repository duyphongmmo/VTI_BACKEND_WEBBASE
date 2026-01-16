import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';

class Permission {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  code: string;
}

class GroupPermission {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  code: string;

  @Expose()
  @Type(() => Permission)
  @IsArray()
  permission: Permission[];
}

export class GetFullGroupPermissionResponseDto {
  @Expose()
  @Type(() => GroupPermission)
  @IsArray()
  permission: GroupPermission[];
}
