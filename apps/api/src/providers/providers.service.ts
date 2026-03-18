import { Injectable } from '@nestjs/common'
import { ApiStoreService } from '../common/api-store.service'

@Injectable()
export class ProvidersService {
  constructor(private readonly store: ApiStoreService) {}

  capabilities(provider?: 'app_store_connect' | 'google_play') {
    if (!provider) {
      return {
        app_store_connect: this.store.getProviderCapabilities('app_store_connect'),
        google_play: this.store.getProviderCapabilities('google_play')
      }
    }

    return this.store.getProviderCapabilities(provider)
  }

  listConnections(workspaceId?: string) {
    return this.store.listProviderConnections(workspaceId)
  }

  createConnection(body: any) {
    return this.store.createProviderConnection(body)
  }

  getConnection(connectionId: string) {
    return this.store.getProviderConnection(connectionId)
  }

  updateConnection(connectionId: string, body: any) {
    return this.store.updateProviderConnection(connectionId, body)
  }
}
