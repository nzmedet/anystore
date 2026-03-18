import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  })

  app.setGlobalPrefix('api')
  app.enableCors({
    origin: true,
    credentials: true
  })

  const port = Number(process.env.PORT ?? 4000)
  await app.listen(port)

  const url = await app.getUrl()
  console.log(`Anystore API listening on ${url}/api`)
}

void bootstrap()
