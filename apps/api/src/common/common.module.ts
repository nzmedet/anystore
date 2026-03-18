import { Global, Module } from '@nestjs/common'
import { ApiStoreService } from './api-store.service'

@Global()
@Module({
  providers: [ApiStoreService],
  exports: [ApiStoreService]
})
export class CommonModule {}
