# Anystore Bootstrap Pack

## Purpose

This document is the **copy-paste-ready bootstrap pack** for initializing the Anystore monorepo.

It defines:

* exact repo structure
* root package files
* workspace config
* TypeScript config
* Docker/local infra
* environment files
* initial package manifests
* initial Next.js shell
* initial NestJS API shell
* initial worker shell
* initial Prisma schema seed structure
* coding conventions for immediate implementation

This is the starting point for Codex agents.

---

# 1. Repository tree

Use this exact initial structure.

```text
anystore/
  apps/
    web/
      app/
        (auth)/
          sign-in/
            page.tsx
        (dashboard)/
          layout.tsx
          page.tsx
          apps/
            page.tsx
          releases/
            page.tsx
          assets/
            page.tsx
          templates/
            page.tsx
          integrations/
            page.tsx
          activity/
            page.tsx
          settings/
            page.tsx
      components/
        app-shell.tsx
        sidebar.tsx
        topbar.tsx
      lib/
        api-client.ts
        env.ts
      styles/
      next.config.ts
      package.json
      tsconfig.json
      postcss.config.js
      tailwind.config.ts
    api/
      src/
        main.ts
        app.module.ts
        health/
          health.controller.ts
          health.module.ts
        auth/
        workspaces/
        apps/
        releases/
        assets/
        templates/
        validation/
        providers/
        sync/
        common/
          filters/
          guards/
          interceptors/
          pipes/
      test/
      package.json
      tsconfig.json
      nest-cli.json
    worker/
      src/
        main.ts
        queues/
          render-jobs.processor.ts
          sync-jobs.processor.ts
          validation-jobs.processor.ts
          remote-snapshot-jobs.processor.ts
        lib/
          env.ts
          queue.ts
      package.json
      tsconfig.json
  packages/
    domain/
      src/
        index.ts
        enums.ts
        metadata-field-keys.ts
        rendering.ts
        validation.ts
        sync.ts
        queues.ts
        events.ts
        contracts/
        dto/
        schemas/
      package.json
      tsconfig.json
    database/
      prisma/
        schema.prisma
        migrations/
      src/
        client.ts
        seed.ts
        index.ts
      package.json
      tsconfig.json
    config/
      src/
        env.ts
        index.ts
      package.json
      tsconfig.json
    auth/
      src/
        index.ts
        rbac.ts
      package.json
      tsconfig.json
    ui/
      src/
        index.ts
      package.json
      tsconfig.json
    providers/
      src/
        index.ts
        types.ts
        capability-map.ts
        apple/
          adapter.ts
          client.ts
          mapper.ts
        google/
          adapter.ts
          client.ts
          mapper.ts
      package.json
      tsconfig.json
    validation/
      src/
        index.ts
        runner.ts
        rules/
      package.json
      tsconfig.json
    rendering/
      src/
        index.ts
        template-schema.ts
        render-service.ts
        stale-detector.ts
      package.json
      tsconfig.json
    events/
      src/
        index.ts
        audit-writer.ts
      package.json
      tsconfig.json
    testing/
      src/
        index.ts
        factories/
        fixtures/
      package.json
      tsconfig.json
  scripts/
    dev.sh
    reset-local.sh
  .github/
    workflows/
      ci.yml
  .env.example
  .gitignore
  .npmrc
  package.json
  pnpm-workspace.yaml
  turbo.json
  tsconfig.base.json
  docker-compose.yml
  README.md
```

---

# 2. Root package.json

Create `/package.json` with:

```json
{
  "name": "anystore",
  "private": true,
  "packageManager": "pnpm@10.0.0",
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "clean": "turbo run clean && rm -rf node_modules",
    "db:generate": "pnpm --filter @anystore/database prisma generate",
    "db:migrate": "pnpm --filter @anystore/database prisma migrate dev",
    "db:deploy": "pnpm --filter @anystore/database prisma migrate deploy",
    "db:seed": "pnpm --filter @anystore/database seed",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "@types/node": "^24.0.0",
    "eslint": "^9.0.0",
    "prettier": "^3.3.0",
    "turbo": "^2.0.0",
    "typescript": "^5.8.0"
  }
}
```

---

# 3. pnpm-workspace.yaml

Create `/pnpm-workspace.yaml` with:

```yaml
packages:
  - apps/*
  - packages/*
```

---

# 4. turbo.json

