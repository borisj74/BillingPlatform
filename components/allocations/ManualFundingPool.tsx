"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AllocationBreadcrumbs,
  allocationFlowCrumbs,
} from "@/components/allocations/AllocationBreadcrumbs";
import { AllocationStepper } from "@/components/allocations/AllocationStepper";
import { paymentDetails } from "@/lib/mock-data";
import {
  MANUAL_HIGH_CONFIDENCE_COUNT,
  MANUAL_REVIEW_TOTAL,
  manualHighConfidenceCredits,
} from "@/lib/manual-funding-mock";
import { getFundingPoolTotal, useAllocation } from "@/lib/allocation-store";
import { formatUsd } from "@/lib/format";
import { Checkbox } from "@/components/ui/checkbox";
import { ScopedAccountSearch } from "@/components/allocations/ScopedAccountSearch";

const checkboxPoolClass =
  "mt-0.75 size-[18px] shrink-0 rounded-sm border-[#D1D5DB] data-checked:border-success data-checked:bg-success data-checked:text-white";

const POTENTIAL_ADDITIONAL = 23200;

/** Second segment after customer name, e.g. "West Coast HQ". */
function creditShort(line: string): string {
  const parts = line.split(" · ");
  return parts.length >= 2 ? parts[1] : line;
}

