# Anystore

## Product Specification

### Cross-store release operations platform for indie mobile developers and small teams

---

## 1. Executive summary

Anystore is a web-based release operations platform for shipping mobile apps to Apple App Store Connect and Google Play Console from a single source of truth.

It is built for the developer who can build apps but is losing time and focus to store bureaucracy: metadata drift, screenshot generation, release notes duplication, version mismatch, localization pain, submission paperwork, and platform-specific edge cases.

The core promise of Anystore is simple:

**Define once. Sync everywhere. Track everything.**

Anystore is not just a prettier upload form. It is a canonical release system that manages:

* Apps and workspaces
* Platform identities and store connections
* Versioned metadata
* Versioned assets
* Screenshot template generation
* Build artifacts and version mapping
* Release packaging and submission readiness
* Apple/Google synchronization
* Review notes and compliance paperwork
* Localization
* Audit history and drift detection

The first-class abstraction in Anystore is the **Release**: a versioned, reviewable, syncable package that contains all store-facing data required to ship an app update.

---

## 2. Problem statement

Solo developers and small app teams face the same operational pain repeatedly:

1. The app source code is manageable.
2. The app store submission process is fragmented.
3. Store metadata lives in multiple systems with no reliable canonical source.
4. Screenshots are manual, repetitive, and platform-specific.
5. iOS and Android drift apart over time.
6. Release notes, descriptions, keywords, and compliance text are duplicated and inconsistently updated.
7. Build numbers and release versions must be manually tracked across stores.
8. Review notes and rejection responses are ad hoc and not reusable.
9. Version history is poorly structured.
10. Every release reintroduces administrative friction.

Today’s workflow is typically spread across:

* Xcode / Transporter / Fastlane / EAS / Gradle
* App Store Connect
* Play Console
* Figma / screenshot tools
* AI tools for store copy
* Notes / docs / spreadsheets for tracking

This creates an unnecessary operations burden. The user becomes the sync engine.

---

## 3. Vision

Anystore should feel like **Git + CMS + CI control plane for app store releases**.

The product vision is:

* One canonical model for app-store-facing content
* A release-centric workflow that snapshots metadata, assets, and builds
* High-confidence synchronization to Apple and Google
* First-class screenshot and localization pipeline
* Diffing, auditing, and rollback-friendly history
* A clean UX designed for solo devs first, but scalable to teams/agencies

Long term, Anystore becomes the default operational layer between a mobile codebase and public app stores.

---

## 4. Product principles

### 4.1 Canonical first

Anystore owns the canonical representation of release data. Apple and Google are downstream targets, not primary storage.

### 4.2 Release-centric

Everything important should be attached to a release. Metadata and assets should be versioned and snapshot-aware.

### 4.3 Manual override always available

Automation must be powerful, but users must be able to override any field, asset mapping, or sync decision.

### 4.4 Diff everything

Users must be able to see what changed between:

* local canonical vs remote Apple
* local canonical vs remote Google
* release N vs release N-1
* locale A vs locale B

### 4.5 Progressive automation

The product can start as a control plane and become more magical over time, but the architecture must support full automation from day one.

### 4.6 Solo-dev optimized

The UX must not assume a release manager, designer, and marketer exist. One person should be able to ship multiple apps cleanly.

### 4.7 Store-aware, not store-constrained

The internal model should be expressive enough to cover multiple stores without becoming hostage to one store’s field structure.

---

## 5. Target users

### 5.1 Primary user

Indie mobile developer / solo founder

* 1 to 10 mobile apps
* ships to iOS and Android
* handles screenshots, descriptions, assets, and releases alone
* wants operational leverage

### 5.2 Secondary user

Small startup mobile team

* 2 to 10 people
* one or more shipping apps
* shared responsibility across engineering, product, design

### 5.3 Third user

Agency / app publisher

* many apps and clients
* repetitive release work
* wants reusable templates, access control, and audit logs

---

## 6. Core user jobs

Users need to be able to:

1. Manage multiple apps in one place
2. Connect Apple and Google store accounts securely
3. Define metadata once and map it to both stores
4. Maintain store-specific overrides where necessary
5. Generate and manage screenshots across device classes
6. Create and version releases
7. Attach correct builds to correct releases
8. Keep iOS and Android releases aligned
9. Detect drift across stores and releases
10. Sync metadata/assets/releases to stores with confidence
11. Track review notes, test credentials, and compliance text
12. Compare releases and reuse old content
13. Localize listings cleanly
14. See what is incomplete before submission
15. Recover from rejection without chaos

---

## 7. Product scope

### 7.1 In scope

* Web app
* Canonical app metadata management
* Asset management and screenshot generation
* Release/version management
* Build artifact management
* App Store Connect integration
* Google Play integration
* Sync/diff engine
* Submission validation/checklists
* Localization
* Review/compliance workspace
* Team roles/basic collaboration
* Audit/event history
* CLI/API foundations

### 7.2 Out of scope for initial versions

* Full ASO analytics suite competing with AppTweak/Sensor Tower
* Full build farm or cloud mobile CI
* Full design tool replacement
* Full legal document generation platform
* Push notification / CRM / marketing automation
* Financial dashboards or revenue analytics

---

## 8. Product architecture overview

