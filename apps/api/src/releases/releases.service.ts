import { Injectable } from '@nestjs/common'
import { ApiStoreService } from '../common/api-store.service'

@Injectable()
export class ReleasesService {
  constructor(private readonly store: ApiStoreService) {}

  list(appId?: string) {
    return this.store.listReleases(appId)
  }

  create(body: any) {
    return this.store.createRelease(body)
  }

  get(releaseId: string) {
    return this.store.getRelease(releaseId)
  }

  update(releaseId: string, body: any) {
    return this.store.updateRelease(releaseId, body)
  }

  clone(releaseId: string) {
    return this.store.cloneRelease(releaseId)
  }

  freeze(releaseId: string) {
    return this.store.freezeRelease(releaseId)
  }

  unfreeze(releaseId: string) {
    return this.store.unfreezeRelease(releaseId)
  }

  listPlatformStates(releaseId: string) {
    return this.store.listReleasePlatformStates(releaseId)
  }

  addPlatformState(
    releaseId: string,
    body: any
  ) {
    return this.store.addReleasePlatformState(releaseId, body)
  }
}
