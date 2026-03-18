import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { ApiErrorEnvelope } from './api-envelope'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<any>()

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const payload = exception.getResponse()
      const message =
        typeof payload === 'string'
          ? payload
          : typeof payload === 'object' && payload && 'message' in payload
            ? Array.isArray((payload as { message?: unknown }).message)
              ? ((payload as { message?: string[] }).message ?? []).join(', ')
              : String((payload as { message?: unknown }).message ?? exception.message)
            : exception.message

      const details =
        typeof payload === 'object' && payload && 'details' in payload
          ? [Reflect.get(payload, 'details')]
          : []

      const code = String((HttpStatus as Record<number, string>)[status] ?? 'HTTP_ERROR')

      const body: ApiErrorEnvelope = {
        error: {
          code,
          message,
          details
        }
      }

      response.status(status).json(body)
      return
    }

    const body: ApiErrorEnvelope = {
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: exception instanceof Error ? exception.message : 'Internal server error',
        details: []
      }
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(body)
  }
}
