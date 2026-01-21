import { Controller, Get, Inject, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SuccessResponse } from "@utils/success.response.dto";
import { isEmpty } from "lodash";
import { GetDashboardDto } from "./dto/request/get-dashboard.request.dto";
import { DashboardServiceInterface } from "./interface/dashboard.service.interface";
import { Public } from "@core/decorator/set-public.decorator";
import { GetDetailYieldDto } from "./dto/request/get-detail-yield.dto";

@ApiTags("Dashboard")
@Controller("dashboard")
export class DashboardController {
  constructor(
    @Inject("DashboardServiceInterface")
    private readonly dashboardService: DashboardServiceInterface,
  ) {}

  @ApiOperation({
    summary: "Get dashboard data with reports and statistics",
    description:
      "Retrieve dashboard data including reports list and aggregated statistics",
  })
  @ApiResponse({
    status: 200,
    description: "Dashboard data retrieved successfully",
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

  @Public()
  @Get("oracle")
  async getDashboardOracle(@Query() query: GetDashboardDto) {
    const { responseError } = query as any;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.dashboardService.getDashboardDataOracle(query);
  }

  @Public()
  @Get("get-dashboard-chart")
  async getDashboardChart(@Query() query: GetDashboardDto) {
    const { request, responseError } = query as any;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    console.log("request", request);
    return await this.dashboardService.getDashboardChartYield(request);
  }

  @Public()
  @Get("get-list-yield-pagination")
  async getListYieldPagination(@Query() query: GetDashboardDto) {
    const { request, responseError } = query as any;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    console.log("request", request);
    return await this.dashboardService.getDataPagination(request);
  }

  @Public()
  @Get("get-detail-yield")
  async getDetailYield(@Query() query: GetDetailYieldDto) {
    const { request, responseError } = query as any;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    console.log("request", request);
    return await this.dashboardService.getDetailYield(request);
  }
}
