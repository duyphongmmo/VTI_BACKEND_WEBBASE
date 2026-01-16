import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@core/decorator/set-public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('/')
@ApiBearerAuth('access-token')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Public()
  @Get('health')
  getHealth(): string {
    return this.appService.getHealth();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
