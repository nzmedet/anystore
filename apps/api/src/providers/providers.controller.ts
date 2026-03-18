import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { envelope } from '../common/api-envelope'
import { ProvidersService } from './providers.service'

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get('capabilities')
  capabilities(@Query('provider') provider?: 'app_store_connect' | 'google_play') {
    return envelope(this.providersService.capabilities(provider))
  }

  @Get('connections')
  async listConnections(@Query('workspaceId') workspaceId?: string) {
    return envelope(await this.providersService.listConnections(workspaceId))
  }

  @Post('connections')
  async createConnection(@Body() body: { workspaceId: string; provider: 'app_store_connect' | 'google_play' }) {
    return envelope(await this.providersService.createConnection(body))
  }

  @Get('connections/:connectionId')
  async getConnection(@Param('connectionId') connectionId: string) {
    return envelope(await this.providersService.getConnection(connectionId))
  }

  @Patch('connections/:connectionId')
  async updateConnection(@Param('connectionId') connectionId: string, @Body() body: { status?: 'connected' | 'expired' | 'invalid' | 'pending' }) {
    return envelope(await this.providersService.updateConnection(connectionId, body))
  }
}
