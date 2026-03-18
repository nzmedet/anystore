import { z } from "zod";
import { MetadataFieldKeyValues } from "../metadata-field-keys";
import { PlatformValues } from "../enums";

export const MetadataEntryRecordSchema = z.object({
  id: z.string(),
  metadataDocumentId: z.string(),
  localeCode: z.string().nullable().optional(),
  platform: z.enum(PlatformValues).nullable().optional(),
  fieldKey: z.enum(MetadataFieldKeyValues),
  valueJson: z.unknown(),
  sourceLayer: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type MetadataEntryRecord = z.infer<typeof MetadataEntryRecordSchema>;

export const ResolveEffectiveMetadataInputSchema = z.object({
  appDraftEntries: z.array(MetadataEntryRecordSchema),
  releaseSnapshotEntries: z.array(MetadataEntryRecordSchema).optional(),
  localeCode: z.string().nullable().optional(),
  platform: z.enum(PlatformValues).nullable().optional()
});

export interface ResolvedMetadataField {
  fieldKey: (typeof MetadataFieldKeyValues)[number];
  value: unknown;
  source:
    | "release_snapshot_platform_locale"
    | "release_snapshot_locale"
    | "release_snapshot_platform"
    | "release_snapshot_canonical"
    | "app_draft_platform_locale"
    | "app_draft_locale"
    | "app_draft_platform"
    | "app_draft_canonical";
}
