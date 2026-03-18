import { Injectable, NotFoundException } from '@nestjs/common'
import { ApiStoreService } from '../common/api-store.service'

@Injectable()
export class SyncService {
  constructor(private readonly store: ApiStoreService) {}

  diff(releaseId: string, provider: 'app_store_connect' | 'google_play') {
    return {
      releaseId,
      provider,
      generatedAt: new Date().toISOString(),
      items: this.store.listReleasePlatformStates(releaseId).map((state) => ({
        type: 'release_state',
        state: 'unchanged',
        platform: state.platform,
        localeCode: null,
        localValue: {
          versionLabel: state.desiredVersionName,
          buildNumber: state.desiredBuildNumber,
          targetTrack: state.targetTrack
        },
        remoteValue: {
          versionLabel: state.desiredVersionName,
          buildNumber: state.desiredBuildNumber,
          targetTrack: state.targetTrack
        }
      }))
    }
  }

  plan(releaseId: string, provider: 'app_store_connect' | 'google_play') {
    return this.store.createSyncPlan(releaseId, provider)
  }

  createJob(releaseId: string) {
    return this.store.createSyncJob(releaseId)
  }

  getJob(jobId: string) {
    const jobs = this.store.listSyncJobs()
    const job = jobs.find((item) => item.id === jobId)
    if (!job) {
      throw new NotFoundException('Sync job not found')
    }
    return job
  }

  listJobs(releaseId?: string) {
    return this.store.listSyncJobs(releaseId)
  }
}
