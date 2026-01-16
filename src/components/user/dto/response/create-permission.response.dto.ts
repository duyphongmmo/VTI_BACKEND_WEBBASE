import { Expose } from 'class-transformer';

export class CreatePermissionResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  code: string;
}
