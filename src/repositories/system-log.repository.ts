import { SystemLogRepositoryInterface } from '@components/user/interface/system-log.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { SystemLogEntity } from '@entities/user/login-log.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SystemLogRepository
  extends BaseAbstractRepository<SystemLogEntity>
  implements SystemLogRepositoryInterface
{
  constructor(
    @InjectRepository(SystemLogEntity)
    private readonly systemLogEntity: Repository<SystemLogEntity>,
  ) {
    super(systemLogEntity);
  }

  createLog(action, info): SystemLogEntity {
    const log = new SystemLogEntity();
    log.action = action;
    log.info = info;
    this.create(log);
    return log;
  }
}