Create `/turbo.json` with:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    },
    "test": {
      "dependsOn": ["^test"],
      "outputs": ["coverage/**"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

---

# 5. Root tsconfig.base.json

Create `/tsconfig.base.json` with:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@anystore/domain/*": ["packages/domain/src/*"],
      "@anystore/domain": ["packages/domain/src/index.ts"],
      "@anystore/database/*": ["packages/database/src/*"],
      "@anystore/database": ["packages/database/src/index.ts"],
      "@anystore/config/*": ["packages/config/src/*"],
      "@anystore/config": ["packages/config/src/index.ts"],
      "@anystore/auth/*": ["packages/auth/src/*"],
      "@anystore/auth": ["packages/auth/src/index.ts"],
      "@anystore/ui/*": ["packages/ui/src/*"],
      "@anystore/ui": ["packages/ui/src/index.ts"],
      "@anystore/providers/*": ["packages/providers/src/*"],
      "@anystore/providers": ["packages/providers/src/index.ts"],
      "@anystore/validation/*": ["packages/validation/src/*"],
      "@anystore/validation": ["packages/validation/src/index.ts"],
      "@anystore/rendering/*": ["packages/rendering/src/*"],
      "@anystore/rendering": ["packages/rendering/src/index.ts"],
      "@anystore/events/*": ["packages/events/src/*"],
      "@anystore/events": ["packages/events/src/index.ts"],
      "@anystore/testing/*": ["packages/testing/src/*"],
      "@anystore/testing": ["packages/testing/src/index.ts"]
    }
  },
  "exclude": ["node_modules", "dist", ".next"]
}
```

---

# 6. Root .gitignore

Create `/.gitignore` with:

```gitignore
node_modules
.pnpm-store
.turbo
.next
dist
coverage
.env
.env.local
.env.*.local
*.log
.DS_Store
/apps/web/.next
/apps/api/dist
/apps/worker/dist
/packages/database/prisma/dev.db
/minio-data
```

---

# 7. Root .npmrc

Create `/.npmrc` with:

```ini
auto-install-peers=true
strict-peer-dependencies=false
shamefully-hoist=false
```

---

# 8. Environment file

Create `/.env.example` with:

```bash
NODE_ENV=development
APP_BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/anystore
REDIS_URL=redis://localhost:6379
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_BUCKET=anystore-local
S3_ACCESS_KEY=minio
S3_SECRET_KEY=minio123
S3_FORCE_PATH_STYLE=true
AUTH_SECRET=change-me
FIELD_ENCRYPTION_KEY=change-me-32-bytes-minimum
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

Rule:

* local dev reads `.env`
* production reads environment secrets only

---

# 9. Docker Compose

Create `/docker-compose.yml` with:

```yaml
version: '3.9'
services:
  postgres:
    image: postgres:16
    container_name: anystore-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: anystore
    ports:
      - '5432:5432'
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:7
    container_name: anystore-redis
    restart: unless-stopped
    ports:
      - '6379:6379'

  minio:
    image: minio/minio:latest
    container_name: anystore-minio
    restart: unless-stopped
    command: server /data --console-address ':9001'
    environment:
      MINIO_ROOT_USER: minio
      MINIO_ROOT_PASSWORD: minio123
    ports:
      - '9000:9000'
      - '9001:9001'
    volumes:
      - minio-data:/data

volumes:
  postgres-data:
  minio-data:
```

After startup, manually create bucket `anystore-local` in MinIO console or add a bootstrap script later.

---

# 10. README bootstrap section

Create `/README.md` initial content:

````md
# Anystore

Anystore is a release operations platform for managing app store metadata, assets, releases, screenshots, validation, and sync across Apple App Store Connect and Google Play.

## Local setup

### 1. Install dependencies

```bash
pnpm install
````

### 2. Start local infrastructure

```bash
docker compose up -d
```

### 3. Copy env file

```bash
cp .env.example .env
```

### 4. Generate Prisma client and run migrations

```bash
pnpm db:generate
pnpm db:migrate
```

### 5. Seed database

```bash
pnpm db:seed
```

### 6. Start apps

```bash
pnpm dev
```

## Services

* Web: [http://localhost:3000](http://localhost:3000)
* API: [http://localhost:4000](http://localhost:4000)
* MinIO Console: [http://localhost:9001](http://localhost:9001)

````

---

# 11. Shared package manifests

## 11.1 packages/domain/package.json

```json
{
  "name": "@anystore/domain",
  "version": "0.0.1",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "lint": "eslint src --ext .ts",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "echo \"No tests yet\""
  }
}
````

## 11.2 packages/database/package.json

```json
{
  "name": "@anystore/database",
  "version": "0.0.1",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "lint": "eslint src --ext .ts",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "echo \"No tests yet\"",
    "prisma": "prisma",
    "seed": "tsx src/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "^6.0.0"
  },
  "devDependencies": {
    "prisma": "^6.0.0",
    "tsx": "^4.19.0"
  }
}
```

## 11.3 packages/config/package.json

```json
{
  "name": "@anystore/config",
  "version": "0.0.1",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "lint": "eslint src --ext .ts",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "echo \"No tests yet\""
  },
  "dependencies": {
    "zod": "^3.23.8"
  }
}
```

## 11.4 generic tsconfig for packages

Use this same `tsconfig.json` pattern for packages:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*.ts"]
}
```

---

# 12. apps/web bootstrap

## 12.1 apps/web/package.json

```json
{
  "name": "@anystore/web",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "echo \"No tests yet\""
  },
  "dependencies": {
    "@anystore/domain": "workspace:*",
    "@anystore/ui": "workspace:*",
    "@tanstack/react-query": "^5.59.0",
    "next": "15.0.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.8.0"
  }
}
```

## 12.2 apps/web/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "preserve",
    "plugins": [{ "name": "next" }],
    "allowJs": true,
    "incremental": true,
    "noEmit": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

## 12.3 apps/web/next.config.ts

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
}

export default nextConfig
```

## 12.4 apps/web/postcss.config.js

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 12.5 apps/web/tailwind.config.ts

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
```

## 12.6 apps/web/app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  background: #0b0d10;
  color: #f5f7fa;
}
```

## 12.7 apps/web/app/layout.tsx

```tsx
import './globals.css'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

## 12.8 apps/web/app/(auth)/sign-in/page.tsx

```tsx
export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-2">Anystore</h1>
        <p className="text-sm text-white/70">Sign in screen placeholder.</p>
      </div>
    </main>
  )
}
```

## 12.9 apps/web/components/sidebar.tsx

```tsx
const items = [
  'Dashboard',
  'Apps',
  'Releases',
  'Assets',
  'Templates',
  'Integrations',
  'Activity',
  'Settings',
]

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-white/10 p-4">
      <div className="text-lg font-semibold mb-6">Anystore</div>
      <nav className="space-y-2">
        {items.map((item) => (
          <div key={item} className="rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5">
            {item}
          </div>
        ))}
      </nav>
    </aside>
  )
}
```

## 12.10 apps/web/components/topbar.tsx

```tsx
export function Topbar() {
  return (
    <header className="h-14 border-b border-white/10 px-4 flex items-center justify-between">
      <div className="text-sm text-white/70">Workspace: Demo</div>
      <div className="text-sm text-white/70">User</div>
    </header>
  )
}
```

## 12.11 apps/web/components/app-shell.tsx

```tsx
import type { ReactNode } from 'react'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
```

## 12.12 apps/web/app/(dashboard)/layout.tsx

```tsx
import type { ReactNode } from 'react'
import { AppShell } from '../../components/app-shell'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>
}
```

## 12.13 placeholder pages

Use this same pattern for:

* `app/(dashboard)/page.tsx`
* `app/(dashboard)/apps/page.tsx`
* `app/(dashboard)/releases/page.tsx`
* `app/(dashboard)/assets/page.tsx`
* `app/(dashboard)/templates/page.tsx`
* `app/(dashboard)/integrations/page.tsx`
* `app/(dashboard)/activity/page.tsx`
* `app/(dashboard)/settings/page.tsx`

```tsx
export default function PlaceholderPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Page title</h1>
      <p className="text-white/70">Bootstrap placeholder.</p>
    </div>
  )
}
```

---

# 13. apps/api bootstrap

## 13.1 apps/api/package.json

```json
{
  "name": "@anystore/api",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main",
    "lint": "eslint src test --ext .ts",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "echo \"No tests yet\""
  },
  "dependencies": {
    "@anystore/auth": "workspace:*",
    "@anystore/config": "workspace:*",
    "@anystore/database": "workspace:*",
    "@anystore/domain": "workspace:*",
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "typescript": "^5.8.0"
  }
}
```

## 13.2 apps/api/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "Node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "outDir": "dist"
  },
  "include": ["src/**/*.ts", "test/**/*.ts"]
}
```

## 13.3 apps/api/nest-cli.json

```json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src"
}
```

## 13.4 apps/api/src/main.ts

```ts
import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({ origin: true, credentials: true })
  await app.listen(4000)
}

