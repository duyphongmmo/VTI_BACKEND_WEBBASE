import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

class UserPermission {
  @ApiProperty()
  @Expose()
  code: string;
}

class OrgStructure {
  @ApiProperty({ example: 1, description: '' })
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;
}
class UserResponse {
  @ApiProperty({ example: 1, description: '' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'admin', description: '' })
  @Expose()
  username: string;

  @ApiProperty({ example: 'admin', description: '' })
  @Expose()
  fullName: string;
}
class GetListUserRoleResponseDto {
  @Expose()
  id: number;

  @Expose()
  userRoleId: number;

  @Expose()
  userRoleName: string;
}

export class UserResponseDto {
  @ApiProperty({ example: 1, description: '' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'abc@gmail.com', description: '' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'abc', description: '' })
  @Expose()
  username: string;

  @ApiProperty({ example: 'abc', description: '' })
  @Expose()
  fullName: string;

  @ApiProperty({ example: '1970-01-01T00:00:00.000Z', description: '' })
  @Transform((v) => {
    if (v.value) {
      return new Date(v.value).toISOString();
    }
    return null;
  })
  @Expose()
  dateOfBirth: string;

  @ApiProperty({ example: 'abc', description: '' })
  @Expose()
  code: string;

  @ApiProperty({ example: '0987-1254-125', description: '' })
  @Expose()
  phone: string;

  @ApiProperty({ example: 1, description: '' })
  @Expose()
  status: number;

  @ApiProperty({ example: true, description: '' })
  @Expose()
  statusNotification: boolean;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @ApiProperty({ type: UserResponse })
  @Expose()
  @Type(() => UserResponse)
  createdBy: UserResponse;

  @Expose()
  type: number;

  @ApiProperty({
    type: GetListUserRoleResponseDto,
    example: [{ id: 1, name: 'role 1' }],
    description: '',
  })
  @Expose()
  @Type(() => GetListUserRoleResponseDto)
  userRoles: GetListUserRoleResponseDto[];

  @ApiProperty({
    type: OrgStructure,
  })
  @Expose()
  @Type(() => OrgStructure)
  orgStructures: OrgStructure[];

  @ApiProperty({
    type: UserPermission,
  })
  @Expose()
  @Type(() => UserPermission)
  userPermissions: UserPermission[];
}
