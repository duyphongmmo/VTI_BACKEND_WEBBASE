import { GroupPermissionSettingEntity } from '@entities/group-permission-setting/group-permission-setting.entity';
import { StatusPermission } from '@utils/constant';
import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'tbl_permission_settings' })
export class PermissionSettingEntity {
  @Column()
  @Generated('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @PrimaryColumn({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  groupPermissionSettingCode: string;

  @Column({
    type: 'integer',
    enum: StatusPermission,
    default: 1,
  })
  status: number;

  @ManyToOne(
    () => GroupPermissionSettingEntity,
    (groupPermissionSetting) => groupPermissionSetting.permissionSetting,
  )
  @JoinColumn({
    name: 'group_permission_setting_code',
  })
  groupPermissionSetting: GroupPermissionSettingEntity;
}
