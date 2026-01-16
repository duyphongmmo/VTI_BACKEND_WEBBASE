import { TypeEnum } from '@components/auth/auth.constant';
import { USER_RULE_CONST } from '@components/user/user.constant';
import { UserRoleSetting } from '@entities/user-role-setting/user-role-setting.entity';
import { UserRole } from '@entities/user-role/user-role.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum status {
  ACTIVE = 1,
  IN_ACTIVE = 0,
}
@Entity({ name: 'tbl_users' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    length: 255,
    nullable: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: USER_RULE_CONST.USER_NAME.MAX_LENGTH,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: USER_RULE_CONST.FULL_NAME.MAX_LENGTH,
    nullable: true,
  })
  fullName: string;

  @Column({
    type: 'varchar',
    length: 255,
    select: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: USER_RULE_CONST.CODE.MAX_LENGTH,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'integer',
    enum: status,
    default: status.IN_ACTIVE,
  })
  status: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  statusNotification: boolean;

  @Column({
    type: 'date',
    nullable: true,
  })
  dateOfBirth: Date;

  @Column({
    type: 'varchar',
    length: 6,
    nullable: true,
  })
  otpCode: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  expire: Date;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({
    type: 'int',
    nullable: true,
  })
  createdBy: number;

  @Column({
    type: 'integer',
    default: TypeEnum.SYSTEM,
    nullable: true,
  })
  type: number;

  @ManyToMany(() => UserRoleSetting)
  @JoinTable({
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_role_id',
      referencedColumnName: 'id',
    },
  })
  userRoleSettings: UserRoleSetting[];

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];
}