Anystore consists of the following major systems:

1. Web frontend
2. Public API / backend services
3. Domain database
4. Blob/object storage
5. Background workers/job queue
6. Integration adapters for Apple and Google
7. Rendering pipeline for screenshots/assets
8. Audit/event pipeline
9. Auth and permissions system
10. Optional CLI/API clients

### 8.1 High-level architecture diagram (conceptual)

```text
[ Browser UI ]
      |
      v
[ API Gateway / BFF ]
      |
      +-----------------------+
      |                       |
      v                       v
[ Domain Services ]      [ Auth / RBAC ]
      |
      +-----------+-----------+-----------+
      |           |           |           |
      v           v           v           v
[ Postgres ] [ Object Store ] [ Queue ] [ Cache ]
                              |
                              v
                        [ Worker Fleet ]
                              |
          +-------------------+-------------------+
          |                                       |
          v                                       v
[ Apple App Store Adapter ]             [ Google Play Adapter ]
```

---

## 9. Product modules

### 9.1 Workspace management

A workspace is the top-level tenant container.

#### Responsibilities

* Organization/account boundary
* Billing ownership
* Team membership and roles
* Shared settings
* App grouping
* Usage/quota tracking

#### MVP capabilities

* Create workspace
* Rename workspace
* Invite team members
* Assign roles
* View apps within workspace

#### Future capabilities

* Multiple workspaces per user
* Agency client sub-workspaces
* SSO/SAML
* SCIM provisioning

---

### 9.2 App registry

An app is the logical product being published. It may have one or more platform records.

#### Responsibilities

* App identity within Anystore
* Human-readable name and internal slug
* Platform bindings
* Store status overview
* Locale defaults
* Brand settings

#### Fields

* app_id
* workspace_id
* slug
* internal_name
* canonical_product_name
* primary_locale
* supported_locales
* icon_asset_id
* brand_theme_id
* created_at
* updated_at
* archived_at

#### Platform bindings

For each app, support:

* iOS binding
* Android binding

Each binding contains:

* platform
* bundle/package identifier
* store provider account reference
* app store remote id(s)
* store connection health
* default release track

---

### 9.3 Metadata system

This is a central system of record for all store listing text and structured store content.

#### Goals

* Define once, map many
* Support canonical fields + platform overrides + locale overrides
* Enforce validation and versioning
* Make diffs first-class

#### Metadata layers

1. Canonical metadata
2. Platform-specific metadata override
3. Locale-specific override
4. Platform + locale-specific override
5. Release snapshot metadata

#### Example hierarchy

* canonical.description
* ios.description_override
* android.short_description_override
* en-US.description
* ja-JP.ios.promotional_text

#### Canonical fields

* product_name
* subtitle
* short_description
* full_description
* promotional_text
* keywords
* support_url
* marketing_url
* privacy_policy_url
* primary_category
* secondary_category
* content_rights_statement
* review_notes
* review_contact_first_name
* review_contact_last_name
* review_contact_email
* review_contact_phone
* demo_account_username
* demo_account_password
* demo_account_notes
* release_notes
* customer_support_email
* customer_support_website
* customer_support_phone
* in_app_purchase_descriptions
* age_rating_answers

#### Platform-specific mapping examples

Apple:

* name
* subtitle
* promotional text
* keywords
* description
* support URL
* marketing URL
* privacy policy URL
* review notes
* app review contact fields
* app review demo account

Google:

* title
* short description
* full description
* release notes by track
* contact email
* contact website
* contact phone
* privacy policy URL
* feature graphic
* content rating questionnaire outputs

#### Metadata versioning rules

* Draft metadata can evolve independently
* Release snapshots must be immutable after release freeze, except via explicit unlock/edit workflow
* Every field change should generate an audit event
* Remote sync state should store hash/checksum for comparison

---

### 9.4 Asset management system

Anystore needs a real asset pipeline, not just file uploads.

#### Asset categories

* app icon source
* app icon derivatives
* screenshots source captures
* screenshot templates
* screenshot outputs
* marketing art
* feature graphics
* tablet screenshots
* video previews (future)
* shared backgrounds
* badges/overlays
* localization-specific background/text assets

#### Responsibilities

* Upload original source assets
* Store generated variants
* Track lineage between source and generated outputs
* Tag assets by purpose and release
* Preview and compare outputs
* Ensure store-compliant dimensions

#### Asset metadata

* asset_id
* app_id
* release_id (nullable)
* asset_type
* source_asset_id (nullable)
* mime_type
* dimensions
* file_size
* locale
* platform
* device_class
* density
* rendering_recipe_id
* checksum
* status
* created_by
* created_at

#### Required behaviors

* Preserve source originals
* Never silently overwrite generated outputs
* Support regeneration when template changes
* Surface stale generated assets when source/template changed

---

### 9.5 Screenshot generation engine

This is a core differentiator.

#### Goal

Given one or more app screenshots plus structured text and design templates, generate store-compliant screenshot packs for iOS and Android across required device classes and locales.

#### Core concepts

* Screenshot Template
* Template Variant
* Layout Region
* Source Capture
* Text Tokens
* Render Recipe
* Output Pack

#### Template structure

A screenshot template defines:

