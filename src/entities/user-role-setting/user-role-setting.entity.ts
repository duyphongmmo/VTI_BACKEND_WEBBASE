import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../user/user.entity';
import { ACTIVE_ENUM } from '@constant/common';

export const PRIMARY_KEY_RESET_INTERVAL = 1;
@Entity({ name: 'tbl_user_role_settings' })
export class UserRoleSetting {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  description: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => User)
  @JoinTable()
  user: User;

  @Column({
    type: 'integer',
    default: ACTIVE_ENUM.ACTIVE,
    nullable: true,
  })
  status: ACTIVE_ENUM;
}
