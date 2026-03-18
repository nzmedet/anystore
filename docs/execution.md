# Anystore Execution Docs

## Purpose

This document is the build manual for Codex-style multi-agent implementation of **Anystore**.

It is not a marketing spec. It is an execution plan.

Use this document to coordinate multiple agents working in parallel without creating architectural drift, duplicated abstractions, or random framework cosplay.

The product target remains:

* one canonical source of truth for store-facing app release data
* a web app control plane
* magical sync to Apple App Store Connect and Google Play
* versioned releases, metadata, assets, screenshots, builds, compliance notes, and auditability

Apple’s App Store Connect API supports automating work in App Store Connect, including app metadata and screenshots, and Apple documents screenshot upload/resources and current screenshot specifications. Google’s Play Developer API supports store listings, localized text/graphics, screenshots, uploads, and track releases. Those realities justify building a provider abstraction from day one instead of hardwiring a single vendor flow. ([developer.apple.com](https://developer.apple.com/documentation/appstoreconnectapi?utm_source=chatgpt.com))

For the product shell, a TypeScript web stack with Next.js App Router is a reasonable default because the App Router is current and designed around modern React features. For the relational layer, PostgreSQL with Prisma ORM remains a practical default. ([nextjs.org](https://nextjs.org/docs/app?utm_source=chatgpt.com))

---

# 1. Non-negotiable engineering rules

These rules override convenience.

## 1.1 Canonical-first rule

Never model Apple or Google as the main domain objects.

The source of truth is **Anystore’s canonical release model**.

Apple and Google are provider projections.

Bad:

* `appleDescription`
* `playDescription`
* no canonical description

Good:

* canonical description
* optional provider override
* resolved effective value per provider/locale/release

## 1.2 Release-snapshot rule

Anything store-facing that is used for a release must be snapshotted.

That includes:

* metadata
* assets
* screenshot template versions
* build references
* review notes
* validation results

A release is not a live pointer mess. It is a frozen shipment package.

## 1.3 No hidden magic rule

All sync actions must be explainable.

The UI and API must expose:

* what changed
* what will be pushed
* what provider operations will run
* what failed
* what remained unchanged

If a sync engine mutates remote state without a visible sync plan, that is a future bug farm.

## 1.4 Provider-isolation rule

Apple and Google logic must be isolated behind provider adapters.

Never spread provider conditionals all over the codebase.

Bad:

* `if (platform === 'ios')` in 40 random files

Good:

* provider capability map
* provider adapter module
* provider-specific validation rules isolated cleanly

## 1.5 Immutable-history rule

Do not mutate historical releases in place once frozen/published.

If the product needs a change after publication, create:

* a new draft release
* or an explicit unfreeze workflow with audit events

## 1.6 Multi-agent rule

Every agent must work against:

* clear ownership boundaries
* shared contracts
* explicit schemas
* documented invariants

If two agents invent slightly different meanings for “release status,” congratulations, you’ve built pain.

---

# 2. Recommended repository strategy

## 2.1 Monorepo structure

Use a monorepo. Do not split this prematurely.

Recommended structure:

```text
anystore/
  apps/
    web/                  # Next.js web app
    api/                  # Backend API service
    worker/               # Background jobs
    cli/                  # Future CLI
  packages/
    domain/               # Core domain types, enums, invariants
    database/             # Prisma schema, migrations, DB helpers
    auth/                 # Auth/RBAC shared logic
    ui/                   # Shared UI components/design tokens
    validation/           # Validation engine rules
    providers/            # Provider abstraction + Apple/Google adapters
    sync-engine/          # Diff/sync planning/execution shared logic
    rendering/            # Screenshot template schema + render pipeline
    events/               # Audit/event contracts
    config/               # Shared config/env parsing
    testing/              # Test fixtures, factories, helpers
  docs/
    architecture/
    api/
    runbooks/
  scripts/
  .github/
  turbo.json or nx.json
  package.json
  pnpm-workspace.yaml
```

## 2.2 Package manager

Use **pnpm**.

Reason:

* good monorepo ergonomics
* disk efficiency
* reliable workspace linking

## 2.3 Task runner

Use **Turborepo** unless you already have a strong Nx preference.

Reason:

* straightforward pipeline orchestration
* works cleanly for web/api/worker/package builds
* low ceremony

---

# 3. Recommended stack

This is the default build stack. Agents should not freestyle alternatives unless the lead agent changes the plan explicitly.

## 3.1 Frontend

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui primitives
* TanStack Query
* React Hook Form
* Zod

## 3.2 Backend API

* Node.js
* NestJS or Fastify-based modular API
* TypeScript
* Zod for contract validation at boundaries

### Recommendation

Use **NestJS** if you want stronger module boundaries and team-scale structure.
Use **Fastify + custom modular architecture** if you want leaner runtime and less framework ceremony.

For multi-agent Codex execution, **NestJS** is safer because it discourages random file spaghetti.

## 3.3 Database

* PostgreSQL
* Prisma ORM

## 3.4 Background jobs

* Redis
* BullMQ

## 3.5 Storage

* S3-compatible object storage

## 3.6 Rendering

* Playwright/Chromium headless rendering for screenshot generation

## 3.7 Auth

* Better Auth / custom session auth / Clerk only if you want managed auth

### Recommendation

Use **Better Auth or custom auth** if you want cleaner RBAC and workspace control without external lock-in.

## 3.8 Observability

* Sentry
* OpenTelemetry later
* structured JSON logs from day one

---

# 4. System decomposition

This section defines the actual runtime services.

## 4.1 Web app (`apps/web`)

Responsibilities:

* authenticated UI
* workspace/app/release dashboards
* metadata editing
* screenshot studio UI
* sync and diff UI
* validation display
* activity feed

Must not own business logic beyond presentation and orchestration.

## 4.2 API service (`apps/api`)

Responsibilities:

* domain CRUD
* release orchestration
* validation execution API
* sync plan generation
* provider connection management
* signed URL issuance
* RBAC enforcement
* audit event writes

This is the main orchestrator.

## 4.3 Worker service (`apps/worker`)

Responsibilities:

* screenshot rendering
* remote snapshot fetching
* sync execution
* validation recomputation jobs
* webhook processing
* cleanup/reconciliation jobs

The worker must be stateless except for queue and DB interactions.

## 4.4 CLI (`apps/cli`)

Not needed on day one, but design shared packages so it can be added without surgery.

Future responsibilities:

* attach builds
* create releases
* trigger sync/validation
* upload source captures

---

# 5. Domain ownership map for multi-agent work

This is the most important section for parallel execution.

Each domain gets an owner agent. Agents may collaborate, but one owner decides the contract.

## Agent A — Platform lead / architecture lead

Owns:

* repository scaffolding
* shared conventions
* CI
* package graph
* env/config conventions
* integration of agent branches
* code quality rules

## Agent B — Domain and database lead

Owns:

* core entities
* enums
* Prisma schema
* migrations
* data invariants
* snapshot model
* audit event model

## Agent C — API and auth lead

Owns:

* NestJS/Fastify modules
* API contracts
* RBAC
* workspace/app/release endpoints
* signed URL endpoints
* error model

## Agent D — Web app lead

Owns:

* app shell
* navigation
* dashboard
* metadata editor UI
* release detail UI
* validation UI
* activity UI

## Agent E — Rendering and asset pipeline lead

Owns:

* object storage strategy
* asset upload lifecycle
* screenshot template schema
* screenshot render engine
* asset lineage/staleness logic

## Agent F — Validation and sync engine lead

Owns:

* validation rules
* diff model
* sync plan model
* sync execution orchestration
* job status model

## Agent G — Provider integrations lead

Owns:

* provider interface
* Apple adapter
* Google adapter
* provider capability map
* provider error normalization

## Agent H — QA/integration lead

Owns:

* test factories
* integration tests
* end-to-end critical flows
* fixture providers
* contract compliance

---

# 6. Branching and merge protocol for multi-agent Codex execution

## 6.1 Branch naming

Use consistent naming:

```text
codex/platform-bootstrap
codex/domain-schema
codex/api-core
codex/web-shell
codex/rendering-engine
codex/validation-sync
codex/provider-adapters
codex/test-harness
```

## 6.2 Integration order

Merge in this order unless blocked:

1. `platform-bootstrap`
2. `domain-schema`
3. `api-core`
4. `web-shell`
5. `rendering-engine`
6. `validation-sync`
7. `provider-adapters`
8. `test-harness`

Reason: the whole thing collapses if the schema and contracts are unstable.

## 6.3 Contract-first workflow

Before an agent writes implementation:

* define interfaces/types
* define API payloads
* define enum sets
* define event names
* define table/entity names

Then other agents build against those contracts.

No agent should invent shape drift late in the game.

---

# 7. Core domain model you should actually implement

This section is deliberately concrete.

## 7.1 Canonical entities

Implement these first:

* User
* Workspace
* WorkspaceMember
* App
* AppPlatform
* AppLocale
* MetadataDocument
* MetadataEntry
* Asset
* ScreenshotTemplate
* ScreenshotTemplateVersion
* RenderJob
* BuildArtifact
* Release
* ReleasePlatformState
* ValidationIssue
* ProviderConnection
* RemoteSnapshot
* SyncJob
* ReviewProfile
* RejectionEvent
* AuditEvent
* Comment

## 7.2 Enum set

Create shared enums in `packages/domain` and consume everywhere.

Required enums:

* `Platform = ios | android`
* `Provider = app_store_connect | google_play`
* `ReleaseStatus = draft | preparing | validation_failed | ready_to_sync | sync_in_progress | synced | submitted | in_review | approved | published | rejected | superseded | archived`
* `FreezeState = mutable | frozen`
* `ValidationSeverity = error | warning | info`
* `ValidationCategory = schema | completeness | consistency | provider | screenshots | compliance | sync`
* `SyncJobStatus = queued | running | succeeded | partially_failed | failed | cancelled`
* `RenderJobStatus = queued | running | succeeded | failed | cancelled`
* `AssetType = icon_source | icon_output | screenshot_source | screenshot_output | screenshot_background | feature_graphic | preview_video | generic`
* `MetadataScopeType = app_draft | release_snapshot`
* `MemberRole = owner | admin | editor | reviewer | viewer`
* `RemoteDiffState = unchanged | local_newer | remote_newer | conflict | missing_local | missing_remote`
* `SubmissionStatus = not_submitted | draft | submitted | in_review | approved | rejected | live`
* `AppStatus = active | archived`
* `AppPlatformStatus = connected | not_connected | misconfigured`
* `AppLocaleStatus = active | inactive`
* `ProviderConnectionStatus = connected | expired | invalid | pending`

Do not let each service redefine these.

## 7.3 Identity strategy

Use UUIDs or CUID2 consistently.

Recommendation:

* external/public IDs: CUID2 or UUIDv7
* DB internal IDs: same scheme across tables for simplicity

Do not mix auto-increment ints with string ids unless there is a very good reason.

---

# 8. Database implementation instructions

## 8.1 Prisma layout

Put schema and migrations in `packages/database`.

Suggested structure:

```text
packages/database/
  prisma/
    schema.prisma
    migrations/
  src/
    client.ts
    transactions/
    seeds/
```

## 8.2 Database principles

* soft-delete only where justified
* historical release/sync/audit records should not disappear
* avoid polymorphic chaos where simple nullable FKs would be clearer
* use JSONB for provider payloads and template definitions, not for core relational state
* add created_at / updated_at to nearly everything
* add optimistic version columns where concurrent edits matter

## 8.3 Tables to implement in phase 1

Must exist in initial migration:

* users
* workspaces
* workspace_members
* apps
* app_platforms
* app_locales
* metadata_documents
* metadata_entries
* releases
* release_platform_states
* assets
* screenshot_templates
* screenshot_template_versions
* render_jobs
* build_artifacts
* validation_issues
* provider_connections
* remote_snapshots
* sync_jobs
* review_profiles
* rejection_events
* audit_events
* comments

## 8.4 Important unique constraints

Examples:

* workspace slug unique
* app slug unique within workspace
* one `AppPlatform` per `(app_id, platform)`
* one `AppLocale` per `(app_id, locale_code)`
* one `MetadataDocument` per `(app_id, scope_type, scope_id)`
* one release version label unique per app unless deliberate reuse policy exists

## 8.5 Snapshot strategy

Do not store release metadata as mutable joins to app draft metadata.

When a release is created or frozen, create **release snapshot documents**.

That means:

* `MetadataDocument(scope_type = release_snapshot)`
* copied `MetadataEntry` rows
* copied asset associations or asset snapshot mapping rows
* template version references frozen at that moment

Without snapshotting, the release model is fake.

---

# 9. API design instructions

## 9.1 API style

Use REST first. Keep it boring.

Do not introduce GraphQL now. You do not need another abstraction layer before the product exists.

## 9.2 Top-level route groups

```text
/api/auth/*
/api/workspaces/*
/api/apps/*
/api/metadata/*
/api/releases/*
/api/assets/*
/api/templates/*
/api/builds/*
/api/validation/*
/api/sync/*
/api/providers/*
/api/review/*
/api/activity/*
```

## 9.3 Standard response envelope

Use consistent response/error shape.

Example success:

```json
{
  "data": { "id": "..." },
  "meta": {}
}
```

Example error:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Release has blocking validation issues.",
    "details": []
  }
}
```

## 9.4 API modules to implement first

1. auth
2. workspaces
3. apps
4. metadata
5. releases
6. assets
7. templates
8. validation
9. activity

Only then:
10. providers
11. sync
12. builds
13. review/compliance

## 9.5 Endpoint checklist

### Workspaces

* create workspace
* list workspaces
* get workspace
* invite member
* update member role
* remove member

### Apps

* create app
* list apps
* get app detail
* update app
* archive app
* add platform config
* add locale
* list locales

### Metadata

* get draft metadata document
* upsert metadata entry
* bulk upsert entries
* resolve effective metadata view
* compare metadata vs release snapshot

### Releases

* create release
* clone release
* get release
* list releases
* update release summary fields
* freeze release
* unfreeze release
* attach build

### Assets

* create upload session / signed URL
* finalize asset upload
* list assets
* attach asset to release
* mark asset as source capture

### Templates

* create template
* create template version
* get template
* list templates
* duplicate template
* render template pack

### Validation

* run release validation
* list validation issues
* acknowledge warning

### Sync

* fetch remote snapshot
* dry-run diff
* create sync plan
* execute sync plan
* get sync job status

### Providers

* create provider connection
* validate connection
* list provider capabilities

---

# 10. Web app build instructions

## 10.1 Web IA to implement first

Phase 1 pages:

* sign in
* workspace switcher
* app list
* app detail
* release detail
* metadata editor
* assets library
* template studio placeholder
* validation tab
* activity tab

## 10.2 Navigation

Left nav:

* Dashboard
* Apps
* Releases
* Assets
* Templates
* Integrations
* Activity
* Settings

App sub-nav:

* Overview
* Metadata
* Assets
* Releases
* Localization
* Review
* Sync

Release sub-nav:

* Summary
* Metadata Snapshot
* Assets Snapshot
* Builds
* Validation
* Sync
* Review Notes
* Activity

## 10.3 Web state rules

The web app should use server components where it helps initial page load, but interactive editors should be client components.

Use TanStack Query for:

* paginated lists
* background refresh
* job polling
* mutation state

Do not bury all state in giant client stores.

## 10.4 Form editing rules

For metadata editor:

* autosave draft fields
* debounce saves
* optimistic UI only if failure handling is robust
* show field-level validation and provider character limits
* show resolved effective value source

## 10.5 Diff UI rules

For sync and metadata comparison:

* left pane local canonical
* right pane remote provider value
* state chip per field: unchanged/local_newer/remote_newer/conflict
* bulk choose “prefer local” / “prefer remote” where safe

---

# 11. Rendering engine instructions

## 11.1 Template model

Do not make a full Figma clone.

Start with structured templates.

Each template version should contain JSON like:

```json
{
  "canvas": { "width": 1290, "height": 2796 },
  "background": { "type": "image", "assetId": "..." },
  "regions": [
    {
      "id": "hero-screenshot",
      "type": "image",
      "source": "screenshot",
      "x": 120,
      "y": 320,
      "width": 1050,
      "height": 1900,
      "fit": "contain"
    },
    {
      "id": "title",
      "type": "text",
      "token": "slide.title",
      "x": 100,
      "y": 120,
      "width": 1090,
      "height": 140,
      "fontSize": 64,
      "fontWeight": 700,
      "align": "center"
    }
  ],
  "safeZones": [],
  "outputTargets": ["ios_6_9", "android_phone"]
}
```

## 11.2 Rendering architecture

* template definition stored in DB
* render request payload stored in DB/job
* worker fetches template + assets + token values
* rendering runs in isolated job context
* final output uploaded to object storage
* output assets persisted with lineage to source/template version

## 11.3 Asset lineage

For each rendered screenshot output, store:

* source screenshot asset id
* template version id
* locale
* token checksum
* render checksum

This is how you detect staleness later.

## 11.4 Rendering deliverables

Agent E must implement:

* template schema validator
* renderer
* output naming strategy
* render job status updates
* asset persistence
* stale recalculation service

---

# 12. Validation engine instructions

Validation must be modular, rule-based, and deterministic.

## 12.1 Rule shape

Each validation rule should implement something like:

```ts
interface ValidationRule {
  code: string
  category: ValidationCategory
  applies(input: ValidationContext): boolean
  evaluate(input: ValidationContext): ValidationIssue[]
}
```

## 12.2 Initial rule families

### Metadata completeness

* required canonical name missing
* missing privacy policy URL
* missing description
* missing release notes

### Provider limits

* Apple keywords length limit exceeded
* Google short description too long
* unsupported missing fields for selected provider

### Release consistency

* iOS version mismatch with attached build
* Android versionCode mismatch
* no build attached for target platform

### Asset completeness

* missing required screenshots for target platform/device class
* screenshots stale after template update
* feature graphic missing for Android if required in chosen workflow

### Review/compliance

* gated app but no demo credentials stored
* app flagged as social/UGC category but no moderation/review notes template filled

## 12.3 Validation output persistence

Store each run result. Do not only compute in memory.

Need:

* current active issues
* past issue history
* issue code + path reference + severity

---

# 13. Sync engine instructions

This is the crown jewel. Do not half-bake it.

## 13.1 Sync engine stages

### Stage 1 — Remote pull

* fetch current remote metadata/assets/build associations
* store raw `RemoteSnapshot`
* normalize into provider-neutral comparison shape

### Stage 2 — Diff

* compare release snapshot vs normalized remote snapshot
* produce field-level and asset-level diffs

### Stage 3 — Sync plan

* convert diffs into a list of planned operations
* operations must be explicit

Example operations:

* `UPSERT_METADATA_FIELD`
* `UPLOAD_SCREENSHOT_SET`
* `REORDER_SCREENSHOTS`
* `ATTACH_BUILD_TO_RELEASE`
* `UPDATE_RELEASE_NOTES`

### Stage 4 — Execution

* provider adapter executes plan
* results normalized
* partial failure supported

### Stage 5 — Reconciliation

* fetch remote state again if needed
* store updated remote snapshot
* mark plan items succeeded/failed/skipped

## 13.2 Sync plan item shape

```ts
interface SyncPlanItem {
  id: string
  provider: Provider
  platform: Platform
  operation: string
  targetPath: string
  localValue?: unknown
  remoteValue?: unknown
  strategy: 'apply_local' | 'adopt_remote' | 'skip' | 'manual'
  blocking: boolean
}
```

## 13.3 Concurrency protection

Do not allow two full sync jobs for the same `(release_id, platform)` concurrently.

Use DB or Redis mutex.

## 13.4 Idempotency

Each sync job should have a dedupe key. If the same plan is retried, it should not create duplicate uploads or destructive churn if avoidable.

## 13.5 Error normalization

Provider adapters must translate raw provider failures into a normalized shape:

```ts
interface ProviderError {
  provider: Provider
  code: string
  message: string
  isRetryable: boolean
  raw?: unknown
}
```

---

# 14. Provider adapter instructions

Apple and Google APIs differ materially. The product must admit that instead of pretending both are the same animal wearing different hats.

Apple’s documentation positions the App Store Connect API as the automation surface for tasks done on the Apple developer side, and Apple publishes dedicated resources for app metadata, screenshots, and screenshot-set workflows. Google’s Android Publisher API explicitly covers listings, localized text and graphics, screenshots, uploads, and releases to tracks. This is exactly why adapters need capability flags and normalized operations instead of a fake one-size-fits-all provider implementation. ([developer.apple.com](https://developer.apple.com/documentation/appstoreconnectapi?utm_source=chatgpt.com))

## 14.1 Provider package structure

```text
packages/providers/
  src/
    index.ts
    types.ts
    capability-map.ts
    apple/
      client.ts
      mapper.ts
      diff-normalizer.ts
      operations/
    google/
      client.ts
      mapper.ts
      diff-normalizer.ts
      operations/
```

## 14.2 Required adapter methods

* validateConnection
* fetchAppSnapshot
* fetchReleaseSnapshot
* mapCanonicalToProviderPayload
* diffAgainstRemote
* createSyncPlanItems
* executePlanItem
* normalizeProviderError
* getCapabilities

## 14.3 Capability map

Implement a capabilities registry:

```ts
interface ProviderCapabilities {
  localizedMetadata: boolean
  screenshotUpload: boolean
  releaseNotes: boolean
  buildAssignment: boolean
  reviewNotesApi: boolean
  draftTransactions: boolean
}
```

Do not assume parity where parity does not exist.

## 14.4 Secrets handling

Provider credentials/tokens must be:

* encrypted at rest
* not logged
* available only inside API/worker secure path

---

# 15. Auth and RBAC instructions

## 15.1 Roles

Implement these roles first:

* owner
* admin
* editor
* reviewer
* viewer

## 15.2 Permission matrix

### Owner

* everything

### Admin

* everything except billing/ownership transfer

### Editor

* create/edit apps, metadata, assets, releases
* run validation
* create sync plans
* execute sync unless you choose to restrict it

### Reviewer

* comment
* review diffs
* access release detail
* maybe approve in future

### Viewer

* read-only

## 15.3 Sensitive field access

Demo/reviewer credentials should not be visible to viewer role by default.

---

# 16. Event and audit instructions

## 16.1 Event naming convention

Use stable dot-separated names.

Examples:

* `workspace.created`
* `app.created`
* `app.locale.added`
* `metadata.entry.updated`
* `release.created`
* `release.cloned`
* `release.frozen`
* `release.unfrozen`
* `asset.uploaded`
* `render.job.queued`
* `render.job.completed`
* `validation.run.completed`
* `sync.plan.created`
* `sync.job.started`
* `sync.job.completed`
* `provider.connection.updated`
* `review.credentials.updated`

## 16.2 Audit payload rules

Store:

* actor
* target entity ids
* relevant diff or summary
* timestamp

Do not store giant noisy blobs for ordinary edits if a compact diff summary is enough.

---

# 17. Testing instructions

This product touches persistence, async jobs, rendering, and third-party APIs. If you skip test strategy, future you gets curb-stomped.

## 17.1 Required test layers

### Unit tests

For:

* metadata resolution
* validation rules
* diff logic
* staleness logic
* provider mappers

### Integration tests

For:

* API endpoints against test DB
* release cloning
* release freezing
* validation persistence
* sync plan generation

### Worker tests

For:

* render job lifecycle
* sync job lifecycle
* retry classification

### End-to-end tests

Critical paths only:

* create app -> create release -> edit metadata -> validate
* upload source assets -> render screenshots -> attach to release
* create dry-run sync plan

## 17.2 Provider testing strategy

Do not hit real Apple/Google APIs in normal CI.

Use:

* fixture snapshots
* adapter mocks
* contract tests for provider mapping

Later add manual verification scripts.

## 17.3 Seed data

Agent H should provide realistic seed/factory data for:

* one solo workspace
* one app with iOS + Android
* two locales
* one previous release
* one draft release
* some stale screenshots
* one remote drift case

This makes the product demoable immediately.

---

# 18. CI/CD instructions

## 18.1 CI stages

* install
* lint
* typecheck
* unit tests
* integration tests
* build packages
* build web/api/worker

## 18.2 Quality gates

Do not merge if:

* TypeScript fails
* Prisma schema drift exists
* unit or integration tests fail
* shared contract packages changed without regen/build where required

## 18.3 Preview environments

Useful but not mandatory in first pass.

If added:

* preview deploy web app
* ephemeral DB if feasible
* seeded demo workspace

---

# 19. Environment and secrets instructions

## 19.1 Environment variable strategy

Use one shared env parser package.

Example groups:

### Core

* `NODE_ENV`
* `APP_BASE_URL`
* `DATABASE_URL`
* `REDIS_URL`
* `S3_ENDPOINT`
* `S3_BUCKET`
* `S3_ACCESS_KEY`
* `S3_SECRET_KEY`

### Auth

* `AUTH_SECRET`
* OAuth keys if used

### Encryption

* `FIELD_ENCRYPTION_KEY`

### Observability

* `SENTRY_DSN`

### Provider integration

* Apple provider secrets
* Google provider secrets

## 19.2 Secret rules

* never commit `.env`
* never print secrets in logs
* mask secrets in job payload dumps
* separate local/dev/staging/prod secrets

---

# 20. Phase-by-phase implementation plan

This is the actual build order.

## Phase 0 — Bootstrap

Deliverables:

* monorepo scaffold
* lint/format/typecheck config
* shared package setup
* Next.js app shell
* API shell
* worker shell
* Prisma wired to Postgres
* Redis wired to BullMQ
* CI baseline

Exit criteria:

* repo boots locally with one command
* migrations run
* web/api/worker start

## Phase 1 — Core domain and CRUD

Deliverables:

* auth
* workspaces
* apps
* locales
* metadata draft model
* releases
* audit events
* app/release list/detail pages

Exit criteria:

* user can create workspace, app, release
* user can edit canonical metadata draft
* user can clone release

## Phase 2 — Assets and rendering foundation

Deliverables:

* asset upload flow with signed URLs
* asset library UI
* screenshot template entity + versioning
* render job queue
* basic structured template renderer
* render outputs stored as assets
* stale detection base

Exit criteria:

* user can upload source screenshot
* user can render screenshot output pack
* output appears in asset library

## Phase 3 — Validation and release readiness

Deliverables:

* validation rule engine
* initial rules
* release validation API
* validation tab/UI
* freeze/unfreeze
* build artifact registration

Exit criteria:

* release can be validated
* blocking issues shown clearly
* release freeze works

## Phase 4 — Provider foundation and dry-run magic

Deliverables:

* provider connection records
* provider capability map
* Apple/Google adapter shells
* remote snapshot fetch pipeline
* normalized remote snapshot model
* diff model
* dry-run sync plan generation UI/API

Exit criteria:

* user can connect providers
* fetch remote snapshots
* see local vs remote diff plan

## Phase 5 — Real sync execution

Deliverables:

* metadata sync
* screenshot sync where supported
* release notes sync
* build association where supported
* sync job execution UI
* partial failure handling

Exit criteria:

* user can execute real sync to at least one provider path
* results persisted and auditable

## Phase 6 — Review/compliance and polish

Deliverables:

* review notes workspace
* encrypted demo credentials
* rejection event model/UI
* activity improvements
* better dashboard alerts

Exit criteria:

* user can maintain release review data in product

## Phase 7 — CLI and automation surface

Deliverables:

* CLI login
* create release via CLI
* attach build via CLI
* trigger validation and sync via CLI

Exit criteria:

* local repo + Anystore control plane workflow becomes real

---

# 21. Agent-by-agent Codex prompts

These are starter instructions. Run them separately per agent. Adjust paths if needed.

## Agent A prompt — Platform bootstrap

```text
You are the platform bootstrap agent for the Anystore monorepo.

Goal:
Set up the repository foundations for a TypeScript monorepo with apps/web, apps/api, apps/worker, and shared packages.

Requirements:
- Use pnpm workspaces
- Use Turborepo
- Configure TypeScript project references or equivalent monorepo-safe setup
- Add ESLint, Prettier, and consistent tsconfig base
- Set up apps/web with Next.js App Router
- Set up apps/api with NestJS or modular Fastify backend
- Set up apps/worker as a TypeScript worker service
- Add packages/domain, packages/database, packages/config, packages/testing
- Add shared environment loading/parsing package
- Add root scripts for dev, build, lint, test, typecheck
- Add Docker Compose for local Postgres + Redis + MinIO or S3-compatible storage
- Add README with local setup steps

Constraints:
- Keep the scaffold production-oriented, not tutorial-style
- Do not implement business features beyond smoke-test endpoints/pages
- Prefer clean boundaries over speed hacks

Deliverables:
- working monorepo scaffold
- local development environment
- CI-ready scripts
```

## Agent B prompt — Domain and Prisma schema

```text
You are the domain and database agent for Anystore.

Goal:
Implement the core domain enums, types, and initial Prisma schema based on the execution docs.

Requirements:
- Create shared enums in packages/domain
- Create Prisma schema in packages/database
- Model: users, workspaces, workspace_members, apps, app_platforms, app_locales, metadata_documents, metadata_entries, releases, release_platform_states, assets, screenshot_templates, screenshot_template_versions, render_jobs, build_artifacts, validation_issues, provider_connections, remote_snapshots, sync_jobs, review_profiles, rejection_events, audit_events, comments
- Add created_at and updated_at conventions
- Use JSONB only where appropriate (template defs, provider payloads, raw snapshots)
- Add unique constraints and indexes that match the execution docs
- Provide migration files
- Add typed repository helpers or Prisma access wrappers where useful
- Add seed data for one demo workspace/app/release

Constraints:
- Do not over-normalize trivial lookup data
- Do not put core relational state into opaque JSON blobs
- Optimize for maintainability and snapshot correctness

Deliverables:
- Prisma schema
- migrations
- seed script
- shared domain enum/types package
```

## Agent C prompt — API and auth core

```text
You are the API and auth agent for Anystore.

Goal:
Implement the foundational backend modules and REST API for auth, workspaces, apps, metadata, and releases.

Requirements:
- Build modular API structure
- Implement auth/session flow suitable for a web app
- Implement RBAC with owner/admin/editor/reviewer/viewer
- Implement endpoints for workspace CRUD subset, member management subset, app CRUD, locale management, release creation/cloning/detail, metadata document retrieval and updates
- Use Zod or equivalent for request/response validation
- Return consistent error envelopes
- Persist audit events for major mutations
- Expose signed upload URL issuance endpoints for future assets module

Constraints:
- Keep controllers thin
- Put business rules in services/use-cases
- Do not hardcode provider-specific logic here yet

Deliverables:
- API modules
- auth flow
- RBAC middleware/guards
- endpoint tests
```

## Agent D prompt — Web app shell and core UI

```text
You are the web app agent for Anystore.

Goal:
Implement the main web UI shell and the first set of product pages.

Requirements:
- Build authenticated app shell in Next.js App Router
- Add left navigation and workspace/app switching patterns
- Implement pages for apps list, app detail, releases list/detail, metadata editor, validation tab, activity tab
- Use a clean operator-oriented UI, not marketing fluff
- Integrate with API using TanStack Query
- Build reusable status badges, diff chips, empty states, loading states, and audit feed cards
- Metadata editor must support autosave and field-level validation display

Constraints:
- Keep styling restrained and product-like
- Avoid giant global state stores
- Organize components by feature/domain

Deliverables:
- working app shell
- core pages
- reusable UI primitives needed for Anystore workflows
```

## Agent E prompt — Asset and rendering pipeline

```text
You are the asset and rendering agent for Anystore.

Goal:
Implement asset upload lifecycle, screenshot template versioning, and the first working screenshot render pipeline.

Requirements:
- Implement signed upload flow using S3-compatible storage
- Persist uploaded assets and metadata
- Model screenshot templates and template versions
- Define a structured JSON schema for templates
- Implement worker-driven render jobs using Playwright/headless Chromium or a similarly deterministic approach
- Render source screenshot + text tokens into output assets
- Persist output assets with lineage to source asset and template version
- Implement stale detection based on template version, token checksum, and source checksum

Constraints:
- Do not build a freeform design editor
- Keep template system structured and deterministic
- Rendering should be reproducible and testable

Deliverables:
- asset upload flow
- template schema
- render worker
- rendered screenshot outputs visible in product
```

## Agent F prompt — Validation and sync planning

```text
You are the validation and sync engine agent for Anystore.

Goal:
Implement the rule-based validation engine, normalized diff model, and sync planning layer.

Requirements:
- Create validation rule interface and execution pipeline
- Implement initial rule families: metadata completeness, provider field limits, release consistency, asset completeness, review/compliance basics
- Persist validation issues per release
- Implement normalized remote diff types and sync plan item types
- Implement dry-run sync plan generation from local release snapshot and normalized remote snapshot
- Expose services that API can call later

Constraints:
- Do not execute provider-specific network calls here
- Keep the sync plan provider-neutral where possible
- Make rules composable and easy to test

Deliverables:
- validation package/module
- sync plan types and services
- unit tests for rules and diff logic
```

## Agent G prompt — Provider adapters

```text
You are the provider integrations agent for Anystore.

Goal:
Implement the provider abstraction and the first Apple and Google adapters sufficient for remote snapshot fetch and capability reporting.

Requirements:
- Define provider interface and capability map
- Implement Apple adapter shell and Google adapter shell
- Add connection validation methods
- Add remote snapshot fetch methods for app/release listing state where possible
- Normalize provider payloads into provider-neutral snapshot shapes
- Normalize provider errors into a consistent internal error model
- Keep secrets handling secure and avoid logging raw provider payloads unless sanitized

Constraints:
- Follow the execution docs provider package layout
- Do not leak provider-specific branching all over the app
- Prefer explicit mappers and normalizers over ad hoc transformations

Deliverables:
- provider package
- Apple adapter base
- Google adapter base
- tests using fixture payloads
```

## Agent H prompt — Testing and integration harness

```text
You are the QA and integration agent for Anystore.

Goal:
Build the test harness, fixture data, and critical-path integration/e2e coverage for the initial Anystore platform.

Requirements:
- Add test factories for users, workspaces, apps, releases, metadata, assets, and validation states
- Add integration tests for app creation, release cloning, metadata editing, validation runs, and audit event creation
- Add worker tests for render jobs and sync-plan jobs where possible
- Add e2e tests for key UI flows using Playwright
- Provide deterministic fixture payloads for Apple/Google remote snapshots for adapter tests

Constraints:
- Avoid brittle tests tied to visual trivia
- Focus on business-critical workflows
- Make test data reusable across packages

Deliverables:
- test utilities
- integration tests
- e2e smoke flows
- fixture provider payloads
```

---

# 22. Suggested implementation tickets

Use these as ticket seeds in your tracker.

## Epic 1 — Platform foundation

* bootstrap monorepo
* add local infra compose
* add CI pipeline
* add shared config package

## Epic 2 — Core domain

* define shared enums
* create Prisma schema
* add seed data
* implement audit event writer

## Epic 3 — Auth and workspaces

* session auth
* RBAC middleware
* workspace CRUD
* member invitations basic flow

## Epic 4 — Apps and releases

* app CRUD
* locale CRUD
* release create/clone/detail
* release freeze/unfreeze

## Epic 5 — Metadata

* metadata document CRUD
* effective metadata resolver
* metadata editor UI
* field-level validation hints

## Epic 6 — Assets and rendering

* signed uploads
* asset persistence
* template CRUD
* render jobs
* render output library

## Epic 7 — Validation

* rule engine
* initial rules
* validation UI
* warning acknowledgement

## Epic 8 — Providers and remote state

* provider connection CRUD
* provider capability endpoints
* remote snapshot fetch
* remote snapshot persistence

## Epic 9 — Sync planning

* diff engine
* dry-run sync plan
* sync plan UI

## Epic 10 — Sync execution

* provider operation execution
* job progress UI
* partial failure handling

## Epic 11 — Review/compliance

* review notes
* encrypted demo credentials
* rejection history

## Epic 12 — Testing and polish

* e2e flows
* integration stability
* dashboard attention states

---

# 23. What not to build yet

Do not let agents disappear into side quests.

Not now:

* ASO keyword scoring engine
* AI description generator as a core feature
* full Figma-like editor
* full billing/subscription system beyond minimum SaaS needs
* team approval workflow maze
* mobile app
* browser extension
* Electron desktop app
* data warehouse/BI layer

Those are attractive distractions. They are not the product kernel.

---

# 24. First demo definition

Your first real demo should prove this exact flow:

1. create workspace
2. create app with iOS + Android
3. add metadata
4. create release 1.0.0
5. upload raw screenshots
6. render screenshot pack from template
7. run validation
8. fetch mocked or real remote snapshot
9. show dry-run diff
10. create sync plan

If the product can do that cleanly, it has bones.

If it can only show pretty cards and empty dashboards, it is cosplay software.

---

# 25. Decision log defaults

Unless intentionally changed, these are default decisions:

* monorepo: yes
* package manager: pnpm
* task runner: Turborepo
* frontend: Next.js App Router
* backend: NestJS
* database: Postgres + Prisma
* queue: BullMQ + Redis
* storage: S3-compatible
* render engine: Playwright/Chromium
* API style: REST
* canonical model: release snapshot based
* provider logic: isolated adapters

---

# 26. Final instruction to Codex lead

Do not ask every agent to “build Anystore.”
That’s how you get seven contradictory mini-frameworks welded together.

Instead:

* assign domains
* lock contracts early
* merge in sequence
* keep one architecture lead
* make snapshot integrity sacred
* keep provider logic isolated
* make diff/sync explainable

That is how this becomes a product instead of a haunted repo.
