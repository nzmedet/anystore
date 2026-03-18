-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('ios', 'android');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('app_store_connect', 'google_play');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('owner', 'admin', 'editor', 'reviewer', 'viewer');

-- CreateEnum
CREATE TYPE "MetadataScopeType" AS ENUM ('app_draft', 'release_snapshot');

-- CreateEnum
CREATE TYPE "ReleaseStatus" AS ENUM ('draft', 'preparing', 'validation_failed', 'ready_to_sync', 'sync_in_progress', 'synced', 'submitted', 'in_review', 'approved', 'published', 'rejected', 'superseded', 'archived');

-- CreateEnum
CREATE TYPE "FreezeState" AS ENUM ('mutable', 'frozen');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('not_submitted', 'draft', 'submitted', 'in_review', 'approved', 'rejected', 'live');

-- CreateEnum
CREATE TYPE "SyncJobStatus" AS ENUM ('queued', 'running', 'succeeded', 'partially_failed', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "RenderJobStatus" AS ENUM ('queued', 'running', 'succeeded', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "ValidationSeverity" AS ENUM ('error', 'warning', 'info');

-- CreateEnum
CREATE TYPE "ValidationCategory" AS ENUM ('schema', 'completeness', 'consistency', 'provider', 'screenshots', 'compliance', 'sync');

-- CreateEnum
CREATE TYPE "ValidationIssueStatus" AS ENUM ('active', 'acknowledged', 'resolved');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('icon_source', 'icon_output', 'screenshot_source', 'screenshot_output', 'screenshot_background', 'feature_graphic', 'preview_video', 'generic');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('pending_upload', 'ready', 'processing', 'stale', 'failed', 'archived');

-- CreateEnum
CREATE TYPE "BuildSourceProvider" AS ENUM ('manual', 'eas', 'fastlane', 'github_actions', 'xcode_cloud', 'other');

-- CreateEnum
CREATE TYPE "AppStatus" AS ENUM ('active', 'archived');

-- CreateEnum
CREATE TYPE "AppPlatformStatus" AS ENUM ('connected', 'not_connected', 'misconfigured');

-- CreateEnum
CREATE TYPE "AppLocaleStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "ProviderConnectionStatus" AS ENUM ('connected', 'expired', 'invalid', 'pending');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "display_name" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "owner_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_members" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "MemberRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workspace_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apps" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "internal_name" TEXT NOT NULL,
    "canonical_product_name" TEXT NOT NULL,
    "primary_locale" TEXT NOT NULL,
    "status" "AppStatus" NOT NULL,
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_platforms" (
    "id" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "bundle_or_package_id" TEXT NOT NULL,
    "store_account_connection_id" TEXT,
    "remote_app_id" TEXT,
    "default_track" TEXT,
    "status" "AppPlatformStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_platforms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_locales" (
    "id" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "locale_code" TEXT NOT NULL,
    "status" "AppLocaleStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_locales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metadata_documents" (
    "id" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "scope_type" "MetadataScopeType" NOT NULL,
    "scope_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "metadata_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metadata_entries" (
    "id" TEXT NOT NULL,
    "metadata_document_id" TEXT NOT NULL,
    "locale_code" TEXT,
    "platform" "Platform",
    "field_key" TEXT NOT NULL,
    "value_json" JSONB NOT NULL,
    "source_layer" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "metadata_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "releases" (
    "id" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "version_label" TEXT NOT NULL,
    "release_name" TEXT,
    "status" "ReleaseStatus" NOT NULL,
    "freeze_state" "FreezeState" NOT NULL,
    "source_release_id" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "releases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "release_platform_states" (
    "id" TEXT NOT NULL,
    "release_id" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "target_track" TEXT,
    "desired_version_name" TEXT,
    "desired_build_number" TEXT,
    "attached_build_id" TEXT,
    "submission_status" "SubmissionStatus" NOT NULL,
    "sync_status" "SyncJobStatus",
    "review_status" "SubmissionStatus",
    "remote_release_id" TEXT,
    "last_sync_at" TIMESTAMP(3),

    CONSTRAINT "release_platform_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "release_id" TEXT,
    "source_asset_id" TEXT,
    "asset_type" "AssetType" NOT NULL,
    "status" "AssetStatus" NOT NULL,
    "platform" "Platform",
    "locale_code" TEXT,
    "device_class" TEXT,
    "mime_type" TEXT NOT NULL,
    "object_key" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "file_size_bytes" INTEGER,
    "lineage_json" JSONB,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "build_artifacts" (
    "id" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "version_name" TEXT NOT NULL,
    "build_number" TEXT NOT NULL,
    "artifact_uri" TEXT,
    "source_provider" "BuildSourceProvider" NOT NULL,
    "git_commit_sha" TEXT,
    "git_tag" TEXT,
    "branch" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "build_artifacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "validation_issues" (
    "id" TEXT NOT NULL,
    "release_id" TEXT NOT NULL,
    "platform" "Platform",
    "locale_code" TEXT,
    "severity" "ValidationSeverity" NOT NULL,
    "category" "ValidationCategory" NOT NULL,
    "code" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "remediation_hint" TEXT,
    "path_reference" TEXT,
    "status" "ValidationIssueStatus" NOT NULL,
    "detected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "validation_issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_connections" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "provider" "Provider" NOT NULL,
    "label" TEXT NOT NULL,
    "status" "ProviderConnectionStatus" NOT NULL,
    "credentials_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "remote_snapshots" (
    "id" TEXT NOT NULL,
    "app_platform_id" TEXT NOT NULL,
    "release_id" TEXT,
    "provider" "Provider" NOT NULL,
    "snapshot_type" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "payload_json" JSONB NOT NULL,
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "remote_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_jobs" (
    "id" TEXT NOT NULL,
    "release_id" TEXT NOT NULL,
    "status" "SyncJobStatus" NOT NULL,
    "plan_json" JSONB NOT NULL,
    "error_json" JSONB,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sync_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_profiles" (
    "id" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "contact_first_name" TEXT,
    "contact_last_name" TEXT,
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "demo_username" TEXT,
    "demo_password" TEXT,
    "demo_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_events" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "app_id" TEXT,
    "release_id" TEXT,
    "actor_user_id" TEXT,
    "event_type" TEXT NOT NULL,
    "payload_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_slug_key" ON "workspaces"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_members_workspace_id_user_id_key" ON "workspace_members"("workspace_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "apps_workspace_id_slug_key" ON "apps"("workspace_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "app_platforms_app_id_platform_key" ON "app_platforms"("app_id", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "app_locales_app_id_locale_code_key" ON "app_locales"("app_id", "locale_code");

-- CreateIndex
CREATE UNIQUE INDEX "metadata_documents_app_id_scope_type_scope_id_key" ON "metadata_documents"("app_id", "scope_type", "scope_id");

-- CreateIndex
CREATE INDEX "metadata_entries_metadata_document_id_locale_code_platform__idx" ON "metadata_entries"("metadata_document_id", "locale_code", "platform", "field_key");

-- CreateIndex
CREATE UNIQUE INDEX "releases_app_id_version_label_key" ON "releases"("app_id", "version_label");

-- CreateIndex
CREATE UNIQUE INDEX "release_platform_states_release_id_platform_key" ON "release_platform_states"("release_id", "platform");

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apps" ADD CONSTRAINT "apps_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_platforms" ADD CONSTRAINT "app_platforms_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_platforms" ADD CONSTRAINT "app_platforms_store_account_connection_id_fkey" FOREIGN KEY ("store_account_connection_id") REFERENCES "provider_connections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_locales" ADD CONSTRAINT "app_locales_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metadata_documents" ADD CONSTRAINT "metadata_documents_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metadata_entries" ADD CONSTRAINT "metadata_entries_metadata_document_id_fkey" FOREIGN KEY ("metadata_document_id") REFERENCES "metadata_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "releases" ADD CONSTRAINT "releases_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "releases" ADD CONSTRAINT "releases_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "releases" ADD CONSTRAINT "releases_source_release_id_fkey" FOREIGN KEY ("source_release_id") REFERENCES "releases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "release_platform_states" ADD CONSTRAINT "release_platform_states_release_id_fkey" FOREIGN KEY ("release_id") REFERENCES "releases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "release_platform_states" ADD CONSTRAINT "release_platform_states_attached_build_id_fkey" FOREIGN KEY ("attached_build_id") REFERENCES "build_artifacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_release_id_fkey" FOREIGN KEY ("release_id") REFERENCES "releases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_source_asset_id_fkey" FOREIGN KEY ("source_asset_id") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "build_artifacts" ADD CONSTRAINT "build_artifacts_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validation_issues" ADD CONSTRAINT "validation_issues_release_id_fkey" FOREIGN KEY ("release_id") REFERENCES "releases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_connections" ADD CONSTRAINT "provider_connections_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remote_snapshots" ADD CONSTRAINT "remote_snapshots_app_platform_id_fkey" FOREIGN KEY ("app_platform_id") REFERENCES "app_platforms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_jobs" ADD CONSTRAINT "sync_jobs_release_id_fkey" FOREIGN KEY ("release_id") REFERENCES "releases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_profiles" ADD CONSTRAINT "review_profiles_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_release_id_fkey" FOREIGN KEY ("release_id") REFERENCES "releases"("id") ON DELETE SET NULL ON UPDATE CASCADE;
