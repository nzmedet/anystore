import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { envelope } from '../common/api-envelope'
import { AppsService } from './apps.service'

@Controller('apps')
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @Get()
  list(@Query('workspaceId') workspaceId?: string) {
    return envelope(this.appsService.list(workspaceId))
  }

  @Post()
  create(@Body() body: { workspaceId: string; slug: string; internalName: string; canonicalProductName: string; primaryLocale: string }) {
    return envelope(this.appsService.create(body))
  }

  @Get(':appId')
  get(@Param('appId') appId: string) {
    return envelope(this.appsService.get(appId))
  }

  @Patch(':appId')
  update(@Param('appId') appId: string, @Body() body: { slug?: string; internalName?: string; canonicalProductName?: string; primaryLocale?: string; status?: 'active' | 'archived' }) {
    return envelope(this.appsService.update(appId, body))
  }

  @Post(':appId/archive')
  archive(@Param('appId') appId: string) {
    return envelope(this.appsService.archive(appId))
  }

  @Get(':appId/platforms')
  listPlatforms(@Param('appId') appId: string) {
    return envelope(this.appsService.listPlatforms(appId))
  }

  @Post(':appId/platforms')
  addPlatform(
    @Param('appId') appId: string,
    @Body() body: { platform: 'ios' | 'android'; bundleOrPackageId: string; remoteAppId?: string | null; defaultTrack?: string | null }
  ) {
    return envelope(this.appsService.addPlatform(appId, body))
  }

  @Get(':appId/locales')
  listLocales(@Param('appId') appId: string) {
    return envelope(this.appsService.listLocales(appId))
  }

  @Post(':appId/locales')
  addLocale(@Param('appId') appId: string, @Body() body: { localeCode: string }) {
    return envelope(this.appsService.addLocale(appId, body))
  }
}
