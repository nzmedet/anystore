import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'
import { randomUUID } from 'node:crypto'

@Injectable()
export class AppsService {
  constructor(private readonly prisma: PrismaService) {}

  list(workspaceId?: string) {
    return this.prisma.client.app.findMany({
      where: workspaceId ? { workspaceId } : undefined,
      orderBy: { createdAt: 'asc' }
    })
  }

  async create(body: any) {
    const app = await this.prisma.client.app.create({
      data: {
        id: randomUUID(),
        workspaceId: body.workspaceId,
        slug: body.slug,
        internalName: body.internalName,
        canonicalProductName: body.canonicalProductName,
        primaryLocale: body.primaryLocale,
        status: 'active'
      }
    })

    await this.prisma.client.metadataDocument.create({
      data: {
        id: randomUUID(),
        appId: app.id,
        scopeType: 'app_draft',
        scopeId: app.id
      }
    })

    await this.prisma.writeAudit({
      workspaceId: app.workspaceId,
      appId: app.id,
      eventType: 'app.created',
      payload: { appId: app.id }
    })

    return app
  }

  get(appId: string) {
    return this.prisma.client.app.findUniqueOrThrow({
      where: { id: appId }
    })
  }

  async update(appId: string, body: any) {
    const app = await this.prisma.client.app.update({
      where: { id: appId },
      data: body
    })

    await this.prisma.writeAudit({
      workspaceId: app.workspaceId,
      appId: app.id,
      eventType: 'app.updated',
      payload: body
    })

    return app
  }

  async archive(appId: string) {
    const app = await this.prisma.client.app.update({
      where: { id: appId },
      data: {
        status: 'archived',
        archivedAt: new Date()
      }
    })

    await this.prisma.writeAudit({
      workspaceId: app.workspaceId,
      appId: app.id,
      eventType: 'app.archived',
      payload: { archivedAt: app.archivedAt?.toISOString() }
    })

    return app
  }

  listPlatforms(appId: string) {
    return this.prisma.client.appPlatform.findMany({
      where: { appId },
      orderBy: { createdAt: 'asc' }
    })
  }

  async addPlatform(appId: string, body: any) {
    const platform = await this.prisma.client.appPlatform.create({
      data: {
        id: randomUUID(),
        appId,
        platform: body.platform,
        bundleOrPackageId: body.bundleOrPackageId,
        remoteAppId: body.remoteAppId ?? null,
        defaultTrack: body.defaultTrack ?? null,
        status: 'not_connected'
      }
    })

    const app = await this.get(appId)
    await this.prisma.writeAudit({
      workspaceId: app.workspaceId,
      appId,
      eventType: 'app.platform.added',
      payload: { platform: platform.platform }
    })

    return platform
  }

  listLocales(appId: string) {
    return this.prisma.client.appLocale.findMany({
      where: { appId },
      orderBy: { createdAt: 'asc' }
    })
  }

  async addLocale(appId: string, body: any) {
    const locale = await this.prisma.client.appLocale.create({
      data: {
        id: randomUUID(),
        appId,
        localeCode: body.localeCode,
        status: 'active'
      }
    })

    const app = await this.get(appId)
    await this.prisma.writeAudit({
      workspaceId: app.workspaceId,
      appId,
      eventType: 'app.locale.added',
      payload: { localeCode: locale.localeCode }
    })

    return locale
  }
}