bootstrap()
```

## 13.5 apps/api/src/app.module.ts

```ts
import { Module } from '@nestjs/common'
import { HealthModule } from './health/health.module'

@Module({
  imports: [HealthModule],
})
export class AppModule {}
```

## 13.6 apps/api/src/health/health.controller.ts

```ts
import { Controller, Get } from '@nestjs/common'

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      service: 'api',
    }
  }
}
```

## 13.7 apps/api/src/health/health.module.ts

```ts
import { Module } from '@nestjs/common'
import { HealthController } from './health.controller'

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
```

---

# 14. apps/worker bootstrap

## 14.1 apps/worker/package.json

```json
{
  "name": "@anystore/worker",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/main.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/main.js",
    "lint": "eslint src --ext .ts",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "echo \"No tests yet\""
  },
  "dependencies": {
    "@anystore/config": "workspace:*",
    "@anystore/database": "workspace:*",
    "@anystore/domain": "workspace:*",
    "bullmq": "^5.16.0",
    "ioredis": "^5.4.1"
  },
  "devDependencies": {
    "tsx": "^4.19.0",
    "typescript": "^5.8.0"
  }
}
```

## 14.2 apps/worker/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "Node",
    "outDir": "dist"
  },
  "include": ["src/**/*.ts"]
}
```

