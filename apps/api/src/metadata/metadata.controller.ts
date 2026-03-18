import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { envelope } from '../common/api-envelope'
import { MetadataService } from './metadata.service'

@Controller('metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @Get('documents')
  listDocuments(@Query('appId') appId?: string) {
    return envelope(this.metadataService.listDocuments(appId))
  }

  @Get('documents/:documentId')
  getDocument(@Param('documentId') documentId: string) {
    return envelope(this.metadataService.getDocument(documentId))
  }

  @Post('documents')
  createDocument(@Body() body: { appId: string; scopeType?: 'app_draft' | 'release_snapshot'; scopeId?: string }) {
    return envelope(this.metadataService.createDocument(body))
  }

  @Put('documents/:documentId')
  upsertEntries(@Param('documentId') documentId: string, @Body() body: { entries: Array<{ fieldKey: string; valueJson: unknown; localeCode?: string | null; platform?: 'ios' | 'android' | null; sourceLayer?: string }> }) {
    return envelope(this.metadataService.upsertEntries(documentId, body))
  }

  @Post('documents/:documentId/resolve')
  resolve(@Param('documentId') documentId: string) {
    return envelope(this.metadataService.resolve(documentId))
  }
}
