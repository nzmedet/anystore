import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { envelope } from '../common/api-envelope'
import { WorkspacesService } from './workspaces.service'

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  list(@Query('workspaceId') workspaceId?: string) {
    return envelope(this.workspacesService.list(workspaceId))
  }

  @Post()
  create(@Body() body: { name: string; slug?: string }) {
    return envelope(this.workspacesService.create(body))
  }

  @Get(':workspaceId')
  get(@Param('workspaceId') workspaceId: string) {
    return envelope(this.workspacesService.get(workspaceId))
  }

  @Patch(':workspaceId')
  update(@Param('workspaceId') workspaceId: string, @Body() body: { name?: string; slug?: string }) {
    return envelope(this.workspacesService.update(workspaceId, body))
  }

  @Get(':workspaceId/members')
  listMembers(@Param('workspaceId') workspaceId: string) {
    return envelope(this.workspacesService.listMembers(workspaceId))
  }

  @Post(':workspaceId/members')
  addMember(@Param('workspaceId') workspaceId: string, @Body() body: { userId: string; role: 'owner' | 'admin' | 'editor' | 'reviewer' | 'viewer' }) {
    return envelope(this.workspacesService.addMember(workspaceId, body))
  }
}
