import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';

class Role {
  @Expose()
  roleName: string;

  @Expose()
  value: boolean;
}

export class Permission {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  code: string;

  @Expose()
  @IsArray()
  @Type(() => Role)
  roles: Role[];
}

export class GroupPermission {
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

export class GetFinalPermissionResponseDto {
  @Expose()
  @Type(() => GroupPermission)
  @IsArray()
  permission: GroupPermission[];
}
