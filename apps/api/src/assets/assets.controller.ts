import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { envelope } from '../common/api-envelope'
import { AssetsService } from './assets.service'

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  list(@Query('appId') appId?: string, @Query('releaseId') releaseId?: string) {
    return envelope(this.assetsService.list(appId, releaseId))
  }

  @Post()
  create(@Body() body: { appId: string; releaseId?: string | null; assetType: string; platform?: 'ios' | 'android' | null; localeCode?: string | null; deviceClass?: string | null; mimeType: string; fileName: string; checksum?: string; width?: number | null; height?: number | null; fileSizeBytes?: number | null; createdBy?: string | null }) {
    return envelope(this.assetsService.create(body))
  }

  @Get(':assetId')
  get(@Param('assetId') assetId: string) {
    return envelope(this.assetsService.get(assetId))
  }

  @Patch(':assetId')
  update(@Param('assetId') assetId: string, @Body() body: Partial<{ status: string; releaseId: string | null; localeCode: string | null; platform: 'ios' | 'android' | null; deviceClass: string | null }>) {
    return envelope(this.assetsService.update(assetId, body))
  }

  @Post('presign-upload')
  presign(@Body() body: { appId: string; fileName: string; mimeType: string }) {
    return envelope(this.assetsService.presign(body))
  }

  @Post(':assetId/archive')
  archive(@Param('assetId') assetId: string) {
    return envelope(this.assetsService.archive(assetId))
  }
}
