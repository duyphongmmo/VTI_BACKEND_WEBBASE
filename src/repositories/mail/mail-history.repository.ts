import { MailHistoryRepositoryInterface } from '@components/mail/interface/mail-history.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { MailHistoryEntity } from '@entities/mail/mail-history.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MailHistoryRepository
  extends BaseAbstractRepository<MailHistoryEntity>
  implements MailHistoryRepositoryInterface
{
  constructor(
    @InjectRepository(MailHistoryEntity)
    private readonly MailHistoryEntity: Repository<MailHistoryEntity>,
  ) {
    super(MailHistoryEntity);
  }
}
