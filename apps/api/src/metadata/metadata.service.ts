import { Injectable } from '@nestjs/common'
import type { MetadataEntryRecord, MetadataFieldKey } from '@anystore/domain'
import { resolveEffectiveMetadata } from '@anystore/domain'
import { PrismaService } from '../common/prisma.service'
import { randomUUID } from 'node:crypto'

function toMetadataEntryRecord(entry: {
  id: string
  metadataDocumentId: string
  localeCode: string | null
  platform: MetadataEntryRecord['platform']
  fieldKey: string
  valueJson: unknown
  sourceLayer: string
  createdAt: Date
  updatedAt: Date
}): MetadataEntryRecord {
  return {
    id: entry.id,
    metadataDocumentId: entry.metadataDocumentId,
    localeCode: entry.localeCode,
    platform: entry.platform,
    fieldKey: entry.fieldKey as MetadataFieldKey,
    valueJson: entry.valueJson,
    sourceLayer: entry.sourceLayer,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString()
  }
}

@Injectable()
export class MetadataService {
  constructor(private readonly prisma: PrismaService) {}

  listDocuments(appId?: string) {
    return this.prisma.client.metadataDocument.findMany({
      where: appId ? { appId } : undefined,
      orderBy: { createdAt: 'asc' }
    })
  }

  getDocument(documentId: string) {
    return this.prisma.client.metadataDocument.findUniqueOrThrow({
      where: { id: documentId }
    })
  }

  async createDocument(body: any) {
    return this.prisma.client.metadataDocument.create({
      data: {
        id: randomUUID(),
        appId: body.appId,
        scopeType: body.scopeType ?? 'app_draft',
        scopeId: body.scopeId ?? body.appId
      }
    })
  }

  async upsertEntries(documentId: string, body: any) {
    const now = new Date()
    const document = await this.getDocument(documentId)
    const updated = []

    for (const entry of body.entries) {
      const existing = await this.prisma.client.metadataEntry.findFirst({
        where: {
          metadataDocumentId: documentId,
          fieldKey: entry.fieldKey,
          localeCode: entry.localeCode ?? null,
          platform: entry.platform ?? null
        }
      })

      const saved = existing
        ? await this.prisma.client.metadataEntry.update({
            where: { id: existing.id },
            data: {
              valueJson: entry.valueJson,
              sourceLayer: entry.sourceLayer ?? document.scopeType
            }
          })
        : await this.prisma.client.metadataEntry.create({
            data: {
              id: randomUUID(),
              metadataDocumentId: documentId,
              localeCode: entry.localeCode ?? null,
              platform: entry.platform ?? null,
              fieldKey: entry.fieldKey,
              valueJson: entry.valueJson,
              sourceLayer: entry.sourceLayer ?? document.scopeType,
              createdAt: now
            }
          })
      updated.push(saved)
    }

    await this.prisma.writeAudit({
      workspaceId: (await this.prisma.client.app.findUniqueOrThrow({ where: { id: document.appId } })).workspaceId,
      appId: document.appId,
      eventType: 'metadata.bulk_upserted',
      payload: { documentId, count: updated.length }
    })

    return updated
  }

  async resolve(documentId: string) {
    const document = await this.getDocument(documentId)
    const documentEntries = await this.prisma.client.metadataEntry.findMany({
      where: { metadataDocumentId: documentId }
    })
    const appDraftDocument = await this.prisma.client.metadataDocument.findFirst({
      where: {
        appId: document.appId,
        scopeType: 'app_draft'
      }
    })
    const appDraftEntries = appDraftDocument
      ? await this.prisma.client.metadataEntry.findMany({
          where: { metadataDocumentId: appDraftDocument.id }
        })
      : []

    const resolved = resolveEffectiveMetadata({
      appDraftEntries: appDraftEntries.map((entry: (typeof appDraftEntries)[number]) => toMetadataEntryRecord(entry)),
      releaseSnapshotEntries:
        document.scopeType === 'release_snapshot'
          ? documentEntries.map((entry: (typeof documentEntries)[number]) => toMetadataEntryRecord(entry))
          : undefined
    })

    return resolved.fields.map((field: (typeof resolved.fields)[number]) => ({
      fieldKey: field.fieldKey,
      platform: null,
      localeCode: null,
      value: field.value,
      sourceLayer: field.source
    }))
  }
}
