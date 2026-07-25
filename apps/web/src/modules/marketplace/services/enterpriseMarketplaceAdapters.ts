import {
  getEnterpriseBillingPreviewByPlanId,
  getEnterpriseLicenseByProductId,
  getEnterprisePlansByProductId,
  getEnterpriseProductBySlug,
  getEnterpriseProvisioningProfileByProductId
} from "./marketplaceService";
import type { EnterpriseGuardrailResult } from "./marketplaceService";
import type { EnterpriseBillingPreview, EnterpriseLicense, EnterpriseProvisioningProfile, EnterpriseSubscriptionPlan } from "../types/marketplace";

export interface EnterprisePreviewResult<T> {
  status: "preview-only" | "review-required" | "restricted" | "blocked" | "not-found";
  target: T | null;
  canExecute: false;
  warnings: string[];
  disclaimers: string[];
  nextRequiredReview: string;
}

const nonExecutingDisclaimers = [
  "Enterprise preview adapters are mock/config-first and deterministic.",
  "No live subscription, billing provider call, invoice, accounting entry, settlement, treasury routing, wallet signature, contract write, ACS deployment, tenant provisioning, backend, API, database or external integration is active."
];

function statusFromGuardrail(guardrail?: EnterpriseGuardrailResult): EnterprisePreviewResult<unknown>["status"] {
  if (!guardrail) return "not-found";
  if (guardrail.governanceStatus === "blocked") return "blocked";
  if (guardrail.governanceStatus === "restricted") return "restricted";
  if (guardrail.requiredReviews.length > 0) return "review-required";
  return "preview-only";
}

export const EnterpriseGovernanceGuardrailAdapter = {
  preview(productSlugOrId: string): EnterprisePreviewResult<EnterpriseGuardrailResult> {
    const view = getEnterpriseProductBySlug(productSlugOrId);
    if (!view) {
      return {
        status: "not-found",
        target: null,
        canExecute: false,
        warnings: ["Enterprise product not found."],
        disclaimers: nonExecutingDisclaimers,
        nextRequiredReview: "Select a valid enterprise product."
      };
    }

    return {
      status: statusFromGuardrail(view.guardrail),
      target: view.guardrail,
      canExecute: false,
      warnings: view.guardrail.warnings,
      disclaimers: Array.from(new Set([...view.guardrail.disclaimers, ...nonExecutingDisclaimers])),
      nextRequiredReview: view.guardrail.requiredReviews[0] ?? "No review required for mock preview."
    };
  }
};

export const EnterpriseSubscriptionPreviewAdapter = {
  preview(productSlugOrId: string, planId?: string): EnterprisePreviewResult<EnterpriseSubscriptionPlan> {
    const view = getEnterpriseProductBySlug(productSlugOrId);
    const plan = planId ? getEnterprisePlansByProductId(view?.product.id ?? "").find((entry) => entry.id === planId || entry.slug === planId) ?? null : view?.plans[0] ?? null;
    const guardrail = view ? EnterpriseGovernanceGuardrailAdapter.preview(view.product.slug) : null;
    const blockedWarnings = view && !view.guardrail.canRunSubscribePreview ? ["Governance guardrail blocks subscribe preview confirmation."] : [];

    return {
      status: view && plan ? statusFromGuardrail(view.guardrail) : "not-found",
      target: plan,
      canExecute: false,
      warnings: [...(plan?.warnings ?? []), ...(guardrail?.warnings ?? []), ...blockedWarnings, "Subscription preview does not create a live subscription."],
      disclaimers: Array.from(new Set([...(plan?.disclaimers ?? []), ...nonExecutingDisclaimers])),
      nextRequiredReview: guardrail?.nextRequiredReview ?? "Select a valid enterprise product and plan."
    };
  }
};

export const EnterpriseLicensePreviewAdapter = {
  preview(productSlugOrId: string): EnterprisePreviewResult<EnterpriseLicense> {
    const view = getEnterpriseProductBySlug(productSlugOrId);
    const license = view ? getEnterpriseLicenseByProductId(view.product.id) : null;
    return {
      status: view && license ? statusFromGuardrail(view.guardrail) : "not-found",
      target: license,
      canExecute: false,
      warnings: [...(license?.warnings ?? []), ...(view?.guardrail.warnings ?? []), "License preview does not issue a live license or entitlement."],
      disclaimers: Array.from(new Set([...(license?.disclaimers ?? []), ...nonExecutingDisclaimers])),
      nextRequiredReview: view?.guardrail.requiredReviews[0] ?? "No review required for mock license preview."
    };
  }
};

export const EnterpriseProvisioningPreviewAdapter = {
  preview(productSlugOrId: string): EnterprisePreviewResult<EnterpriseProvisioningProfile> {
    const view = getEnterpriseProductBySlug(productSlugOrId);
    const profile = view ? getEnterpriseProvisioningProfileByProductId(view.product.id) : null;
    const blockedWarnings = view && !view.guardrail.canRunProvisioningPreview ? ["Governance guardrail blocks provisioning preview."] : [];
    return {
      status: view && profile ? statusFromGuardrail(view.guardrail) : "not-found",
      target: profile,
      canExecute: false,
      warnings: [...(profile?.warnings ?? []), ...(view?.guardrail.warnings ?? []), ...blockedWarnings, "Provisioning preview does not deploy ACS services or provision tenant access."],
      disclaimers: Array.from(new Set([...(profile?.disclaimers ?? []), ...nonExecutingDisclaimers])),
      nextRequiredReview: view?.guardrail.requiredReviews[0] ?? "No review required for mock provisioning preview."
    };
  }
};

export const EnterpriseBillingPreviewAdapter = {
  preview(productSlugOrId: string, planId?: string): EnterprisePreviewResult<EnterpriseBillingPreview> {
    const view = getEnterpriseProductBySlug(productSlugOrId);
    const plan = planId ? view?.plans.find((entry) => entry.id === planId || entry.slug === planId) : view?.plans[0];
    const billingPreview = plan ? getEnterpriseBillingPreviewByPlanId(plan.id) : null;
    return {
      status: view && billingPreview ? statusFromGuardrail(view.guardrail) : "not-found",
      target: billingPreview,
      canExecute: false,
      warnings: [...(billingPreview?.warnings ?? []), ...(view?.guardrail.warnings ?? []), "Billing preview cannot execute payment, invoice, settlement, accounting or treasury routing."],
      disclaimers: Array.from(new Set([...(billingPreview?.disclaimers ?? []), ...nonExecutingDisclaimers])),
      nextRequiredReview: view?.guardrail.requiredReviews[0] ?? "No review required for mock billing preview."
    };
  }
};
