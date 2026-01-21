import { GetDashboardDto } from "../dto/request/get-dashboard.request.dto";
import { ResponsePayload } from "@utils/response-payload";
import { GetDetailYieldDto } from "../dto/request/get-detail-yield.dto";

export interface DashboardServiceInterface {
  getDashboardData(request: GetDashboardDto): Promise<ResponsePayload<any>>;
  getDashboardDataOracle(
    request: GetDashboardDto,
  ): Promise<ResponsePayload<any>>;

  getDashboardChartYield(
    request: GetDashboardDto,
  ): Promise<ResponsePayload<any>>;

  getDataPagination(request: GetDashboardDto): Promise<ResponsePayload<any>>;

  getDetailYield(request: GetDetailYieldDto): Promise<ResponsePayload<any>>;
}
