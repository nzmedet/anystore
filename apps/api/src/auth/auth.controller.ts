import { Body, Controller, Get, Post } from '@nestjs/common'
import { envelope } from '../common/api-envelope'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('session')
  async getSession() {
    return envelope(await this.authService.getSession())
  }

  @Post('sign-in')
  async signIn(@Body() body: { email?: string; displayName?: string }) {
    return envelope(await this.authService.signIn(body))
  }

  @Post('sign-out')
  signOut() {
    return envelope(this.authService.signOut())
  }
}
