import { Injectable } from '@nestjs/common'
import { ApiStoreService } from '../common/api-store.service'

@Injectable()
export class MetadataService {
  constructor(private readonly store: ApiStoreService) {}

  listDocuments(appId?: string) {
    return this.store.listMetadataDocuments(appId)
  }

  getDocument(documentId: string) {
    return this.store.getMetadataDocument(documentId)
  }

  createDocument(body: any) {
    return this.store.createMetadataDocument(body)
  }

  upsertEntries(documentId: string, body: any) {
    return this.store.upsertMetadataEntries(documentId, body)
  }

  resolve(documentId: string) {
    return this.store.resolveMetadata(documentId)
  }
}
