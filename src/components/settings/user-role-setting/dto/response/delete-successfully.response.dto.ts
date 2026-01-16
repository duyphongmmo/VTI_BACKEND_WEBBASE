import { Expose } from 'class-transformer';

export class DeleteSuccessfullyResponseDto {
  @Expose()
  id: number;
}
