import { Injectable } from '@nestjs/common'
import { ApiStoreService } from '../common/api-store.service'

@Injectable()
export class WorkspacesService {
  constructor(private readonly store: ApiStoreService) {}

  list(workspaceId?: string) {
    return workspaceId ? [this.store.getWorkspace(workspaceId)] : this.store.listWorkspaces()
  }

  create(body: { name: string; slug?: string }) {
    return this.store.createWorkspace(body)
  }

  get(workspaceId: string) {
    return this.store.getWorkspace(workspaceId)
  }

  update(workspaceId: string, body: { name?: string; slug?: string }) {
    return this.store.updateWorkspace(workspaceId, body)
  }

  listMembers(workspaceId: string) {
    return this.store.listWorkspaceMembers(workspaceId)
  }

  addMember(workspaceId: string, body: { userId: string; role: 'owner' | 'admin' | 'editor' | 'reviewer' | 'viewer' }) {
    return this.store.addWorkspaceMember(workspaceId, body.userId, body.role)
  }
}
