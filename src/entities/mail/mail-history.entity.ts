import { BINARY_ENUM } from '@constant/common';
import { BaseCommonEntity } from '@core/entity/base.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TYPE_LOG {
  DELETE,
  UPDATE,
}

@Entity({ name: 'tbl_mail_history' })
export class MailHistoryEntity extends BaseCommonEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'integer',
  })
  sentBy: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  sentTo: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  cc: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  bcc: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'integer',
  })
  status: BINARY_ENUM;
}
