import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExportServiceInterface } from './interface/export.service.interface';
import { ExportRequestDto } from './dto/request/export.request.dto';
import { ExportResponseDto } from './dto/response/export.response.dto';
import { isEmpty } from 'lodash';

@ApiTags('Export')
@Controller('export')
@ApiBearerAuth('access-token')
export class ExportController {
  constructor(
    @Inject('ExportServiceInterface')
    private readonly exportService: ExportServiceInterface,
  ) {}

  @ApiOperation({ summary: 'Export dashboard to Excel' })
  @Post()
  async export(@Body() payload: ExportRequestDto): Promise<ExportResponseDto> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.exportService.export(request);
  }
}
