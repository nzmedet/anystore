import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { envelope } from '../common/api-envelope'
import { AppsService } from './apps.service'

@Controller('apps')
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @Get()
  async list(@Query('workspaceId') workspaceId?: string) {
    return envelope(await this.appsService.list(workspaceId))
  }

  @Post()
  async create(@Body() body: { workspaceId: string; slug: string; internalName: string; canonicalProductName: string; primaryLocale: string }) {
    return envelope(await this.appsService.create(body))
  }

  @Get(':appId')
  async get(@Param('appId') appId: string) {
    return envelope(await this.appsService.get(appId))
  }

  @Patch(':appId')
  async update(@Param('appId') appId: string, @Body() body: { slug?: string; internalName?: string; canonicalProductName?: string; primaryLocale?: string; status?: 'active' | 'archived' }) {
    return envelope(await this.appsService.update(appId, body))
  }

  @Post(':appId/archive')
  async archive(@Param('appId') appId: string) {
    return envelope(await this.appsService.archive(appId))
  }

  @Get(':appId/platforms')
  async listPlatforms(@Param('appId') appId: string) {
    return envelope(await this.appsService.listPlatforms(appId))
  }

  @Post(':appId/platforms')
  async addPlatform(
    @Param('appId') appId: string,
    @Body() body: { platform: 'ios' | 'android'; bundleOrPackageId: string; remoteAppId?: string | null; defaultTrack?: string | null }
  ) {
    return envelope(await this.appsService.addPlatform(appId, body))
  }

  @Get(':appId/locales')
  async listLocales(@Param('appId') appId: string) {
    return envelope(await this.appsService.listLocales(appId))
  }

  @Post(':appId/locales')
  async addLocale(@Param('appId') appId: string, @Body() body: { localeCode: string }) {
    return envelope(await this.appsService.addLocale(appId, body))
  }
}
