import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async list(workspaceId?: string, appId?: string, releaseId?: string) {
    const events = await this.prisma.client.auditEvent.findMany({
      where: {
        workspaceId,
        appId,
        releaseId
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    return events.map((event) => ({
      id: event.id,
      workspaceId: event.workspaceId,
      appId: event.appId,
      releaseId: event.releaseId,
      actorUserId: event.actorUserId,
      eventType: event.eventType,
      message: event.eventType,
      payload: event.payloadJson,
      createdAt: event.createdAt.toISOString()
    }))
  }
}
