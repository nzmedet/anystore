import { Injectable } from '@nestjs/common'
import { ApiStoreService } from '../common/api-store.service'

@Injectable()
export class ActivityService {
  constructor(private readonly store: ApiStoreService) {}

  list(workspaceId?: string, appId?: string, releaseId?: string) {
    return this.store.listActivity(workspaceId, appId, releaseId)
  }
}
