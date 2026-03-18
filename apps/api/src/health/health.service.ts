import { Injectable } from '@nestjs/common'
import { ApiStoreService } from '../common/api-store.service'

@Injectable()
export class HealthService {
  constructor(private readonly store: ApiStoreService) {}

  getHealth() {
    return this.store.getHealth()
  }
}
