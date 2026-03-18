import { Controller, Get } from '@nestjs/common'
import { envelope } from '../common/api-envelope'
import { HealthService } from './health.service'

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth() {
    return envelope(this.healthService.getHealth())
  }
}
