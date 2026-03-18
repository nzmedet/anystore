import { z } from "zod";
import { MemberRoleValues, PlatformValues, ProviderValues } from "../enums";
import { MetadataEntryRecordSchema } from "../schemas/metadata";

export const CreateWorkspaceRequestSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1)
});

export const CreateAppRequestSchema = z.object({
  workspaceId: z.string(),
  slug: z.string().min(1),
  internalName: z.string().min(1),
  canonicalProductName: z.string().min(1),
  primaryLocale: z.string().min(2)
});

export const AddAppLocaleRequestSchema = z.object({
  localeCode: z.string().min(2)
});

export const CreateReleaseRequestSchema = z.object({
  appId: z.string(),
  versionLabel: z.string().min(1),
  releaseName: z.string().nullable().optional(),
  sourceReleaseId: z.string().nullable().optional()
});

export const UpsertMetadataEntriesRequestSchema = z.object({
  entries: z.array(
    MetadataEntryRecordSchema.pick({
      localeCode: true,
      platform: true,
      fieldKey: true,
      valueJson: true,
      sourceLayer: true
    })
  )
});

export const ResolveMetadataRequestSchema = z.object({
  releaseId: z.string().optional(),
  localeCode: z.string().nullable().optional(),
  platform: z.enum(PlatformValues).nullable().optional()
});

export const CreateProviderConnectionRequestSchema = z.object({
  workspaceId: z.string(),
  provider: z.enum(ProviderValues),
  label: z.string().min(1),
  credentialsJson: z.record(z.string(), z.unknown()).default({})
});

export const InviteWorkspaceMemberRequestSchema = z.object({
  userId: z.string(),
  role: z.enum(MemberRoleValues)
});
