import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { envelope } from '../common/api-envelope'
import { SyncService } from './sync.service'

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('diff')
  diff(@Body() body: { releaseId: string; provider: 'app_store_connect' | 'google_play' }) {
    return envelope(this.syncService.diff(body.releaseId, body.provider))
  }

  @Post('plans')
  plan(@Body() body: { releaseId: string; provider: 'app_store_connect' | 'google_play' }) {
    return envelope(this.syncService.plan(body.releaseId, body.provider))
  }

  @Post('jobs')
  createJob(@Body() body: { releaseId: string }) {
    return envelope(this.syncService.createJob(body.releaseId))
  }

  @Get('jobs/:jobId')
  getJob(@Param('jobId') jobId: string) {
    return envelope(this.syncService.getJob(jobId))
  }

  @Get('jobs')
  listJobs(@Query('releaseId') releaseId?: string) {
    return envelope(this.syncService.listJobs(releaseId))
  }
}
