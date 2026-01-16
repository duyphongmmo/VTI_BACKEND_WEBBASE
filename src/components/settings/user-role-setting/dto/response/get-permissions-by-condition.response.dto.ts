import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { SuccessResponse } from '@utils/success.response.dto';

export class PermissionSettingResponseDto {
  @ApiProperty({ example: 'ITEM_LIST_ITEM', description: '' })
  @Expose()
  permissionSettingCode: string;
}

export class GetPermissionsByConditionResponseDto extends SuccessResponse {
  @Expose()
  @Type(() => PermissionSettingResponseDto)
  @IsArray()
  @ApiProperty({
    isArray: true,
    type: PermissionSettingResponseDto,
  })
  data: PermissionSettingResponseDto[];
}