* canvas size or logical frame
* background (solid, gradient, image)
* frame/mock device optionality
* main screenshot placement region
* title text region
* subtitle text region
* badge region
* footer/legal region
* safe zones
* typography tokens
* per-platform overrides
* per-locale text settings

#### Source inputs

* raw app screenshot images
* text tokens for each locale
* optional background image
* style theme
* target platform/device classes

#### Rendering outputs

For iOS, support device families such as:

* 6.7-inch display set
* 6.5-inch if needed for compatibility
* 5.5-inch if needed
* 12.9-inch iPad / relevant newer equivalents

For Android, support:

* phone screenshots
* 7-inch tablet
* 10-inch tablet
* feature graphic

#### Rendering workflow

1. User uploads raw source captures or imports from automation
2. User creates screenshot set for release
3. User assigns template to each logical slide
4. User fills text tokens
5. User previews per locale/platform
6. User validates safe zones and truncation
7. Worker renders output pack
8. Outputs are attached to release/platform/locales

#### Advanced requirements

* Per-locale fallback fonts
* RTL layout support in future
* Text overflow detection
* Batch regenerate all locales on template change
* Deterministic render hashes
* Render cache reuse when recipe/input unchanged

---

### 9.6 Build artifact system

Anystore must track build artifacts separately from store-facing content.

#### Responsibilities

* Register builds
* Parse and extract build metadata
* Map builds to releases
* Validate version name/build number alignment
* Track store upload state

#### Build types

* iOS: IPA, build reference from EAS/Fastlane/Xcode/Transporter
* Android: AAB, APK (APK mainly for testing)

#### Build fields

* build_id
* app_id
* platform
* version_name
* build_number / version_code
* artifact_uri
* source_provider
* git_commit_sha (optional)
* git_tag (optional)
* branch (optional)
* created_at
* uploaded_to_store_at
* remote_store_build_id
* signing_info (metadata only, no raw secrets)

#### Capabilities

* Manual upload registration
* API/CLI build registration
* EAS/GitHub/Fastlane integration later
* Detect mismatch: attached build version != release version

---

### 9.7 Release management

The Release is the main domain object.

#### Release definition

A Release is a versioned shipment plan for one app containing:

* metadata snapshot
* asset snapshot
* platform states
* locale coverage status
* build attachments
* review notes
* sync status
* validation results
* audit history

#### Release fields

* release_id
* app_id
* version_label (canonical marketing version)
* release_name (optional internal label)
* status
* freeze_state
* created_by
* created_at
* updated_at
* target_locales
* release_notes_summary
* source_release_id (for cloning)

#### Platform release state

Per platform, store:

* platform
* target_track/channel
* desired_version_name
* desired_build_number or version_code
* attached_build_id
* sync_status
* submission_status
* review_status
* live_status
* last_sync_at
* remote_release_id

#### Release lifecycle

1. Draft
2. Preparing
3. Validation failed
4. Ready to sync
5. Sync in progress
6. Synced to store
7. Submitted for review (if applicable)
8. In review
9. Approved
10. Published / live
11. Rejected
12. Superseded
13. Archived

#### Freeze rules

* Draft release: editable
* Frozen release: metadata/assets snapshot locked
* Unfreeze requires explicit action and audit event
* Published releases remain immutable snapshots

---

### 9.8 Validation and readiness engine

This engine tells the user whether a release is operationally sound.

#### Validation classes

1. Schema validation
2. Store requirements validation
3. Completeness validation
4. Consistency validation
5. Sync diff validation
6. Screenshot/render validation
7. Compliance reminders

#### Examples

* Missing privacy policy URL
* Missing Android short description
* Apple keyword length exceeded
* iPad screenshots missing while iPad support enabled
* Platform version mismatch
* Release notes missing for target locale
* Demo credentials missing for app with gated functionality
* Generated screenshots outdated after template update
* Remote store metadata differs from local canonical

#### Severity levels

* error: blocks sync/submission
* warning: should be reviewed
* info: helpful suggestion

#### Validation issue fields

* issue_id
* release_id
* severity
* category
* code
* message
* remediation_hint
* path_reference
* detected_at
* resolved_at

---

### 9.9 Sync and remote reconciliation engine

This is the magical part.

#### Primary responsibilities

* Pull remote state from Apple/Google
* Compare remote and canonical state
* Create a sync plan
* Push metadata/assets/build associations
* Record result of each sync operation
* Resolve conflicts where possible

#### Core concepts

* remote snapshot
* diff engine
* sync plan
* sync job
* partial success
* remote reconciliation state

#### Sync modes

1. Dry run
2. Metadata-only sync
3. Assets-only sync
4. Build attachment-only sync
5. Full release sync
6. Pull remote to inspect only
7. Pull and merge with local draft (manual review)

#### Diff model

For each field/asset mapping:

* unchanged
* local_newer
* remote_newer
* conflict
* missing_local
* missing_remote

#### Conflict examples

* User changed iOS description directly in App Store Connect after release freeze
* Google short description edited in Play Console while local draft also changed
* Screenshot count/order differs remotely

#### Sync principles

* Never silently destroy data
* Prefer explicit user choice on conflicts
* Offer “force push local” only with confirmation
* Store last known remote hash/snapshot for deterministic diffing

#### Sync job stages

