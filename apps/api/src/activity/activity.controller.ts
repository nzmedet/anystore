import { Controller, Get, Query } from '@nestjs/common'
import { envelope } from '../common/api-envelope'
import { ActivityService } from './activity.service'

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  list(@Query('workspaceId') workspaceId?: string, @Query('appId') appId?: string, @Query('releaseId') releaseId?: string) {
    return envelope(this.activityService.list(workspaceId, appId, releaseId))
  }
}
