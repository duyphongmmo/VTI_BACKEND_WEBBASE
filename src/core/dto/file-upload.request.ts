import { IsNotEmpty } from 'class-validator';
import { BaseDto } from './base.dto';

export class File {
  filename: string;
  data: ArrayBuffer;
  encoding: string;
  mimetype: string;
  limit: boolean;
}

export class FileUpdloadRequestDto extends BaseDto {
  @IsNotEmpty()
  file: File[];
}