1. Load release snapshot
2. Load remote snapshot
3. Compute diff
4. Validate sync plan
5. Execute provider operations
6. Collect provider responses
7. Update remote state hashes
8. Emit audit events
9. Surface partial failures

---

### 9.10 Review and compliance workspace

Apple review pain and Google policy paperwork should be managed here.

#### Responsibilities

* Store reviewer notes
* Store contact details
* Store demo/test credentials securely
* Track rejection history
* Save policy explanations
* Reuse previous review text

#### Entities

* review_profile
* review_note_template
* compliance_answer_set
* rejection_event
* policy_response_draft

#### Features

* Review notes editor
* Secure secret fields for demo credentials
* Reusable templates by app type
* Track past rejection messages
* Store prior successful explanations
* Link notes to releases

#### Security note

Passwords/credentials should be encrypted at rest and access-controlled.

---

### 9.11 Localization system

Localization needs to be first-class, not an afterthought.

#### Capabilities

* Define supported locales per app
* Copy canonical locale to new locale
* Track missing translations
* Render localized screenshots
* Preview locale-specific store listing
* Track locale completeness at release level

#### Locale data layers

* base locale content
* locale-specific metadata override
* locale-specific screenshot text tokens
* locale-specific assets

#### Future features

* AI-assisted translation suggestions
* glossary lock for product names/terms
* translation memory

---

### 9.12 Collaboration and permissions

Needed for teams/agencies but must remain lightweight for solo users.

#### Roles

* Owner
* Admin
* Editor
* Reviewer
* Viewer

#### Permissions examples

* Owner/Admin: manage billing/integrations/roles
* Editor: edit apps, metadata, assets, releases
* Reviewer: comment, approve, review diffs
* Viewer: read-only

#### Collaboration features

* Comments on release sections
* Mention users
* Release approval checklist later
* Activity feed

---

### 9.13 Audit log and event history

Every important state change should be traceable.

#### Event examples

* Metadata field edited
* Screenshot template updated
* Release cloned
* Release frozen
* Build attached
* Sync started/completed/failed
* Remote conflict detected
* Rejection recorded

#### Fields

* event_id
* workspace_id
* app_id
* release_id (nullable)
* actor_id
* event_type
* payload
* created_at

---

### 9.14 CLI and API surface

The web app is primary, but long-term leverage requires automation entry points.

#### CLI capabilities (future but architecturally supported)

* authenticate
* register app
* create release
* attach build
* upload source screenshots
* trigger render
* sync release
* fetch validation report

#### Example command set

```bash
anystore login
anystore release create --app cosmic-calendar --version 1.3.0
anystore build attach --app cosmic-calendar --platform ios --file app.ipa
anystore sync --app cosmic-calendar --release 1.3.0 --platform all
```

#### Public API goals

* CRUD for apps/releases/assets/metadata
* validation execution
* sync job submission
* webhook support for CI/build systems

---

## 10. Detailed user journeys

### 10.1 Initial onboarding

1. User signs up
2. Creates workspace
3. Creates first app
4. Connects Apple and/or Google store account
5. Adds bundle/package identifiers
6. Imports remote metadata (optional)
7. Sets primary locale
8. Creates first release draft

### 10.2 Create a new release from previous one

1. User opens app
2. Clicks “Create release”
3. Chooses “Clone previous release”
4. Enters new version name/build targets
5. Release is created with copied metadata snapshot, assets, locale config, review notes
6. User updates changed fields
7. System marks reused screenshots as stale only if template/source change detected
8. User validates and syncs

### 10.3 Screenshot workflow

1. User uploads raw app captures
2. User creates screenshot set for release
3. Chooses template or duplicates prior template
4. Enters title/subtitle tokens per slide and locale
5. Previews all device outputs
6. Runs render job
7. Attaches pack to iOS/Android listing
8. Validation engine checks completeness and dimensions

### 10.4 Full magical sync workflow

1. User creates/finalizes release
2. Attaches builds for iOS and Android
3. Runs validation
4. Reviews diff against remote Apple and Google
5. Selects “Sync both stores”
6. Sync engine pushes metadata, screenshots, release notes, and build associations
7. System shows per-platform progress and result
8. If supported provider flow permits, submission state advances automatically
9. Audit trail recorded

### 10.5 Handling remote drift

1. User opens release dashboard
2. System indicates Android full description changed remotely
3. User opens diff
4. User chooses:

   * adopt remote change into draft
   * overwrite remote with local
   * create manual merge
5. Resolution is recorded

### 10.6 Rejection handling

1. Release status becomes rejected
2. Rejection event is stored with provider message
3. User opens review workspace
4. Previous review notes and templates are shown
5. User updates notes, metadata, or assets
6. New sync/submission cycle begins

---

## 11. Information architecture and page structure

### 11.1 Global navigation

* Dashboard
* Apps
* Releases
* Assets
* Templates
* Integrations
* Activity
* Settings

### 11.2 Dashboard

#### Purpose

Provide a multi-app operational overview.

#### Widgets

* Apps requiring attention
* Releases in progress
* Drift alerts
* Validation failures
* Recently synced releases
* Rejected releases
* Screenshot generation jobs

### 11.3 App overview page

#### Sections

