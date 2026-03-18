import type { ValidationIssueDraft, ValidationRule } from "@anystore/domain";

export class ReviewProfileRule implements ValidationRule {
  readonly code = "review.profile.required";
  readonly category = "compliance" as const;

  evaluate(input: Parameters<ValidationRule["evaluate"]>[0]): ValidationIssueDraft[] {
    if (input.reviewProfilePresent) {
      return [];
    }
    return [
      {
        severity: "warning",
        category: this.category,
        code: "review.profile.missing",
        message: "Release does not have a review profile attached.",
        remediationHint: "Add demo credentials and contact details before submission."
      }
    ];
  }
}
