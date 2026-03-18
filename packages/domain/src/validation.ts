import type {
  AppLocaleSummary,
  AppPlatformSummary,
  AppSummary,
  AssetSummary,
  BuildArtifactSummary,
  ReleasePlatformStateSummary,
  ReleaseSummary
} from "./contracts";
import type { Platform, ValidationCategory, ValidationSeverity } from "./enums";
import type { ResolvedMetadataField } from "./schemas/metadata";

export interface ValidationContext {
  releaseId: string;
  app: AppSummary;
  platforms: AppPlatformSummary[];
  locales: AppLocaleSummary[];
  release: ReleaseSummary;
  releasePlatformStates: ReleasePlatformStateSummary[];
  resolvedMetadata: ResolvedMetadataField[];
  assets: AssetSummary[];
  builds: BuildArtifactSummary[];
  reviewProfilePresent: boolean;
}

export interface ValidationIssueDraft {
  platform?: Platform | null;
  localeCode?: string | null;
  severity: ValidationSeverity;
  category: ValidationCategory;
  code: string;
  message: string;
  remediationHint?: string | null;
  pathReference?: string | null;
}

export interface ValidationRule {
  code: string;
  category: ValidationCategory;
  evaluate(input: ValidationContext): ValidationIssueDraft[];
}