function wireDateShort(dateStr: string): string {
  const t = Date.parse(dateStr);
  if (Number.isNaN(t)) return "Feb 28";
  return new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ManualFundingPool() {
  const { state } = useAllocation();
  const poolTotal = getFundingPoolTotal(state);
  const paymentAmt = state.paymentSelected ? paymentDetails.amount : 0;

  const hcSum = useMemo(
    () => manualHighConfidenceCredits.reduce((s, c) => s + c.amount, 0),
    [],
  );

  const [reviewActioned, setReviewActioned] = useState<Set<string>>(() => new Set(["cr8028"]));

  function toggleReview(id: string) {
    setReviewActioned((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const actionedLabel = `${reviewActioned.size} of ${MANUAL_REVIEW_TOTAL} actioned`;
  const progressPct = Math.min(100, (reviewActioned.size / MANUAL_REVIEW_TOTAL) * 100);

  return (
    <div className="mx-auto max-w-[1158px]">
      <AllocationBreadcrumbs
        items={allocationFlowCrumbs(state.customer, "funding")}
        slaBadge="1d past SLA"
      />
      <AllocationStepper current={2} tone="manualFallback" />

      <div className="mb-4 flex flex-wrap items-start gap-3 rounded-[10px] border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F59E0B]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <circle cx="11" cy="11" r="8" stroke="#FFFFFF" strokeWidth="2.2" />
            <path d="m21 21-4.35-4.35" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M11 8v3l1.5 1.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-semibold leading-snug text-amber-900">
            AI found 4 of 11 credits with high confidence · 7 require manual review
          </p>
          <p className="mt-0.75 text-[12.5px] leading-relaxed text-[#B45309]">
            All 40 {state.customer} accounts were scanned. Credits below the 70% confidence threshold
            couldn&apos;t be matched automatically. Use the search tools below — each is scoped to{" "}
            {state.customer}&apos;s 40 accounts only.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <div className="rounded-[20px] border border-[#A7F3D0] bg-[#D1FAE5] px-2.5 py-0.75">
            <span className="text-[11.5px] font-semibold text-[#065F46]">✓ 4 confirmed</span>
          </div>
          <div className="rounded-[20px] border border-[#FDE68A] bg-[#FEF3C7] px-2.5 py-0.75">
            <span className="text-[11.5px] font-semibold text-[#D97706]">○ 7 need review</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3.5">
          {/* High confidence */}
          <div className="overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white">
            <div className="flex flex-wrap items-center gap-2 border-b border-[#F3F4F6] px-4 py-3.25">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <circle cx="12" cy="12" r="10" fill="#F0FDF4" />
                <polyline
                  points="16 8 10 14 7 11"
                  stroke="#16A34A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm font-semibold text-text-primary">High Confidence — Ready to Add</span>
              <div className="ml-0 rounded-[20px] bg-success-subtle px-2.5 py-0.5">
                <span className="text-[11.5px] font-semibold text-success">4 credits · AI 75–84%</span>
              </div>
              <span className="ml-auto text-xs font-semibold text-success">✓ All added to pool</span>
            </div>
            {manualHighConfidenceCredits.map((c) => (
              <div
                key={c.id}
                className="flex items-center border-b border-[#F9FAFB] bg-success-subtle px-4 py-3 last:border-b-0"
              >
                <div className="mr-3 flex size-[18px] shrink-0 items-center justify-center rounded-sm bg-success">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <polyline
                      points="20 6 9 17 4 12"
                      stroke="#FFFFFF"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-semibold text-text-primary">{c.number}</div>
                  <div className="text-xs text-text-secondary">{c.line}</div>
                </div>
                <div className="mr-3 rounded-sm bg-brand-subtle px-1.75 py-0.5">
                  <span className="text-[11px] font-bold text-brand">AI {c.ai}%</span>
                </div>
                <div className="mr-3 text-[13.5px] font-semibold tabular-nums text-success">{formatUsd(c.amount)}</div>
                <span className="text-[12.5px] font-semibold text-success">Added</span>
              </div>
            ))}
          </div>

          {/* Needs manual review */}
          <div className="overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white">
            <div className="flex flex-wrap items-center gap-2 border-b border-[#F3F4F6] px-4 py-3.25">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <circle cx="12" cy="12" r="10" stroke="#D97706" strokeWidth="2" />
                <line x1="12" y1="8" x2="12" y2="12" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1" fill="#D97706" />
              </svg>
              <span className="text-sm font-semibold text-text-primary">Needs Manual Review</span>
              <div className="rounded-[20px] bg-[#FEF3C7] px-2.5 py-0.5">
                <span className="text-[11.5px] font-semibold text-[#D97706]">7 credits unresolved</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs font-medium text-text-primary">{actionedLabel}</span>
                <div className="h-1.25 w-14 overflow-hidden rounded-[3px] bg-[#E5E7EB]">
                  <div className="h-full rounded-[3px] bg-brand" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 border-b border-[#F3F4F6] bg-[#F9FAFB] px-4 py-2.25">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="text-xs text-text-secondary">
                All searches below are scoped to {state.customer}&apos;s 40 accounts — not the full account directory.
              </p>
            </div>

            {/* CR-8028 */}
            <div className="border-b border-[#F3F4F6] px-4 py-3">
              <div className="flex gap-3">
                <Checkbox
                  id="mr-cr8028"
                  checked={reviewActioned.has("cr8028")}
                  onCheckedChange={() => toggleReview("cr8028")}
                  className={checkboxPoolClass}
                  aria-label="Mark CR-8028 as actioned"
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-0.75 flex flex-wrap items-center gap-2">
                    <span className="text-[13.5px] font-semibold text-text-primary">CR-8028</span>
                    <span className="rounded-sm bg-[#F3F4F6] px-1.75 py-0.5 text-[11px] font-bold text-text-secondary">
                      Not located
                    </span>
                    <span className="ml-auto text-xs tabular-nums text-text-primary">{formatUsd(3900)}</span>
                  </div>
                  <p className="mb-2 text-xs text-text-secondary">
                    Expected in: Pacific Northwest Division · From remittance
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <ScopedAccountSearch customerName={state.customer} />
                    <button
                      type="button"
                      className="shrink-0 rounded-[4px] border border-[#9CA3AF] px-2.5 py-1.75 text-[13px] text-text-primary hover:bg-[#F9FAFB]"
                    >
                      Skip · Can&apos;t locate
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CR-8025 */}
            <div className="border-b border-[#F3F4F6] px-4 py-3">
              <div className="flex gap-3">
                <Checkbox
                  id="mr-cr8025"
                  checked={reviewActioned.has("cr8025")}
                  onCheckedChange={() => toggleReview("cr8025")}
                  className={checkboxPoolClass}
                  aria-label="Mark CR-8025 as actioned"
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-0.75 flex flex-wrap items-center gap-2">
                    <span className="text-[13.5px] font-semibold text-text-primary">CR-8025</span>
                    <span className="rounded-sm bg-[#FEF3C7] px-1.75 py-0.5 text-[11px] font-bold text-[#D97706]">
                      AI 52% · Low confidence
                    </span>
                    <span className="ml-auto text-xs tabular-nums text-text-primary">{formatUsd(2800)}</span>
                  </div>
                  <p className="mb-2 text-xs text-text-secondary">
                    Expected in: Southeast Region · Found a possible match at a different account
                  </p>
                  <div className="rounded-[7px] border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2.5">
                    <p className="text-xs font-semibold text-amber-900">Possible match found</p>
                    <p className="mb-2 text-xs text-amber-900">
                      CR-8025 · Gulf Coast Division · $2,800.00 · Issued Feb 11
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <button type="button" className="rounded-[4px] bg-brand px-3 py-1.25 text-xs font-semibold text-white hover:bg-brand/90">
                        Confirm this match
                      </button>
                      <button
                        type="button"
                        className="rounded-[4px] border border-[#E5E7EB] bg-white px-3 py-1.25 text-xs text-text-primary hover:bg-[#F9FAFB]"
                      >
                        Search instead
                      </button>
                      <button type="button" className="ml-auto text-xs text-brand hover:underline">
                        Skip
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CR-8022 */}
            <div className="border-b border-[#F3F4F6] px-4 py-3">
              <div className="flex gap-3">
                <Checkbox
                  id="mr-cr8022"
                  checked={reviewActioned.has("cr8022")}
                  onCheckedChange={() => toggleReview("cr8022")}
                  className={checkboxPoolClass}
                  aria-label="Mark CR-8022 as actioned"
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-0.75 flex flex-wrap items-center gap-2">
                    <span className="text-[13.5px] font-semibold text-text-primary">CR-8022</span>
                    <span className="rounded-sm bg-brand-subtle px-1.75 py-0.5 text-[11px] font-bold text-brand">
                      2 possible matches
                    </span>
                    <span className="ml-auto text-xs tabular-nums text-text-primary">{formatUsd(6500)}</span>
                  </div>
                  <p className="mb-2 text-xs text-text-secondary">
                    Expected in: Midwest Central · Same amount found in 2 accounts — confirm which one the customer
                    intended
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <div className="min-w-0 flex-1 rounded-[7px] border-[1.5px] border-[#D1D5DB] px-3 py-2.5">
                      <p className="text-[11.5px] font-semibold text-text-primary">Option A</p>
                      <p className="text-[11.5px] text-text-secondary">CR-8022 · Midwest Central</p>
                      <p className="text-[11.5px] text-text-secondary">$6,500.00 · Issued Feb 9</p>
                    </div>
                    <div className="min-w-0 flex-1 rounded-[7px] border-[1.5px] border-[#D1D5DB] px-3 py-2.5">
                      <p className="text-[11.5px] font-semibold text-text-primary">Option B</p>
                      <p className="text-[11.5px] text-text-secondary">CR-8022 · Northern Illinois</p>
                      <p className="text-[11.5px] text-text-secondary">$6,500.00 · Issued Feb 14</p>
                    </div>
                    <div className="flex items-end">
                      <button type="button" className="px-1 py-1.25 text-xs text-brand hover:underline">
                        Skip
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CR-8019 */}
            <div className="bg-[#FFF8F8] px-4 py-3">
              <div className="flex gap-3">
                <div className="mt-0.75 flex size-[18px] shrink-0 items-center justify-center rounded-sm border-[1.5px] border-[#FCA5A5] bg-[#FEE2E2]">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <line x1="18" y1="6" x2="6" y2="18" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="6" y1="6" x2="18" y2="18" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.75 flex flex-wrap items-center gap-2">
                    <span className="text-[13.5px] font-semibold text-[#991B1B]">CR-8019</span>
                    <span className="rounded-sm bg-[#FEE2E2] px-1.75 py-0.5 text-[11px] font-bold text-error">Invalid ID</span>
                    <span className="ml-auto text-xs tabular-nums text-text-primary">{formatUsd(1800)}</span>
                  </div>
                  <p className="mb-2 text-xs text-text-secondary">
                    Expected in: Mountain West · Not found in any of the 40 accounts. This ID may be invalid or belong to
                    a different customer.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-[4px] border border-[#E5E7EB] bg-white px-3 py-1.25 text-xs text-text-primary hover:bg-[#F9FAFB]"
                    >
                      Search for similar
                    </button>
                    <button
                      type="button"
                      className="rounded-[4px] border border-[#FECACA] bg-white px-3 py-1.25 text-xs text-error hover:bg-error-subtle"
                    >
                      Flag & Skip
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[300px]">
          <div className="overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white">
            <div className="flex items-center bg-brand px-4 py-3.5">
              <span className="text-sm font-bold text-white">Funding Pool</span>
              <span className="ml-auto text-xs text-[#C7D2FE]">
                {MANUAL_HIGH_CONFIDENCE_COUNT} high-confidence credits
              </span>
            </div>
            <div className="flex flex-col gap-2 px-3.5 py-3">
              {state.paymentSelected && (
                <div className="flex items-center rounded-lg border border-[#E5E7EB] px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-semibold text-text-primary">
                      {paymentDetails.method} {paymentDetails.reference}
                    </div>
                    <div className="text-[11px] text-text-tertiary">Payment · {wireDateShort(paymentDetails.date)}</div>
                  </div>
                  <div className="ml-2 shrink-0 text-[13px] font-bold tabular-nums text-brand">{formatUsd(paymentAmt)}</div>
                </div>
              )}

              <div className="flex items-center gap-1.5 px-0.5">
                <div className="h-px grow bg-[#F3F4F6]" />
                <span className="shrink-0 text-[10.5px] font-medium text-text-tertiary">
                  Confirmed credits ({MANUAL_HIGH_CONFIDENCE_COUNT})
                </span>
                <div className="h-px grow bg-[#F3F4F6]" />
              </div>

              {manualHighConfidenceCredits.map((c) => (
                <div key={c.id} className="flex items-center rounded-lg border border-[#E5E7EB] px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-semibold text-text-primary">{c.number}</div>
                    <div className="text-[11px] text-text-tertiary">Credit · {creditShort(c.line)}</div>
                  </div>
                  <div className="ml-2 shrink-0 text-[13px] font-bold tabular-nums text-brand">{formatUsd(c.amount)}</div>
                </div>
              ))}

              <div className="flex items-center gap-1.5 px-0.5">
                <div className="h-px grow bg-[#F3F4F6]" />
                <span className="shrink-0 text-[10.5px] font-medium text-text-tertiary">6 credits pending · 1 skipped</span>
                <div className="h-px grow bg-[#F3F4F6]" />
              </div>

              <div className="rounded-lg border-[1.5px] border-dashed border-[#D1D5DB] px-3 py-2.5">
                <p className="text-center text-xs text-text-tertiary">Resolve credits on the left to add them here</p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 border-t border-[#E5E7EB] px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Payment</span>
                <span className="text-[13px] font-semibold tabular-nums text-text-primary">{formatUsd(paymentAmt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Credits confirmed</span>
                <span className="text-[13px] font-semibold tabular-nums text-text-primary">{formatUsd(hcSum)}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="min-w-0 shrink text-xs text-text-secondary">Potential additional credits</span>
                <span className="shrink-0 text-[13px] font-semibold tabular-nums text-text-primary">
                  {formatUsd(POTENTIAL_ADDITIONAL)}
                </span>
              </div>
              <div className="mt-0.5 flex items-end justify-between border-t border-[#F3F4F6] pt-2">
                <div>
                  <div className="text-sm font-semibold text-text-primary">Pool Total</div>
                  <div className="mt-px text-[10.5px] text-text-tertiary">grows as credits confirmed</div>
                </div>
                <span className="text-[15px] font-bold tabular-nums text-brand">{formatUsd(poolTotal)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/allocation/apply"
              className="flex w-full flex-col items-center justify-center rounded-[4px] bg-brand py-3.5 text-sm font-medium text-white hover:bg-brand/90"
            >
              Continue with {MANUAL_HIGH_CONFIDENCE_COUNT} credits →
            </Link>
            <Link
              href="/allocation/import/parsed"
              className="flex w-full flex-col items-center justify-center rounded-sm border border-brand bg-white px-3.5 py-3.5 text-[13px] font-medium text-brand hover:bg-brand-subtle"
            >
              ← Back to Remittance
            </Link>
            <Link
              href="/allocation/funding"
              className="text-center text-[13px] font-medium text-text-secondary underline-offset-2 hover:text-brand hover:underline"
            >
              Return to standard funding
            </Link>
            <p className="text-[11.5px] leading-relaxed text-text-tertiary">
              6 unresolved credits will be flagged for ops follow-up after submission. These credits won&apos;t be
              included in this allocation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