## 14.3 apps/worker/src/lib/env.ts

```ts
export const workerEnv = {
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
}
```

## 14.4 apps/worker/src/lib/queue.ts

```ts
import IORedis from 'ioredis'
import { workerEnv } from './env'

export const redisConnection = new IORedis(workerEnv.redisUrl, {
  maxRetriesPerRequest: null,
})
```

## 14.5 apps/worker/src/queues/render-jobs.processor.ts

```ts
import { Worker } from 'bullmq'
import { redisConnection } from '../lib/queue'

export function createRenderJobsProcessor() {
  return new Worker(
    'render-jobs',
    async (job) => {
      console.log('[render-jobs] processing', job.id, job.data)
    },
    { connection: redisConnection }
  )
}
```

## 14.6 apps/worker/src/queues/sync-jobs.processor.ts

```ts
import { Worker } from 'bullmq'
import { redisConnection } from '../lib/queue'

export function createSyncJobsProcessor() {
  return new Worker(
    'sync-jobs',
    async (job) => {
      console.log('[sync-jobs] processing', job.id, job.data)
    },
    { connection: redisConnection }
  )
}
```

## 14.7 apps/worker/src/queues/validation-jobs.processor.ts

```ts
import { Worker } from 'bullmq'
import { redisConnection } from '../lib/queue'

export function createValidationJobsProcessor() {
  return new Worker(
    'validation-jobs',
    async (job) => {
      console.log('[validation-jobs] processing', job.id, job.data)
    },
    { connection: redisConnection }
  )
}
```

## 14.8 apps/worker/src/queues/remote-snapshot-jobs.processor.ts

```ts
import { Worker } from 'bullmq'
import { redisConnection } from '../lib/queue'

export function createRemoteSnapshotJobsProcessor() {
  return new Worker(
    'remote-snapshot-jobs',
    async (job) => {
      console.log('[remote-snapshot-jobs] processing', job.id, job.data)
    },
    { connection: redisConnection }
  )
}
```

## 14.9 apps/worker/src/main.ts

```ts
import { createRenderJobsProcessor } from './queues/render-jobs.processor'
import { createSyncJobsProcessor } from './queues/sync-jobs.processor'
import { createValidationJobsProcessor } from './queues/validation-jobs.processor'
import { createRemoteSnapshotJobsProcessor } from './queues/remote-snapshot-jobs.processor'

function bootstrap() {
  createRenderJobsProcessor()
  createSyncJobsProcessor()
  createValidationJobsProcessor()
  createRemoteSnapshotJobsProcessor()
  console.log('Anystore worker started')
}

bootstrap()
```

---

# 15. packages/config bootstrap

## 15.1 packages/config/src/env.ts

```ts
import { z } from 'zod'

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_BASE_URL: z.string().url(),
  API_BASE_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  S3_ENDPOINT: z.string().url(),
  S3_REGION: z.string().min(1),
  S3_BUCKET: z.string().min(1),
  S3_ACCESS_KEY: z.string().min(1),
  S3_SECRET_KEY: z.string().min(1),
  S3_FORCE_PATH_STYLE: z.string().default('true'),
  AUTH_SECRET: z.string().min(1),
  FIELD_ENCRYPTION_KEY: z.string().min(16),
})

export const env = EnvSchema.parse(process.env)
```

## 15.2 packages/config/src/index.ts

```ts
export * from './env'
```

