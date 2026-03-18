import type { MetadataFieldKey, ValidationIssueDraft, ValidationRule } from "@anystore/domain";

const requiredFieldKeys: MetadataFieldKey[] = [
  "product_name",
  "full_description",
  "privacy_policy_url",
  "release_notes"
];

export class MetadataCompletenessRule implements ValidationRule {
  readonly code = "metadata.required_fields";
  readonly category = "completeness" as const;

  evaluate(input: Parameters<ValidationRule["evaluate"]>[0]): ValidationIssueDraft[] {
    return requiredFieldKeys
      .filter((fieldKey) => !input.resolvedMetadata.some((field) => field.fieldKey === fieldKey))
      .map((fieldKey) => ({
        severity: "error" as const,
        category: this.category,
        code: `metadata.${fieldKey}.missing`,
        message: `Missing required metadata field: ${fieldKey}.`,
        remediationHint: "Populate the draft metadata before freezing or syncing.",
        pathReference: fieldKey
      }));
  }
}
