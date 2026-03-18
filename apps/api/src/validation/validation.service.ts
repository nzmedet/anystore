import { Injectable } from '@nestjs/common'
import { ApiStoreService } from '../common/api-store.service'

@Injectable()
export class ValidationService {
  constructor(private readonly store: ApiStoreService) {}

  listIssues(releaseId?: string) {
    return this.store.listValidationIssues(releaseId)
  }

  getRun(runId: string) {
    return this.store.getValidationRun(runId)
  }

  run(releaseId: string) {
    return this.store.runValidation(releaseId)
  }
}