---

# 16. packages/domain bootstrap

## 16.1 packages/domain/src/index.ts

```ts
export * from './enums'
export * from './metadata-field-keys'
export * from './rendering'
export * from './validation'
export * from './sync'
export * from './queues'
export * from './events'
```

## 16.2 packages/domain/src/enums.ts

Use the enum contract from the contracts pack. Start with all shared values there.

## 16.3 packages/domain/src/queues.ts

```ts
export const QueueNames = {
  renderJobs: 'render-jobs',
  syncJobs: 'sync-jobs',
  remoteSnapshotJobs: 'remote-snapshot-jobs',
  validationJobs: 'validation-jobs',
} as const
```

---

# 17. packages/database bootstrap

## 17.1 packages/database/src/client.ts

```ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

## 17.2 packages/database/src/index.ts

```ts
export * from './client'
```

## 17.3 packages/database/prisma/schema.prisma

Use the schema blueprint from **Anystore-contracts-pack**. Do not improvise model names.

At minimum bootstrap with:

* generator client
* datasource db
* User
* Workspace
* WorkspaceMember
* App
* AppPlatform
* AppLocale
* MetadataDocument
* MetadataEntry
* Release
* ReleasePlatformState
* Asset
* ScreenshotTemplate
* ScreenshotTemplateVersion
* RenderJob
* BuildArtifact
* ValidationIssue
* ProviderConnection
* RemoteSnapshot
* SyncJob
* ReviewProfile
* RejectionEvent
* AuditEvent
* Comment

## 17.4 packages/database/src/seed.ts

Initial seed behavior:

* create demo user
* create demo workspace
* create demo app with ios/android
* create en-US and en-NZ locales
* create draft metadata doc
* create release 1.0.0 and 1.1.0
* create minimal audit events

Use idempotent upsert style.

---

# 18. scripts

## 18.1 scripts/dev.sh

```bash
#!/usr/bin/env bash
set -e
pnpm dev
```

## 18.2 scripts/reset-local.sh

```bash
#!/usr/bin/env bash
set -e

docker compose down -v
rm -rf node_modules
pnpm install
docker compose up -d
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

---

# 19. GitHub Actions CI

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile=false
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm build
```

This is enough for bootstrap. Add test database later.

---

# 20. Bootstrap command sequence

Once files are created, the correct sequence is:

```bash
pnpm install
docker compose up -d
cp .env.example .env
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

If MinIO bucket doesn’t exist yet:

* create `anystore-local` via console on port `9001`

---

# 21. Immediate next tasks after bootstrap

Once this pack is in place, the next build order is:

1. implement `packages/domain` contracts fully
2. implement Prisma schema from contracts pack
3. add auth/session module to API
4. add workspace/app/release CRUD
5. add web app real navigation and list pages
6. add signed upload flow
7. add validation engine skeleton

That’s the correct order. Not “let’s build Apple sync first because it sounds sexy.” That’s how people end up in a ditch.

---

# 22. Codex bootstrap prompt

Use this with the bootstrap agent.

```text
You are the bootstrap agent for the Anystore monorepo.

Build the repository foundation exactly according to the Anystore Bootstrap Pack and Anystore Contracts Pack.

Requirements:
- Create a pnpm + Turborepo monorepo
- Create apps/web using Next.js App Router
- Create apps/api using NestJS
- Create apps/worker using BullMQ + ioredis
- Create packages/domain, database, config, auth, ui, providers, validation, rendering, events, testing
- Add root package.json, pnpm-workspace.yaml, turbo.json, tsconfig.base.json, docker-compose.yml, .env.example, .gitignore, README.md
- Wire local Postgres, Redis, and MinIO via Docker Compose
- Add a minimal health endpoint for API
- Add a minimal app shell for web
- Add worker queue processor placeholders
- Add Prisma client setup and seed script placeholder in packages/database
- Use TypeScript strict mode
- Keep boundaries clean and ready for multi-agent parallel development

Constraints:
- Do not invent alternate folder structures
- Do not add business logic beyond bootstrap placeholders
- Do not deviate from the package names and service names in the bootstrap pack
- Keep the repository ready for the domain/database/api agents to continue immediately

Deliverables:
- full monorepo scaffold
- all config files
- app shells booting locally
- Docker/local infra working
```

---

# 23. Final instruction

This bootstrap pack is supposed to remove the most boring failure mode in software projects:
people wasting two days arguing over folder names and whether the worker should live in `services/` or `apps/`.

Use this structure. Start building. Don’t over-philosophize the scaffolding.
