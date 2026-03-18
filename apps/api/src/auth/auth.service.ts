import { Injectable } from '@nestjs/common'
import { ApiStoreService } from '../common/api-store.service'

@Injectable()
export class AuthService {
  constructor(private readonly store: ApiStoreService) {}

  getSession() {
    return this.store.getSession()
  }

  signIn(body: { email?: string; displayName?: string }) {
    return this.store.signIn(body.email ?? 'demo@anystore.dev', body.displayName)
  }

  signOut() {
    return this.store.signOut()
  }
}
