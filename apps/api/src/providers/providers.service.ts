import { Injectable } from '@nestjs/common'
import { ApiStoreService } from '../common/api-store.service'
import { PrismaService } from '../common/prisma.service'
import { randomUUID } from 'node:crypto'

@Injectable()
export class ProvidersService {
  constructor(
    private readonly store: ApiStoreService,
    private readonly prisma: PrismaService
  ) {}

  capabilities(provider?: 'app_store_connect' | 'google_play') {
    if (!provider) {
      return {
        app_store_connect: this.store.getProviderCapabilities('app_store_connect'),
        google_play: this.store.getProviderCapabilities('google_play')
      }
    }

    return this.store.getProviderCapabilities(provider)
  }

  async listConnections(workspaceId?: string) {
    const connections = await this.prisma.client.providerConnection.findMany({
      where: workspaceId ? { workspaceId } : undefined,
      orderBy: { createdAt: 'asc' }
    })

    return connections.map((connection) => ({
      id: connection.id,
      workspaceId: connection.workspaceId,
      provider: connection.provider,
      status: connection.status,
      createdAt: connection.createdAt.toISOString(),
      updatedAt: connection.updatedAt.toISOString()
    }))
  }

  async createConnection(body: any) {
    const connection = await this.prisma.client.providerConnection.create({
      data: {
        id: randomUUID(),
        workspaceId: body.workspaceId,
        provider: body.provider,
        label: body.label ?? `${body.provider} connection`,
        status: body.status ?? 'pending',
        credentialsJson: body.credentialsJson ?? {}
      }
    })

    await this.prisma.writeAudit({
      workspaceId: connection.workspaceId,
      eventType: 'provider.connection.created',
      payload: {
        connectionId: connection.id,
        provider: connection.provider,
        status: connection.status
      }
    })

    return {
      id: connection.id,
      workspaceId: connection.workspaceId,
      provider: connection.provider,
      status: connection.status,
      createdAt: connection.createdAt.toISOString(),
      updatedAt: connection.updatedAt.toISOString()
    }
  }

  async getConnection(connectionId: string) {
    const connection = await this.prisma.client.providerConnection.findUniqueOrThrow({
      where: { id: connectionId }
    })

    return {
      id: connection.id,
      workspaceId: connection.workspaceId,
      provider: connection.provider,
      status: connection.status,
      createdAt: connection.createdAt.toISOString(),
      updatedAt: connection.updatedAt.toISOString()
    }
  }

  async updateConnection(connectionId: string, body: any) {
    const connection = await this.prisma.client.providerConnection.update({
      where: { id: connectionId },
      data: {
        status: body.status,
        label: body.label,
        credentialsJson: body.credentialsJson
      }
    })

    await this.prisma.writeAudit({
      workspaceId: connection.workspaceId,
      eventType: 'provider.connection.updated',
      payload: {
        connectionId: connection.id,
        status: connection.status
      }
    })

    return {
      id: connection.id,
      workspaceId: connection.workspaceId,
      provider: connection.provider,
      status: connection.status,
      createdAt: connection.createdAt.toISOString(),
      updatedAt: connection.updatedAt.toISOString()
    }
  }
}
