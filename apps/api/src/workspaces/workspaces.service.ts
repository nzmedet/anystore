import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'
import { randomUUID } from 'node:crypto'

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(workspaceId?: string) {
    return this.prisma.client.workspace.findMany({
      where: workspaceId ? { id: workspaceId } : undefined,
      orderBy: { createdAt: 'asc' }
    })
  }

  async create(body: { name: string; slug?: string }) {
    const user = await this.prisma.getCurrentUser()
    const workspace = await this.prisma.client.workspace.create({
      data: {
        id: randomUUID(),
        name: body.name,
        slug: body.slug ?? body.name.toLowerCase().replace(/\s+/g, '-'),
        ownerUserId: user.id
      }
    })

    await this.prisma.client.workspaceMember.create({
      data: {
        id: randomUUID(),
        workspaceId: workspace.id,
        userId: user.id,
        role: 'owner'
      }
    })

    await this.prisma.writeAudit({
      workspaceId: workspace.id,
      actorUserId: user.id,
      eventType: 'workspace.created',
      payload: { workspaceId: workspace.id }
    })

    return workspace
  }

  get(workspaceId: string) {
    return this.prisma.client.workspace.findUniqueOrThrow({
      where: { id: workspaceId }
    })
  }

  async update(workspaceId: string, body: { name?: string; slug?: string }) {
    const workspace = await this.prisma.client.workspace.update({
      where: { id: workspaceId },
      data: body
    })

    await this.prisma.writeAudit({
      workspaceId,
      eventType: 'workspace.updated',
      payload: body
    })

    return workspace
  }

  listMembers(workspaceId: string) {
    return this.prisma.client.workspaceMember.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'asc' }
    })
  }

  async addMember(workspaceId: string, body: { userId: string; role: 'owner' | 'admin' | 'editor' | 'reviewer' | 'viewer' }) {
    const member = await this.prisma.client.workspaceMember.upsert({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: body.userId
        }
      },
      update: { role: body.role },
      create: {
        id: randomUUID(),
        workspaceId,
        userId: body.userId,
        role: body.role
      }
    })

    await this.prisma.writeAudit({
      workspaceId,
      actorUserId: body.userId,
      eventType: 'workspace.member.role_updated',
      payload: { memberId: member.id, role: body.role }
    })

    return member
  }
}
