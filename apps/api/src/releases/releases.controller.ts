import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { envelope } from '../common/api-envelope'
import { ReleasesService } from './releases.service'

@Controller('releases')
export class ReleasesController {
  constructor(private readonly releasesService: ReleasesService) {}

  @Get()
  list(@Query('appId') appId?: string) {
    return envelope(this.releasesService.list(appId))
  }

  @Post()
  create(@Body() body: { appId: string; versionLabel: string; releaseName?: string | null; createdBy?: string }) {
    return envelope(this.releasesService.create(body))
  }

  @Get(':releaseId')
  get(@Param('releaseId') releaseId: string) {
    return envelope(this.releasesService.get(releaseId))
  }

  @Patch(':releaseId')
  update(@Param('releaseId') releaseId: string, @Body() body: { releaseName?: string | null; status?: string; freezeState?: 'mutable' | 'frozen' }) {
    return envelope(this.releasesService.update(releaseId, body))
  }

  @Post(':releaseId/clone')
  clone(@Param('releaseId') releaseId: string) {
    return envelope(this.releasesService.clone(releaseId))
  }

  @Post(':releaseId/freeze')
  freeze(@Param('releaseId') releaseId: string) {
    return envelope(this.releasesService.freeze(releaseId))
  }

  @Post(':releaseId/unfreeze')
  unfreeze(@Param('releaseId') releaseId: string) {
    return envelope(this.releasesService.unfreeze(releaseId))
  }

  @Get(':releaseId/platform-states')
  listPlatformStates(@Param('releaseId') releaseId: string) {
    return envelope(this.releasesService.listPlatformStates(releaseId))
  }

  @Post(':releaseId/platform-states')
  addPlatformState(
    @Param('releaseId') releaseId: string,
    @Body() body: { platform: 'ios' | 'android'; targetTrack?: string | null; desiredVersionName?: string | null; desiredBuildNumber?: string | null; attachedBuildId?: string | null; submissionStatus?: 'not_submitted' | 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'live'; reviewStatus?: 'not_submitted' | 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'live' | null; syncStatus?: 'queued' | 'running' | 'succeeded' | 'partially_failed' | 'failed' | 'cancelled' | null; remoteReleaseId?: string | null }
  ) {
    return envelope(this.releasesService.addPlatformState(releaseId, body))
  }
}
