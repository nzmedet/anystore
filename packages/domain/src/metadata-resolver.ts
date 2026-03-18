import type { Platform } from "./enums";
import type { MetadataFieldKey } from "./metadata-field-keys";
import type { MetadataEntryRecord, ResolvedMetadataField } from "./schemas/metadata";

export interface ResolveEffectiveMetadataInput {
  appDraftEntries: MetadataEntryRecord[];
  releaseSnapshotEntries?: MetadataEntryRecord[];
  localeCode?: string | null;
  platform?: Platform | null;
}

export interface ResolvedEffectiveMetadataOutput {
  fields: ResolvedMetadataField[];
}

type ResolutionSource = ResolvedMetadataField["source"];

function matches(
  entry: MetadataEntryRecord,
  fieldKey: MetadataFieldKey,
  localeCode?: string | null,
  platform?: Platform | null
) {
  return (
    entry.fieldKey === fieldKey &&
    (localeCode === undefined || entry.localeCode === localeCode) &&
    (platform === undefined || entry.platform === platform)
  );
}

function findEntry(
  entries: MetadataEntryRecord[],
  fieldKey: MetadataFieldKey,
  localeCode: string | null | undefined,
  platform: Platform | null | undefined
) {
  return entries.find((entry) => matches(entry, fieldKey, localeCode, platform));
}

export function resolveEffectiveMetadata(input: ResolveEffectiveMetadataInput): ResolvedEffectiveMetadataOutput {
  const releaseSnapshotEntries = input.releaseSnapshotEntries ?? [];
  const appDraftEntries = input.appDraftEntries;
  const fieldKeys = new Set<MetadataFieldKey>(
    [...releaseSnapshotEntries, ...appDraftEntries].map((entry) => entry.fieldKey as MetadataFieldKey)
  );

  const resolutionOrder: Array<{
    entries: MetadataEntryRecord[];
    localeCode?: string | null;
    platform?: Platform | null;
    source: ResolutionSource;
  }> = [
    {
      entries: releaseSnapshotEntries,
      localeCode: input.localeCode,
      platform: input.platform,
      source: "release_snapshot_platform_locale"
    },
    {
      entries: releaseSnapshotEntries,
      localeCode: input.localeCode,
      platform: null,
      source: "release_snapshot_locale"
    },
    {
      entries: releaseSnapshotEntries,
      localeCode: null,
      platform: input.platform,
      source: "release_snapshot_platform"
    },
    {
      entries: releaseSnapshotEntries,
      localeCode: null,
      platform: null,
      source: "release_snapshot_canonical"
    },
    {
      entries: appDraftEntries,
      localeCode: input.localeCode,
      platform: input.platform,
      source: "app_draft_platform_locale"
    },
    {
      entries: appDraftEntries,
      localeCode: input.localeCode,
      platform: null,
      source: "app_draft_locale"
    },
    {
      entries: appDraftEntries,
      localeCode: null,
      platform: input.platform,
      source: "app_draft_platform"
    },
    {
      entries: appDraftEntries,
      localeCode: null,
      platform: null,
      source: "app_draft_canonical"
    }
  ];

  const fields = [...fieldKeys]
    .map((fieldKey) => {
      for (const step of resolutionOrder) {
        const entry = findEntry(step.entries, fieldKey, step.localeCode, step.platform);
        if (entry) {
          return {
            fieldKey,
            value: entry.valueJson,
            source: step.source
          } satisfies ResolvedMetadataField;
        }
      }
      return null;
    })
    .filter((field): field is ResolvedMetadataField => field !== null);

  return { fields };
}
