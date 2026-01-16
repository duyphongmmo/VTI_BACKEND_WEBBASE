import { BaseCommonEntity } from '@core/entity/base.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('system_log')
export class SystemLogEntity extends BaseCommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  action: string;

  @Column({ type: 'text', nullable: true })
  info: boolean;
}