* App summary
* Platform connections
* Latest releases
* Metadata completeness
* Locale matrix
* Asset health
* Sync health
* Recent events

### 11.4 Metadata editor page

#### Sections

* Canonical fields
* iOS overrides
* Android overrides
* Locale selector
* Diff/preview panel
* Character limits/warnings
* Store preview mode

### 11.5 Assets page

#### Sections

* Asset library
* Filters: type/platform/locale/release
* Upload panel
* Preview grid/list
* Version lineage
* Stale/outdated indicators

### 11.6 Screenshot template studio

#### Sections

* Canvas editor
* Layer tree
* Token editor
* Device preview carousel
* Render settings
* Locale preview switcher
* Validation warnings

### 11.7 Release detail page

#### Tabs

* Summary
* Metadata snapshot
* Assets snapshot
* Builds
* Validation
* Sync
* Review/Compliance
* Activity

### 11.8 Sync page

#### Sections

* Remote snapshot status
* Apple diff
* Google diff
* Selected sync operations
* Conflict resolver
* Job progress logs

### 11.9 Integrations page

#### Sections

* Apple connection
* Google connection
* Build source integrations
* Webhooks/API keys
* Connection health

### 11.10 Settings page

#### Sections

* Workspace settings
* Roles and members
* Billing
* Defaults and naming conventions
* Locale defaults
* Branding templates

---

## 12. Functional requirements by module

## 12.1 Authentication and authorization

### Requirements

* Email/password and OAuth support
* Session management
* Password reset
* MFA later
* Role-based access control
* Resource-level authorization checks

### Non-negotiables

* Secure session cookies or token strategy
* Audit sign-in events
* Secrets not exposed to unauthorized roles

---

## 12.2 Workspace requirements

* User can create workspace
* Workspace can contain multiple apps
* Owner can invite members
* Owner/Admin can remove members
* Roles enforced across API and UI

---

## 12.3 App requirements

* User can create app with internal name and slug
* App supports one or both platforms
* User can configure platform identifiers
* User can archive app without deleting historical releases

---

## 12.4 Metadata requirements

* User can edit canonical metadata
* User can set platform overrides
* User can set locale overrides
* Metadata editor shows effective value resolution
* Metadata changes autosave as draft
* Character limit warnings shown per store field
* Metadata can be snapshotted into release
* Metadata diff available between snapshots and remote

---

## 12.5 Asset requirements

* User can upload source assets
* User can tag/categorize assets
* System stores derivative variants
* User can compare asset versions
* User can attach assets to releases
* Asset regeneration can be triggered manually or automatically
* System marks outdated outputs when recipe changes

---

## 12.6 Screenshot generation requirements

* User can create screenshot templates
* Templates support multiple slides
* Slides can bind to different source screenshots and token sets
* System validates dimensions and safe zones
* Worker renders packs for selected device classes/locales
* Render status visible in UI
* Outputs attach to release/platform locale context

---

## 12.7 Release requirements

* User can create release from scratch or clone
* Release supports per-platform state
* User can freeze/unfreeze release with audit event
* Build attachments validated against release target version
* Release can be validated and synced
* Published releases remain visible historically

---

## 12.8 Validation requirements

* Validation runs manually and automatically on key edits
* Results grouped by severity and area
* Blocking issues stop sync action
* User can mark some warnings as acknowledged
* Validation results persisted by release snapshot

---

## 12.9 Sync requirements

* User can connect provider accounts
* User can fetch remote snapshots
* User can run dry-run diff
* User can choose sync scope
* Provider operations retried safely where possible
* Partial failures surfaced clearly
* Sync operations auditable and idempotent where possible

---

## 12.10 Review/compliance requirements

* User can store review notes per release
* User can reuse review notes from previous releases
* Credentials stored securely
* Rejection events can be attached to release history

---

## 12.11 Localization requirements

* User can define supported locales
* User can see completeness matrix by locale
* User can render localized screenshots
* Missing translations flagged in validation

---

## 12.12 Collaboration requirements

* Users can comment on release or metadata sections
* Users can be mentioned
* Activity feed shows relevant changes

---

## 13. Non-functional requirements

### 13.1 Performance

* Dashboard initial render under reasonable thresholds for typical users
* Metadata editing should autosave quickly
* Diff generation should feel interactive for normal payload sizes
* Screenshot render jobs can be async but status updates must be timely

### 13.2 Reliability

* Sync jobs should be resumable or safely retryable when possible
* Asset originals must not be lost
* Release snapshots must be durable and immutable once frozen

### 13.3 Security

* Encryption at rest for credentials/secrets
* Least privilege for provider credentials
* Signed URLs for asset access
* Audit logs for sensitive actions
* Role-gated access to review secrets

### 13.4 Scalability

* Must support many apps per workspace
* Asset storage designed for large media volume
* Queue/worker system horizontally scalable
* Provider adapters isolated to avoid global failures

### 13.5 Observability

* Structured logs
* Metrics for sync success/failure, render time, validation counts
* Job tracing
* Alerting on provider failures or queue backlog

### 13.6 Maintainability

* Clear service boundaries
* Provider abstraction layer
* Strong domain models
* Migration-safe database practices

---

## 14. Data model draft

Below is an initial conceptual schema. Final normalization can evolve.

### 14.1 users

