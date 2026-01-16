import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@utils/success.response.dto';
import { isEmpty } from 'lodash';
import { GetDashboardDto } from './dto/request/get-dashboard.request.dto';
import { DashboardServiceInterface } from './interface/dashboard.service.interface';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(
    @Inject('DashboardServiceInterface')
    private readonly dashboardService: DashboardServiceInterface,
  ) {}

  @ApiOperation({
    summary: 'Get dashboard data with reports and statistics',
    description:
      'Retrieve dashboard data including reports list and aggregated statistics',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
    type: SuccessResponse,
  })
  @Get()
  async getDashboard(@Query() query: GetDashboardDto) {
    const { responseError } = query as any;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.dashboardService.getDashboardData(query);
  }

  @Get('oracle')
  async getDashboardOracle(@Query() query: GetDashboardDto) {
    const { responseError } = query as any;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.dashboardService.getDashboardDataOracle(query);
  }
}
