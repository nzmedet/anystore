import { Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { PrismaService } from '../common/prisma.service'

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async getSession() {
    const user = await this.prisma.client.user.findFirst({
      orderBy: { createdAt: 'asc' },
      include: {
        memberships: {
          orderBy: { createdAt: 'asc' },
          include: {
            workspace: true
          }
        }
      }
    })

    const membership = user?.memberships[0]
    if (!user || !membership) {
      return null
    }

    return {
      userId: user.id,
      email: user.email,
      displayName: user.displayName ?? 'Anonymous User',
      workspaceId: membership.workspaceId,
      workspaceName: membership.workspace.name
    }
  }

  async signIn(body: { email?: string; displayName?: string }) {
    const workspace = await this.prisma.client.workspace.findFirst({
      orderBy: { createdAt: 'asc' }
    })
    const email = body.email ?? 'demo@anystore.dev'
    const displayName = body.displayName ?? 'Demo User'

    const user = await this.prisma.client.user.upsert({
      where: { email },
      update: { displayName },
      create: {
        id: randomUUID(),
        email,
        displayName
      }
    })

    if (workspace) {
      await this.prisma.client.workspaceMember.upsert({
        where: {
          workspaceId_userId: {
            workspaceId: workspace.id,
            userId: user.id
          }
        },
        update: {},
        create: {
          id: randomUUID(),
          workspaceId: workspace.id,
          userId: user.id,
          role: 'editor'
        }
      })
    }

    return this.getSession()
  }

  signOut() {
    return { signedOut: true }
  }
}
