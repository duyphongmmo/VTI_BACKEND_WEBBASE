import { PagingResponse } from '@utils/paging.response';
import { Expose } from 'class-transformer';

export class GetListUserRoleSettingResponseDto extends PagingResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  code: string;

  @Expose()
  description: string;

  @Expose()
  status: string;
}
