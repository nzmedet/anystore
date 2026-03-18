import { Injectable } from '@nestjs/common'
import { ApiStoreService } from '../common/api-store.service'

@Injectable()
export class AppsService {
  constructor(private readonly store: ApiStoreService) {}

  list(workspaceId?: string) {
    return this.store.listApps(workspaceId)
  }

  create(body: any) {
    return this.store.createApp(body)
  }

  get(appId: string) {
    return this.store.getApp(appId)
  }

  update(appId: string, body: any) {
    return this.store.updateApp(appId, body)
  }

  archive(appId: string) {
    return this.store.archiveApp(appId)
  }

  listPlatforms(appId: string) {
    return this.store.listPlatforms(appId)
  }

  addPlatform(appId: string, body: any) {
    return this.store.addPlatform(appId, body)
  }

  listLocales(appId: string) {
    return this.store.listLocales(appId)
  }

  addLocale(appId: string, body: any) {
    return this.store.addLocale(appId, body)
  }
}
