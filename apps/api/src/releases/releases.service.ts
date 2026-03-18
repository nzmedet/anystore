import { Injectable } from '@nestjs/common'
import { Prisma } from '@anystore/database'
import { PrismaService } from '../common/prisma.service'
import { randomUUID } from 'node:crypto'

function toInputJson(value: Prisma.JsonValue): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  return value === null ? Prisma.JsonNull : (value as Prisma.InputJsonValue)
}

@Injectable()
export class ReleasesService {
  constructor(private readonly prisma: PrismaService) {}

  list(appId?: string) {
    return this.prisma.client.release.findMany({
      where: appId ? { appId } : undefined,
      orderBy: { createdAt: 'desc' }
    })
  }

  async create(body: any) {
    const user = await this.prisma.getCurrentUser()
    const release = await this.prisma.client.release.create({
      data: {
        id: randomUUID(),
        appId: body.appId,
        versionLabel: body.versionLabel,
        releaseName: body.releaseName ?? null,
        status: 'draft',
        freezeState: 'mutable',
        sourceReleaseId: body.sourceReleaseId ?? null,
        createdBy: body.createdBy ?? user.id
      }
    })

    await this.prisma.writeAudit({
      workspaceId: (await this.prisma.client.app.findUniqueOrThrow({ where: { id: body.appId } })).workspaceId,
      appId: body.appId,
      releaseId: release.id,
      actorUserId: user.id,
      eventType: 'release.created',
      payload: { releaseId: release.id }
    })

    return release
  }

  get(releaseId: string) {
    return this.prisma.client.release.findUniqueOrThrow({
      where: { id: releaseId }
    })
  }

  async update(releaseId: string, body: any) {
    const release = await this.prisma.client.release.update({
      where: { id: releaseId },
      data: body
    })
    await this.prisma.writeAudit({
      workspaceId: (await this.prisma.client.app.findUniqueOrThrow({ where: { id: release.appId } })).workspaceId,
      appId: release.appId,
      releaseId,
      eventType: 'release.updated',
      payload: body
    })
    return release
  }

  async clone(releaseId: string) {
    const source = await this.get(releaseId)
    const clone = await this.prisma.client.release.create({
      data: {
        id: randomUUID(),
        appId: source.appId,
        versionLabel: `${source.versionLabel}-clone`,
        releaseName: source.releaseName ? `${source.releaseName} Copy` : 'Cloned release',
        status: 'draft',
        freezeState: 'mutable',
        sourceReleaseId: source.id,
        createdBy: source.createdBy
      }
    })
    return clone
  }

  async freeze(releaseId: string) {
    const release = await this.prisma.client.release.update({
      where: { id: releaseId },
      data: {
        freezeState: 'frozen',
        status: 'ready_to_sync'
      }
    })

    const existingSnapshot = await this.prisma.client.metadataDocument.findFirst({
      where: {
        appId: release.appId,
        scopeType: 'release_snapshot',
        scopeId: release.id
      }
    })

    if (!existingSnapshot) {
      const draft = await this.prisma.client.metadataDocument.findFirst({
        where: {
          appId: release.appId,
          scopeType: 'app_draft'
        },
        include: { entries: true }
      })

      if (draft) {
        await this.prisma.client.metadataDocument.create({
          data: {
            id: randomUUID(),
            appId: release.appId,
            scopeType: 'release_snapshot',
            scopeId: release.id,
            entries: {
              create: draft.entries.map((entry: (typeof draft.entries)[number]) => ({
                id: randomUUID(),
                localeCode: entry.localeCode,
                platform: entry.platform,
                fieldKey: entry.fieldKey,
                valueJson: toInputJson(entry.valueJson),
                sourceLayer: 'release_snapshot'
              }))
            }
          }
        })
      }
    }

    return release
  }

  async unfreeze(releaseId: string) {
    return this.prisma.client.release.update({
      where: { id: releaseId },
      data: {
        freezeState: 'mutable',
        status: 'draft'
      }
    })
  }

  listPlatformStates(releaseId: string) {
    return this.prisma.client.releasePlatformState.findMany({
      where: { releaseId },
      orderBy: { platform: 'asc' }
    })
  }

  addPlatformState(releaseId: string, body: any) {
    return this.prisma.client.releasePlatformState.create({
      data: {
        id: randomUUID(),
        releaseId,
        platform: body.platform,
        targetTrack: body.targetTrack ?? null,
        desiredVersionName: body.desiredVersionName ?? null,
        desiredBuildNumber: body.desiredBuildNumber ?? null,
        attachedBuildId: body.attachedBuildId ?? null,
        submissionStatus: body.submissionStatus ?? 'not_submitted',
        reviewStatus: body.reviewStatus ?? null,
        syncStatus: body.syncStatus ?? null,
        remoteReleaseId: body.remoteReleaseId ?? null,
        lastSyncAt: null
      }
    })
  }
}
