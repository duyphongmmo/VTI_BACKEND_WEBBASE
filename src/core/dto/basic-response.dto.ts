import { Expose } from 'class-transformer';

export class BasicResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  code: string;
}
