import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { MailHistoryEntity } from '@entities/mail/mail-history.entity';

export interface MailHistoryRepositoryInterface
  extends BaseInterfaceRepository<MailHistoryEntity> {}
