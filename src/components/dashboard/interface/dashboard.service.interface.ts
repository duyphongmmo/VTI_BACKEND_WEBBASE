import { GetDashboardDto } from '../dto/request/get-dashboard.request.dto';
import { ResponsePayload } from '@utils/response-payload';

export interface DashboardServiceInterface {
  getDashboardData(request: GetDashboardDto): Promise<ResponsePayload<any>>;
  getDashboardDataOracle(
    request: GetDashboardDto,
  ): Promise<ResponsePayload<any>>;
}
