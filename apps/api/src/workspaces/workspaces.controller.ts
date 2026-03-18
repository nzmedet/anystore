import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { envelope } from '../common/api-envelope'
import { WorkspacesService } from './workspaces.service'

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  async list(@Query('workspaceId') workspaceId?: string) {
    return envelope(await this.workspacesService.list(workspaceId))
  }

  @Post()
  async create(@Body() body: { name: string; slug?: string }) {
    return envelope(await this.workspacesService.create(body))
  }

  @Get(':workspaceId')
  async get(@Param('workspaceId') workspaceId: string) {
    return envelope(await this.workspacesService.get(workspaceId))
  }

  @Patch(':workspaceId')
  async update(@Param('workspaceId') workspaceId: string, @Body() body: { name?: string; slug?: string }) {
    return envelope(await this.workspacesService.update(workspaceId, body))
  }

  @Get(':workspaceId/members')
  async listMembers(@Param('workspaceId') workspaceId: string) {
    return envelope(await this.workspacesService.listMembers(workspaceId))
  }

  @Post(':workspaceId/members')
  async addMember(@Param('workspaceId') workspaceId: string, @Body() body: { userId: string; role: 'owner' | 'admin' | 'editor' | 'reviewer' | 'viewer' }) {
    return envelope(await this.workspacesService.addMember(workspaceId, body))
  }
}
