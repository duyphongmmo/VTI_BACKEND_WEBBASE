import { BaseCommonEntity } from '@core/entity/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tbl_reports' })
export class Report extends BaseCommonEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  reportType: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  reportDate: Date;

  @Column({
    type: 'integer',
    nullable: true,
  })
  factoryId: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  userId: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  totalValue: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  quantity: number;

  @Column({
    type: 'integer',
    default: 1,
  })
  status: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  createdBy: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  updatedBy: number;
}
