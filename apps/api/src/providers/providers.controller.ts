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
  listConnections(@Query('workspaceId') workspaceId?: string) {
    return envelope(this.providersService.listConnections(workspaceId))
  }

  @Post('connections')
  createConnection(@Body() body: { workspaceId: string; provider: 'app_store_connect' | 'google_play' }) {
    return envelope(this.providersService.createConnection(body))
  }

  @Get('connections/:connectionId')
  getConnection(@Param('connectionId') connectionId: string) {
    return envelope(this.providersService.getConnection(connectionId))
  }

  @Patch('connections/:connectionId')
  updateConnection(@Param('connectionId') connectionId: string, @Body() body: { status?: 'connected' | 'expired' | 'invalid' | 'pending' }) {
    return envelope(this.providersService.updateConnection(connectionId, body))
  }
}