* id
* email
* password_hash / auth_provider fields
* display_name
* avatar_url
* created_at
* updated_at

### 14.2 workspaces

* id
* name
* slug
* owner_user_id
* created_at
* updated_at

### 14.3 workspace_members

* id
* workspace_id
* user_id
* role
* created_at

### 14.4 apps

* id
* workspace_id
* slug
* internal_name
* canonical_product_name
* primary_locale
* status
* created_at
* updated_at

### 14.5 app_platforms

* id
* app_id
* platform
* bundle_or_package_id
* store_account_connection_id
* remote_app_id
* default_track
* status
* created_at
* updated_at

### 14.6 locales

* id
* app_id
* locale_code
* status
* created_at

### 14.7 metadata_documents

* id
* app_id
* scope_type (app_draft, release_snapshot)
* scope_id
* created_at
* updated_at

### 14.8 metadata_entries

* id
* metadata_document_id
* locale_code nullable
* platform nullable
* field_key
* value_json
* source_layer
* created_at
* updated_at

### 14.9 assets

* id
* app_id
* release_id nullable
* source_asset_id nullable
* asset_type
* platform nullable
* locale_code nullable
* device_class nullable
* object_key
* checksum
* width
* height
* status
* created_at
* updated_at

### 14.10 screenshot_templates

* id
* app_id
* name
* definition_json
* version
* created_by
* created_at
* updated_at

### 14.11 render_jobs

* id
* app_id
* release_id nullable
* template_id
* input_payload_json
* status
* started_at
* completed_at
* error_json

### 14.12 builds

* id
* app_id
* platform
* version_name
* build_number
* artifact_uri
* source_provider
* metadata_json
* created_at

### 14.13 releases

* id
* app_id
* version_label
* release_name nullable
* status
* freeze_state
* source_release_id nullable
* created_by
* created_at
* updated_at

### 14.14 release_platforms

* id
* release_id
* platform
* target_track
* desired_version_name
* desired_build_number
* attached_build_id nullable
* sync_status
* submission_status
* review_status
* remote_release_id nullable
* last_sync_at nullable

### 14.15 validation_issues

* id
* release_id
* platform nullable
* locale_code nullable
* severity
* category
* code
* message
* remediation_hint
* path_reference
* status
* detected_at
* resolved_at nullable

### 14.16 provider_connections

* id
* workspace_id
* provider
* encrypted_credentials_blob
* status
* metadata_json
* created_at
* updated_at

### 14.17 remote_snapshots

* id
* app_platform_id
* release_id nullable
* provider
* snapshot_type
* payload_json
* checksum
* fetched_at

### 14.18 sync_jobs

* id
* release_id
* scope_json
* status
* started_at
* completed_at
* result_json
* error_json

### 14.19 review_profiles

* id
* app_id
* encrypted_fields_json
* metadata_json
* created_at
* updated_at

### 14.20 rejection_events

* id
* release_id
* platform
* provider_message
* raw_payload_json
* created_at

### 14.21 comments

* id
* workspace_id
* app_id nullable
* release_id nullable
* target_type
* target_id
* author_user_id
* body
* created_at

### 14.22 audit_events

* id
* workspace_id
* app_id nullable
* release_id nullable
* actor_user_id nullable
* event_type
* payload_json
* created_at

---

## 15. Domain logic rules

### 15.1 Effective metadata resolution

When resolving a field for a given (release, platform, locale), the system should use the most specific available value in this order:

1. release snapshot platform+locale override
2. release snapshot locale override
3. release snapshot platform override
4. release snapshot canonical
5. app draft platform+locale override
6. app draft locale override
7. app draft platform override
8. app draft canonical
9. system default / null

The UI should show where the effective value came from.

### 15.2 Release cloning rules

When cloning release N into release N+1:

* metadata snapshot is copied
* asset associations copied
* unresolved validation issues are not copied as active issues; they are recalculated
* review notes copied
* build attachments are not copied automatically unless explicit option enabled
* sync status reset

### 15.3 Freeze rules

* Frozen releases cannot be edited directly except by explicit unfreeze action
* Unfreeze creates audit event and invalidates last validation run
* Published releases cannot be mutated retroactively; only new releases can supersede them

### 15.4 Asset staleness rules

Generated assets become stale when:

* source asset changed
* template definition version changed
* token content changed
* locale text changed
* target device class rules changed

### 15.5 Sync idempotency rules

Provider operations should be designed so retried sync jobs do not duplicate remote resources unnecessarily. Where the provider API cannot guarantee idempotency, the job should use dedupe keys and remote snapshot checks.

---

## 16. Provider integration design

## 16.1 Provider abstraction

Create a provider interface so Apple/Google are implementations, not hardcoded branches.

```ts
interface StoreProvider {
  validateConnection(): Promise<ProviderHealth>
  fetchApp(remoteAppRef: RemoteAppRef): Promise<RemoteAppSnapshot>
  fetchReleaseState(input: FetchReleaseStateInput): Promise<RemoteReleaseSnapshot>
  diff(local: CanonicalReleaseSnapshot, remote: RemoteReleaseSnapshot): Promise<DiffResult>
  createSyncPlan(input: SyncPlanInput): Promise<SyncPlan>
  executeSyncPlan(plan: SyncPlan): Promise<SyncExecutionResult>
}
```

