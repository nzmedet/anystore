import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, prisma } from '@anystore/database'
import { randomUUID } from 'node:crypto'

@Injectable()
export class PrismaService {
  readonly client = prisma

  async getCurrentUser() {
    const user = await this.client.user.findFirst({
      orderBy: { createdAt: 'asc' }
    })

    if (!user) {
      throw new NotFoundException('No user found in database')
    }

    return user
  }

  async writeAudit(input: {
    workspaceId: string
    appId?: string | null
    releaseId?: string | null
    actorUserId?: string | null
    eventType: string
    payload?: Record<string, unknown>
  }) {
    await this.client.auditEvent.create({
      data: {
        id: randomUUID(),
        workspaceId: input.workspaceId,
        appId: input.appId ?? null,
        releaseId: input.releaseId ?? null,
        actorUserId: input.actorUserId ?? null,
        eventType: input.eventType,
        payloadJson: (input.payload ?? {}) as Prisma.InputJsonValue
      }
    })
  }
}
