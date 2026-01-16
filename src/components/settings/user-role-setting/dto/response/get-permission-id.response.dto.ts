import { Expose } from 'class-transformer';

export class GetPermissionIdResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  code: string;
}
