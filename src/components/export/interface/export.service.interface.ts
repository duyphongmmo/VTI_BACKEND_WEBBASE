import { ExportRequestDto } from '../dto/request/export.request.dto';
import { ExportResponseDto } from '../dto/response/export.response.dto';
import { Workbook } from 'exceljs';

export interface ExportServiceInterface {
  export(request: ExportRequestDto): Promise<ExportResponseDto>;
  exportDashboard(request: ExportRequestDto): Promise<Workbook>;
}
