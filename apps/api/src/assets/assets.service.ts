import { Injectable } from '@nestjs/common'
import { ApiStoreService } from '../common/api-store.service'

@Injectable()
export class AssetsService {
  constructor(private readonly store: ApiStoreService) {}

  list(appId?: string, releaseId?: string) {
    return this.store.listAssets(appId, releaseId)
  }

  create(body: any) {
    return this.store.createAsset(body)
  }

  get(assetId: string) {
    return this.store.getAsset(assetId)
  }

  update(assetId: string, body: any) {
    return this.store.updateAsset(assetId, body)
  }

  presign(body: any) {
    return this.store.createSignedUpload(body)
  }

  archive(assetId: string) {
    return this.store.updateAsset(assetId, { status: 'archived' })
  }
}
