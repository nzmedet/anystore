import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { envelope } from '../common/api-envelope'
import { ValidationService } from './validation.service'

@Controller('validation')
export class ValidationController {
  constructor(private readonly validationService: ValidationService) {}

  @Get('issues')
  listIssues(@Query('releaseId') releaseId?: string) {
    return envelope(this.validationService.listIssues(releaseId))
  }

  @Get('runs/:runId')
  getRun(@Param('runId') runId: string) {
    return envelope(this.validationService.getRun(runId))
  }

  @Post('runs')
  run(@Body() body: { releaseId: string }) {
    return envelope(this.validationService.run(body.releaseId))
  }
}
