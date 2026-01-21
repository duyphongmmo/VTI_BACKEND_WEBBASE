import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";
import { PaginationQuery } from "@utils/pagination.query";
import { BaseDto } from "@core/dto/base.dto";

export class GetDetailYieldDto extends BaseDto {
  @ApiPropertyOptional({ description: "Proc Date (YYYY-MM-DD)" })
  @IsString()
  @IsOptional()
  procDate?: string;
}