### 16.2 Apple provider considerations

Anystore needs to support:

* app listing metadata
* localized metadata
* screenshots/app previews where feasible
* build association / version handling
* review notes fields if supported via API or alternative documented path
* release state retrieval

Need to account for:

* Apple API surface limitations
* occasional field-specific API gaps
* asynchronous processing states
* stricter screenshot group requirements

### 16.3 Google provider considerations

Anystore needs to support:

* store listing text
* localized store listing
* screenshots/feature graphics
* tracks and release notes
* build association to tracks
* policy/content metadata where API supports it

Need to account for:

* edit sessions / transactional publishing model
* draft changes before commit
* track-specific release notes

### 16.4 Provider capability map

Maintain an internal capabilities registry per provider and API version.

Example capability flags:

* supports_localized_metadata
* supports_screenshot_upload
* supports_build_assignment
* supports_review_notes_api
* supports_draft_transactions
* supports_preview_submission

This avoids hardcoding false assumptions globally.

---

## 17. Screenshot rendering technical design

### 17.1 Recommendation

Use a deterministic rendering pipeline based on structured template definitions.

Potential implementation options:

* server-side rendering using headless browser (HTML/CSS -> image)
* canvas-based rendering
* dedicated image composition engine

Recommended approach for flexibility:

* Use HTML/CSS/React-based template definitions rendered in a headless browser for complex layouts and typography control
* Convert final renders to PNG/JPEG as needed

### 17.2 Rendering pipeline steps

1. Resolve template version
2. Resolve token values
3. Resolve locale typography settings
4. Resolve background/source assets
5. Render composition to target canvas
6. Run post-render validations
7. Save output to object storage
8. Persist asset records and lineage

### 17.3 Template versioning

Templates should be versioned. Editing a template creates a new template version. Existing release snapshots keep pointer to specific template version unless user opts to update.

---

## 18. Suggested technical stack

This is a recommended implementation direction, not a hard mandate.

### 18.1 Frontend

* Next.js (App Router) or React SPA if preferred
* TypeScript
* Tailwind CSS
* Component library: shadcn/ui or equivalent primitives
* State/query: TanStack Query + lightweight client state
* Form handling: React Hook Form + Zod
* Diff/editor components where needed

### 18.2 Backend

* Node.js + TypeScript
* Framework: NestJS, Fastify, or Express with disciplined modular structure
* Validation: Zod / class-validator depending on framework choice
* ORM: Prisma or Drizzle
* PostgreSQL
* Redis for queues/cache
* BullMQ or equivalent for jobs

### 18.3 Storage

* S3-compatible object storage
* Signed URLs
* CDN later for previews

### 18.4 Rendering

* Headless Chromium / Playwright for screenshot rendering
* Image optimization pipeline

### 18.5 Infra

* Dockerized services
* Managed Postgres
* Managed Redis
* Background worker deployment separately from web app
* Centralized secrets management

### 18.6 Observability

* Structured logging
* OpenTelemetry or equivalent tracing
* Error reporting (Sentry or similar)
* Metrics dashboard

---

## 19. API design examples

### 19.1 App creation

`POST /api/apps`

Payload:

```json
{
  "workspaceId": "ws_123",
  "internalName": "Cosmic Calendar",
  "slug": "cosmic-calendar",
  "primaryLocale": "en-US",
  "platforms": [
    {
      "platform": "ios",
      "bundleOrPackageId": "com.example.cosmiccalendar"
    },
    {
      "platform": "android",
      "bundleOrPackageId": "com.example.cosmiccalendar"
    }
  ]
}
```

### 19.2 Release creation

`POST /api/releases`

```json
{
  "appId": "app_123",
  "versionLabel": "1.3.0",
  "cloneFromReleaseId": "rel_122"
}
```

### 19.3 Validation run

`POST /api/releases/:releaseId/validate`

### 19.4 Sync dry run

`POST /api/releases/:releaseId/sync/dry-run`

### 19.5 Execute sync

`POST /api/releases/:releaseId/sync`

### 19.6 Render screenshot pack

`POST /api/releases/:releaseId/render-screenshots`

---

## 20. UX requirements and design language

### 20.1 UX principles

* Dense but understandable
* Optimized for power use, not cute toy dashboards
* Surface state clearly: draft, stale, synced, conflicting, blocked
* Minimize repeated data entry
* Make cross-platform comparison easy

### 20.2 Important UX patterns

* Split panes for diffing local vs remote
* Tabs for platform and locale
* Breadcrumbs for app > release > section
* Status chips everywhere
* Bulk actions for locales/screenshots
* Inline validation with summary panel
* Autosave drafts with explicit snapshot/freeze moments

### 20.3 Key UI states

* loading
* autosaving
* stale
* sync in progress
* partial sync failure
* render queued
* render failed
* validation blocked
* remote conflict detected

---

## 21. Security design

### 21.1 Sensitive data

Sensitive data includes:

* provider credentials/tokens
* demo/reviewer credentials
* internal notes
* potentially private build artifacts

### 21.2 Requirements

* Encrypt secrets at rest
* Avoid logging raw secret values
* Role-gate access
* Signed URLs for artifacts
* Secret rotation strategy for provider credentials
* Explicit audit events for viewing/editing sensitive review fields where practical

