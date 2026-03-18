import { Global, Module } from '@nestjs/common'
import { ApiStoreService } from './api-store.service'
import { PrismaService } from './prisma.service'

@Global()
@Module({
  providers: [ApiStoreService, PrismaService],
  exports: [ApiStoreService, PrismaService]
})
export class CommonModule {}
