import { PermissionSettingEntity } from '@entities/permission-setting/permission-setting.entity';
import { StatusPermission } from '@utils/constant';
import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity('tbl_group_permission_settings')
export class GroupPermissionSettingEntity {
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
    type: 'integer',
    enum: StatusPermission,
    default: 1,
  })
  status: number;

  @OneToMany(
    () => PermissionSettingEntity,
    (permissionSetting) => permissionSetting.groupPermissionSetting,
  )
  @JoinColumn()
  permissionSetting: PermissionSettingEntity[];
}
