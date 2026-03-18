# Anystore One-Week Delivery Plan

## Summary

Target a **deployable beta in 7 days**, not the full long-term spec. The week-1 product should be a **real working release-ops control plane** with:

- workspace/app/release management
- canonical metadata drafts and immutable release snapshots
- asset upload and basic lineage tracking
- validation and release readiness checks
- remote provider snapshot ingest + diff + dry-run sync plans
- basic review/compliance fields
- auth, RBAC, audit events, workers, and deployable infra

Explicitly **defer or narrow**:
- full screenshot studio polish
- broad provider write automation for both stores
- advanced conflict resolution UX
- full localization automation depth
- production-grade retry/rate-limit hardening beyond the beta path

This week is feasible **only** with a focused v1, parallel execution, and a rule that risky integrations do not block the control-plane product.

## Implementation Order

Build in this order because each later system depends on the earlier contracts:

1. Platform/bootstrap and shared contracts
2. Database schema and domain invariants
3. Auth/RBAC and core API modules
4. Web shell and core CRUD flows
5. Release snapshotting and validation engine
6. Asset upload flow and worker foundations
7. Provider adapters, remote snapshot ingest, diff, dry-run sync
8. Deployable beta hardening, tests, and smoke verification

## Jira-Style Delivery Plan

### Day 1: Foundation and Contracts

**Epic: Platform Bootstrap**
+ Create monorepo foundation for web, API, worker, and shared packages
+ Wire pnpm, turbo, TypeScript, env parsing, Docker local services
+ Establish shared enums, DTOs, Zod schemas, queue payloads, and event names
- Lock branch/task ownership for parallel agents

**Epic: Domain and Schema**
+ Implement Prisma schema for workspaces, apps, locales, metadata documents/entries, releases, platform states, assets, provider connections, remote snapshots, validation issues, sync jobs, audit events, and review profiles
+ Encode release snapshot invariants and uniqueness constraints
+ Seed one demo workspace/app/release path

**Acceptance Criteria**
+ Project boots locally
+ Database migrates cleanly
+ Shared contracts compile without drift
+ Demo seed creates a usable workspace/app/release baseline

### Day 2: Auth, RBAC, and Core CRUD API

**Epic: Auth and Access**
+ Implement session auth
- Implement workspace-scoped RBAC for owner/admin/editor/reviewer/viewer
- Enforce sensitive-field masking for reviewer/demo credentials

**Epic: Core API**
+ Implement REST modules for workspaces, apps, locales, metadata, releases
+ Add audit event writes for create/update/archive operations
+ Add consistent response and error envelopes

**Acceptance Criteria**
+ User can sign in
+ User can create workspace, app, locales, and release
+ Metadata draft can be read and updated
+ Audit log records the main mutations
- Unauthorized actions are blocked correctly

### Day 3: Web Shell and Core Product Flows

**Epic: Web App Core**
+ Build authenticated dashboard shell, app list, app detail, release list/detail, metadata editor, activity view
+ Show effective metadata with source-awareness
- Add form validation and loading/error states

**Epic: Release Operations Core**
+ Implement release cloning
+ Implement release snapshot creation/freeze workflow
- Expose release platform state editing for version/build/track targets

**Acceptance Criteria**
- A user can complete the core flow in UI: create app -> edit draft metadata -> create release -> clone release -> freeze snapshot
+ UI uses real API data, not mocks
+ Release details show readiness state placeholders and activity timeline

### Day 4: Validation Engine and Asset Pipeline

**Epic: Validation**
- Implement validation runner with initial rule families:
  + metadata completeness
  - provider-required field presence
  - release consistency
  - asset completeness
  + review/compliance basics
+ Persist issues and surface blocking vs warning states in API/UI

**Epic: Assets**
- Implement signed upload flow to object storage
- Persist asset records, checksums, dimensions, and lineage fields
- Attach assets to app/release contexts
+ Add worker queue skeleton for asset-related jobs

**Acceptance Criteria**
- User can upload/store source assets
- Validation can run for a release and persist results
- Release readiness view shows actionable issues
- Asset records survive refresh and are associated correctly

### Day 5: Provider Foundation, Remote Snapshots, and Diff

**Epic: Provider Abstraction**
+ Implement provider capability contracts and adapter interface
+ Add Apple and Google adapters with normalized read/snapshot methods first
- Implement provider credential storage and secure access path

