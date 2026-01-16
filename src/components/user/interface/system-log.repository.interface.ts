import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { SystemLogEntity } from '@entities/user/login-log.entity';

export interface SystemLogRepositoryInterface extends BaseInterfaceRepository<SystemLogEntity> {
  createLog(action, info): SystemLogEntity;
}
