import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { envelope } from '../common/api-envelope'
import { ReleasesService } from './releases.service'

@Controller('releases')
export class ReleasesController {
  constructor(private readonly releasesService: ReleasesService) {}

  @Get()
  async list(@Query('appId') appId?: string) {
    return envelope(await this.releasesService.list(appId))
  }

  @Post()
  async create(@Body() body: { appId: string; versionLabel: string; releaseName?: string | null; createdBy?: string }) {
    return envelope(await this.releasesService.create(body))
  }

  @Get(':releaseId')
  async get(@Param('releaseId') releaseId: string) {
    return envelope(await this.releasesService.get(releaseId))
  }

  @Patch(':releaseId')
  async update(@Param('releaseId') releaseId: string, @Body() body: { releaseName?: string | null; status?: string; freezeState?: 'mutable' | 'frozen' }) {
    return envelope(await this.releasesService.update(releaseId, body))
  }

  @Post(':releaseId/clone')
  async clone(@Param('releaseId') releaseId: string) {
    return envelope(await this.releasesService.clone(releaseId))
  }

  @Post(':releaseId/freeze')
  async freeze(@Param('releaseId') releaseId: string) {
    return envelope(await this.releasesService.freeze(releaseId))
  }

  @Post(':releaseId/unfreeze')
  async unfreeze(@Param('releaseId') releaseId: string) {
    return envelope(await this.releasesService.unfreeze(releaseId))
  }

  @Get(':releaseId/platform-states')
  async listPlatformStates(@Param('releaseId') releaseId: string) {
    return envelope(await this.releasesService.listPlatformStates(releaseId))
  }

  @Post(':releaseId/platform-states')
  async addPlatformState(
    @Param('releaseId') releaseId: string,
    @Body() body: { platform: 'ios' | 'android'; targetTrack?: string | null; desiredVersionName?: string | null; desiredBuildNumber?: string | null; attachedBuildId?: string | null; submissionStatus?: 'not_submitted' | 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'live'; reviewStatus?: 'not_submitted' | 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'live' | null; syncStatus?: 'queued' | 'running' | 'succeeded' | 'partially_failed' | 'failed' | 'cancelled' | null; remoteReleaseId?: string | null }
  ) {
    return envelope(await this.releasesService.addPlatformState(releaseId, body))
  }
}