**Epic: Remote Reconciliation**
- Fetch remote listing/release data into normalized remote snapshots
- Build diff engine for metadata, assets, and release state
+ Generate dry-run sync plans with explicit operations and blocking items

**Acceptance Criteria**
- For at least one narrow app path, the system can connect provider credentials, fetch remote state, store snapshots, and show a useful diff
+ Dry-run sync plan is inspectable in UI/API
- No real provider writes are required for beta success

### Day 6: Beta Hardening and Narrow Real Sync Path

**Epic: Beta Hardening**
- Add job status tracking, idempotency keys, and baseline retry handling for worker jobs
- Add health endpoints, structured logs, and basic error reporting
- Improve audit coverage around validation/sync planning/provider actions

**Epic: Narrow Real Sync Path**
- If the first 5 days are stable, implement one **narrow real write path** behind a guarded beta flag:
  - metadata-only sync for one provider, or
  - release notes / selected fields only
- Keep unsupported operations in dry-run/manual mode

**Acceptance Criteria**
- End-to-end beta flow is stable in staging
- Worker jobs are inspectable and recoverable
- Optional real sync path works for the supported narrow case without breaking the dry-run flow

### Day 7: Deployment, QA, and Cut-to-Ship

**Epic: Deployable Beta**
- Configure hosted web/API/worker deployment
- Wire database, Redis, and object storage in hosted env
- Validate auth, uploads, background jobs, and seed/demo path

**Epic: QA and Launch Cut**
- Run integration and smoke tests across core flows
- Fix blockers only; defer noncritical polish
- Write operator notes and beta limitations
- Freeze a beta feature set and disable unfinished paths

**Acceptance Criteria**
- Hosted beta is usable by a real user
- Core flow works:
  - sign in
  - create/manage app
  - edit metadata
  - create/freeze release
  - upload assets
  - run validation
  - connect provider
  - fetch remote snapshot
  - view diff
  - generate dry-run sync plan
- Known unsupported areas are explicitly gated or labeled

## Segments to Implement First

Prioritize these first because they create the product’s irreversible foundation:

- **Canonical release and metadata model**
  Without this, provider sync and validation are fake.
- **Release snapshotting**
  This is the core product differentiator and must be correct early.
- **Validation and readiness**
  This gives user value even before real provider writes exist.
- **Remote snapshot + diff**
  This is the safest useful version of “magic” in week 1.
- **Asset pipeline basics**
  Enough to support release completeness, not a full studio yet.

Defer until the foundation is proven:
- sophisticated screenshot generation UX
- broad multi-locale render automation
- dual-provider full write support
- advanced team collaboration/presence
- deep analytics

## Public Interfaces and Contract Expectations

Week-1 implementation should expose:

+ REST routes for auth, workspaces, apps, metadata, releases, assets, validation, providers, sync, and activity
+ Shared domain contracts for:
  - release status and freeze state
  - metadata field keys and effective resolution
  - validation issue shape
  - provider capability map
  - normalized remote snapshot
  - sync diff items and sync plan items
+ Queue contracts for:
  - validation jobs
  - remote snapshot fetch jobs
  - sync planning/execution jobs
  - future rendering jobs

The one-week beta should support one stable user-facing flow:
- canonical edit -> snapshot -> validate -> fetch remote -> diff -> plan sync

## Test Plan

Required tests for the week:

- unit tests for:
  - metadata resolution precedence
  - release cloning/snapshot rules
  - validation rules
  - diff generation
- integration tests for:
  - auth + RBAC
  - app and release CRUD
  - metadata updates
  - release freeze
  - asset record creation
  - provider snapshot ingest
  - sync plan generation
- smoke tests for hosted beta:
  - sign in
  - create app
  - create release
  - run validation
  - fetch provider snapshot
  - view diff/plan

## Assumptions and Defaults

- “Final product in a week” means **deployable beta**, not full spec completeness.
- Provider strategy is **dry-run first**, with optional narrow real-write support only if the platform is stable by Day 6.
- UI quality should be solid and usable, but feature correctness outranks polish.
- Screenshot generation exists as a foundation and worker contract in week 1; full studio-level sophistication is deferred.
- Unfinished or risky features must be **feature-gated**, not half-exposed.
