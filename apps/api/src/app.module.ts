import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { CommonModule } from './common/common.module'
import { HttpExceptionFilter } from './common/http-exception.filter'
import { HealthModule } from './health/health.module'
import { AuthModule } from './auth/auth.module'
import { WorkspacesModule } from './workspaces/workspaces.module'
import { AppsModule } from './apps/apps.module'
import { MetadataModule } from './metadata/metadata.module'
import { ReleasesModule } from './releases/releases.module'
import { AssetsModule } from './assets/assets.module'
import { ValidationModule } from './validation/validation.module'
import { ProvidersModule } from './providers/providers.module'
import { SyncModule } from './sync/sync.module'
import { ActivityModule } from './activity/activity.module'

@Module({
  imports: [
    CommonModule,
    HealthModule,
    AuthModule,
    WorkspacesModule,
    AppsModule,
    MetadataModule,
    ReleasesModule,
    AssetsModule,
    ValidationModule,
    ProvidersModule,
    SyncModule,
    ActivityModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export class AppModule {}
