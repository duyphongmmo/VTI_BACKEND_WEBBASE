import { Expose } from 'class-transformer';

export class IdResponseDto {
  @Expose()
  id: number;
}
