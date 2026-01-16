import { EnumStatus } from '@utils/common';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tbl_user_role_permission_settings' })
export class UserRolePermissionSettingEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'int',
  })
  userRoleId: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  permissionSettingCode: string;

  @Column()
  status: EnumStatus;
}
