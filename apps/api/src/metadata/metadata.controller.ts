import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { envelope } from '../common/api-envelope'
import { MetadataService } from './metadata.service'

@Controller('metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @Get('documents')
  async listDocuments(@Query('appId') appId?: string) {
    return envelope(await this.metadataService.listDocuments(appId))
  }

  @Get('documents/:documentId')
  async getDocument(@Param('documentId') documentId: string) {
    return envelope(await this.metadataService.getDocument(documentId))
  }

  @Post('documents')
  async createDocument(@Body() body: { appId: string; scopeType?: 'app_draft' | 'release_snapshot'; scopeId?: string }) {
    return envelope(await this.metadataService.createDocument(body))
  }

  @Put('documents/:documentId')
  async upsertEntries(@Param('documentId') documentId: string, @Body() body: { entries: Array<{ fieldKey: string; valueJson: unknown; localeCode?: string | null; platform?: 'ios' | 'android' | null; sourceLayer?: string }> }) {
    return envelope(await this.metadataService.upsertEntries(documentId, body))
  }

  @Post('documents/:documentId/resolve')
  async resolve(@Param('documentId') documentId: string) {
    return envelope(await this.metadataService.resolve(documentId))
  }
}