### 21.3 Provider credentials

Use provider connection records with encrypted credential blobs. Consider background refresh if provider auth model requires it.

---

## 22. Operational concerns

### 22.1 Background jobs

Use queue-driven jobs for:

* provider sync
* screenshot rendering
* remote snapshot fetch
* validation recomputation
* webhook processing

### 22.2 Retries

* Exponential backoff where safe
* Provider-specific retry classifications
* Dead-letter queue for persistent failures

### 22.3 Rate limits

Need provider-aware throttling and backoff logic.

### 22.4 Concurrency

Guard against:

* two users editing same release section simultaneously
* concurrent sync jobs for same release/platform
* template edit during render

Recommendation:

* optimistic locking for documents
* release/platform sync mutex

---

## 23. Analytics and events

Track product analytics to understand usage, but keep customer-facing analytics secondary early on.

### Internal product analytics examples

* release creation count
* sync success rate
* validation failure frequency
* most common issue codes
* render duration
* apps per workspace

### Customer-facing lightweight analytics later

* release cycle time
* drift frequency
* stale screenshot frequency
* rejection rate history

---

## 24. Roadmap

## 24.1 Phase 0: Foundation

* Auth, workspace, apps
* Metadata drafts
* Asset library
* Release object model
* Validation engine base
* Audit log base

## 24.2 Phase 1: Strong control plane

* Screenshot template studio MVP
* Release snapshots
* Build attachments
* Validation/reporting
* Export bundles
* Manual-first submission workspace

## 24.3 Phase 2: Magical sync begins

* Apple connection
* Google connection
* Remote pull and diff
* Sync dry run
* Metadata sync
* Asset sync
* Build mapping where supported

## 24.4 Phase 3: Full release ops

* Review/compliance workspace
* Conflict resolution flows
* Better localization
* CLI/API
* CI/build integrations

## 24.5 Phase 4: Power features

* AI-assisted copy/translation suggestions
* rejection-response assistance
* agency client workflows
* advanced automation rules

---

## 25. MVP recommendation vs full magical target

The user asked for the magical version. The architecture should support it immediately.

However, implementation order should still be disciplined.

### Magical target capabilities

* One canonical release model
* Full Apple and Google sync
* Screenshot render automation
* Build association
* Drift detection
* Conflict resolution
* Validation and submission readiness

### What must exist first to make magic real

* strong release model
* strong metadata resolution model
* strong asset lineage model
* provider abstraction
* remote snapshot storage
* diff engine

Without these, “magic sync” becomes brittle spaghetti.

---

## 26. Open questions / product decisions to resolve later

These do not block the spec, but they affect implementation detail.

1. Should build upload to Apple/Google be done directly inside Anystore, or should Anystore primarily register externally uploaded builds first?
2. How opinionated should screenshot templates be initially: structured layouts only, or near-Figma-level freedom?
3. Will Anystore eventually support web store assets, Huawei, Microsoft Store, Steam, etc., or remain mobile-first for a long time?
4. How far should AI assistance go inside v1-v2: copy suggestions only, or workflow automation too?
5. How much collaboration depth is needed before first public release?

Recommended default answers for now:

* register builds first, direct upload later if it materially improves UX
* structured templates first, not design-tool replacement
* stay mobile-first
* AI as assistant, not core dependency
* lightweight collaboration first

---

## 27. Suggested implementation order for engineering

### Milestone A: Core domain and CRUD

* auth
* workspaces
* apps
* locales
* metadata documents/entries
* releases
* audit events

### Milestone B: Assets and templates

* asset uploads
* object storage plumbing
* screenshot template model
* render workers
* output packs
* stale detection

### Milestone C: Release ops core

* release freeze/unfreeze
* build attachments
* validation engine
* app/release dashboards
* diff UI foundations

### Milestone D: Provider abstraction and remote state

* provider connection model
* remote snapshots
* Apple/Google adapter shells
* sync plan structure
* dry-run diff

### Milestone E: Real sync

* metadata push
* asset push
* release notes sync
* conflict handling
* sync jobs UI

### Milestone F: Review/compliance and polish

* review workspace
* secrets handling for demo accounts
* rejection event capture
* timeline improvements

### Milestone G: automation surface

* CLI
* webhooks
* external build integrations

---

## 28. Example product narrative

Anystore gives indie mobile developers the thing app stores never did: a single operational system for managing release metadata, screenshots, builds, and submission state across Apple and Google.

Instead of copying text between dashboards, regenerating screenshots by hand, forgetting which release changed what, and manually aligning platform versions, the developer works from one canonical release record.

Anystore stores the truth. Apple and Google receive synchronized projections of that truth.

That is the product.

---

## 29. Final summary

Anystore is a web-based release operations platform for mobile apps. Its core architectural decision is to treat release data as a canonical, versioned domain model and project that model into Apple App Store Connect and Google Play.

The most important technical pillars are:

* canonical metadata model
* versioned release snapshots
* asset lineage and screenshot generation
* provider abstraction layer
* remote snapshot + diff engine
* validation/readiness engine
* auditability

If built correctly, Anystore becomes the missing operational layer between code and app stores.

That is the spec foundation.
