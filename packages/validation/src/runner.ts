import type { ValidationContext, ValidationIssueDraft, ValidationRule } from "@anystore/domain";
import { MetadataCompletenessRule } from "./rules/metadata-completeness.rule";
import { ReviewProfileRule } from "./rules/review-profile.rule";

const rules: ValidationRule[] = [new MetadataCompletenessRule(), new ReviewProfileRule()];

export function runValidation(context: ValidationContext): ValidationIssueDraft[] {
  return rules.flatMap((rule) => rule.evaluate(context));
}

export function getValidationRules(): ValidationRule[] {
  return rules;
}
