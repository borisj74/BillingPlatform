"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AllocationBreadcrumbs,
  allocationFundingPaperCrumbs,
} from "@/components/allocations/AllocationBreadcrumbs";
import { AllocationStepper } from "@/components/allocations/AllocationStepper";
import {
  MANUAL_HIGH_CONFIDENCE_COUNT,
  MANUAL_POTENTIAL_ADDITIONAL,
  MANUAL_POOL_TOTAL,
  MANUAL_REVIEW_TOTAL,
  MANUAL_SCENARIO_CUSTOMER,
  MANUAL_SIDEBAR_CREDITS_CONFIRMED,
  manualHighConfidenceCredits,
  manualScenarioCheckPayment,
} from "@/lib/manual-funding-mock";
import { useAllocation } from "@/lib/allocation-store";
import { formatUsd } from "@/lib/format";
import { Checkbox } from "@/components/ui/checkbox";
import { ScopedAccountSearch } from "@/components/allocations/ScopedAccountSearch";
import { NavArrowLeft, NavArrowRight } from "@/components/ui/NavArrowIcons";

const checkboxPoolClass =
  "mt-0.75 size-[18px] shrink-0 rounded-sm border-[#D1D5DB] data-checked:border-[#16A34A] data-checked:bg-[#16A34A] data-checked:text-white";

/** Paper 2UT-0 — purple confidence pill in high-confidence table. */
function ManualConfidencePill({ value }: { value: number }) {
  return (
    <div className="mr-4 flex items-center gap-1 rounded-full bg-[#EEF2FF] px-2 py-0.75">
      <span className="size-1.5 shrink-0 rounded-full bg-[#4F46E5]" />
      <span className="text-[11px] font-semibold leading-[0.875rem] text-[#4F46E5]">{value}%</span>
    </div>
  );
}

function creditShort(line: string): string {
  const parts = line.split(" · ");
  return parts.length >= 2 ? parts[1] : line;
}

/** Sidebar lists CR-8042, CR-8039, CR-8036, CR-8031 (Paper order). */
const SIDEBAR_CREDIT_ORDER = ["hc1", "hc2", "hc3", "hc4"] as const;

export function ManualFundingPool() {
  const { state } = useAllocation();
  const hcById = useMemo(() => Object.fromEntries(manualHighConfidenceCredits.map((c) => [c.id, c])), []);

  const hcConfidenceMinMax = useMemo(() => {
    const vals = manualHighConfidenceCredits.map((c) => c.confidenceDisplay);
    return { min: Math.min(...vals), max: Math.max(...vals) };
  }, []);

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
    <div className="w-full text-xs/4 antialiased">
      <AllocationBreadcrumbs
        className="mb-3.5"
        items={allocationFundingPaperCrumbs(MANUAL_SCENARIO_CUSTOMER)}
        slaBadge="1d past SLA"
      />
      <AllocationStepper current={2} tone="manualFallback" />

      {/* Paper 2UT-0 — AI summary strip */}
      <div className="mb-4 flex flex-wrap items-start gap-3 rounded-[10px] border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F59E0B]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <circle cx="11" cy="11" r="8" stroke="#FFFFFF" strokeWidth="2.2" />
            <path d="m21 21-4.35-4.35" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M11 8v3l1.5 1.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold leading-[1.125rem] text-[#92400E]">
            AI found 4 of 11 credits with high confidence · 7 require manual review
          </p>
          <p className="mt-0.75 text-[12.5px] leading-relaxed text-[#B45309]">
            All 40 {MANUAL_SCENARIO_CUSTOMER} accounts were scanned. Credits below the 70% confidence threshold
            couldn&apos;t be matched automatically. Use the search tools below — each is scoped to Global
            Retail&apos;s 40 accounts only.
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
          {/* High confidence — Paper column layout */}
          <div className="overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white">
            <div className="flex flex-wrap items-center gap-2 border-b border-[#F3F4F6] px-4 py-3.5">
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
              <span className="text-sm font-semibold text-[#111827]">High Confidence — Ready to Add</span>
              <div className="rounded-[20px] bg-[#F0FDF4] px-2.25 py-0.5">
                <span className="text-[11.5px] font-semibold text-[#16A34A]">
                  {MANUAL_HIGH_CONFIDENCE_COUNT} credits · AI {hcConfidenceMinMax.min}–{hcConfidenceMinMax.max}%
                </span>
              </div>
              <span className="ml-auto text-xs font-semibold text-[#16A34A]">✓ All added to pool</span>
            </div>
            {manualHighConfidenceCredits.map((c) => (
              <div key={c.id} className="flex border-b border-[#E5E7EB] last:border-b-0">
                <div className="flex min-w-0 flex-1 items-center gap-1 bg-[#F0FDF4] py-3 pl-5 pr-2">
                  <div className="mr-3 flex size-[18px] shrink-0 items-center justify-center rounded-sm bg-[#22C55E]">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <polyline
                        points="20 6 9 17 4 12"
                        stroke="#FFFFFF"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#374151]">{c.number}</div>
                    <div className="text-xs leading-4 text-[#6B7280]">{c.line}</div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center bg-[#F0FDF4] px-2 py-3">
                  <ManualConfidencePill value={c.confidenceDisplay} />
                </div>
                <div className="flex w-[173px] shrink-0 flex-col justify-center bg-[#F0FDF4] py-3 pr-5 text-right">
                  <span className="text-[13.5px] font-semibold tabular-nums text-[#16A34A]">{formatUsd(c.amount)}</span>
                </div>
                <div className="flex w-[120px] shrink-0 flex-col justify-center bg-[#F0FDF4] py-3 pr-5">
                  <span className="text-xs font-semibold text-[#16A34A]">Added</span>
                </div>
              </div>
            ))}
          </div>

          {/* Needs manual review */}
          <div className="overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white">
            <div className="flex flex-wrap items-center gap-2 border-b border-[#F3F4F6] px-4 py-3.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <circle cx="12" cy="12" r="10" stroke="#D97706" strokeWidth="2" />
                <line x1="12" y1="8" x2="12" y2="12" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1" fill="#D97706" />
              </svg>
              <span className="text-sm font-semibold text-[#111827]">Needs Manual Review</span>
              <div className="rounded-[20px] bg-[#FEF3C7] px-2.25 py-0.5">
                <span className="text-[11.5px] font-semibold text-[#D97706]">7 credits unresolved</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs font-medium text-[#111827]">{actionedLabel}</span>
                <div className="h-1.25 w-14 overflow-hidden rounded-[3px] bg-[#E5E7EB]">
                  <div className="h-full rounded-[3px] bg-[#4F46E5]" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 border-b border-[#F3F4F6] bg-[#F9FAFB] px-4 py-2.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#9CA3AF]" aria-hidden>
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="text-xs text-[#6B7280]">
                All searches below are scoped to {MANUAL_SCENARIO_CUSTOMER}&apos;s 40 accounts — not the full account
                directory.
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
                    <span className="text-[13.5px] font-semibold text-[#111827]">CR-8028</span>
                    <span className="rounded-sm bg-[#F3F4F6] px-1.75 py-0.5 text-[11px] font-bold text-[#6B7280]">
                      Not located
                    </span>
                    <span className="ml-auto text-xs tabular-nums text-[#374151]">{formatUsd(3900)}</span>
                  </div>
                  <p className="mb-2 text-xs text-[#6B7280]">Expected in: Pacific Northwest Division · From remittance</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <ScopedAccountSearch customerName="Global Retail" className="min-w-0 flex-1" />
                    <button
                      type="button"
                      className="shrink-0 rounded-md border border-[#9CA3AF] px-2.5 py-1.75 text-[13px] text-[#374151] hover:bg-[#F9FAFB]"
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
                    <span className="text-[13.5px] font-semibold text-[#111827]">CR-8025</span>
                    <span className="rounded-sm bg-[#FEF3C7] px-1.75 py-0.5 text-[11px] font-bold text-[#D97706]">
                      AI 52% · Low confidence
                    </span>
                    <span className="ml-auto text-xs tabular-nums text-[#374151]">{formatUsd(2800)}</span>
                  </div>
                  <p className="mb-2 text-xs text-[#6B7280]">
                    Expected in: Southeast Region · Found a possible match at a different account
                  </p>
                  <div className="rounded-[7px] border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2.5">
                    <p className="text-xs font-semibold text-[#92400E]">Possible match found</p>
                    <p className="mb-2 text-xs text-[#92400E]">CR-8025 · Gulf Coast Division · $2,800.00 · Issued Feb 11</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="rounded-[5px] bg-[#4F46E5] px-3 py-1.25 text-xs font-semibold text-white hover:bg-[#4338CA]"
                      >
                        Confirm this match
                      </button>
                      <button
                        type="button"
                        className="rounded-[5px] border border-[#E5E7EB] bg-white px-3 py-1.25 text-xs text-[#374151] hover:bg-[#F9FAFB]"
                      >
                        Search instead
                      </button>
                      <button type="button" className="ml-auto text-xs text-[#4F46E5] hover:underline">
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
                    <span className="text-[13.5px] font-semibold text-[#111827]">CR-8022</span>
                    <span className="rounded-sm bg-[#EEF2FF] px-1.75 py-0.5 text-[11px] font-bold text-[#4F46E5]">
                      2 possible matches
                    </span>
                    <span className="ml-auto text-xs tabular-nums text-[#374151]">{formatUsd(6500)}</span>
                  </div>
                  <p className="mb-2 text-xs text-[#6B7280]">
                    Expected in: Midwest Central · Same amount found in 2 accounts — confirm which one the customer
                    intended
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <div className="min-w-0 flex-1 rounded-[7px] border-[1.5px] border-[#D1D5DB] px-3 py-2.5">
                      <p className="text-[11.5px] font-semibold text-[#374151]">Option A</p>
                      <p className="text-[11.5px] text-[#6B7280]">CR-8022 · Midwest Central</p>
                      <p className="text-[11.5px] text-[#6B7280]">$6,500.00 · Issued Feb 9</p>
                    </div>
                    <div className="min-w-0 flex-1 rounded-[7px] border-[1.5px] border-[#D1D5DB] px-3 py-2.5">
                      <p className="text-[11.5px] font-semibold text-[#374151]">Option B</p>
                      <p className="text-[11.5px] text-[#6B7280]">CR-8022 · Northern Illinois</p>
                      <p className="text-[11.5px] text-[#6B7280]">$6,500.00 · Issued Feb 14</p>
                    </div>
                    <div className="flex items-end">
                      <button type="button" className="px-1 py-1.25 text-xs text-[#4F46E5] hover:underline">
                        Skip
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CR-8019 */}
            <div className="border-b border-[#F3F4F6] bg-[#FFF8F8] px-4 py-3">
              <div className="flex gap-3">
                <div className="mt-0.75 flex size-[18px] shrink-0 items-center justify-center rounded-sm border-[1.5px] border-[#FCA5A5] bg-[#FEE2E2]">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <line x1="18" y1="6" x2="6" y2="18" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="6" y1="6" x2="18" y2="18" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.75 flex flex-wrap items-center gap-2">
                    <span className="text-[13.5px] font-semibold text-[#991B1B]">CR-8019</span>
                    <span className="rounded-sm bg-[#FEE2E2] px-1.75 py-0.5 text-[11px] font-bold text-[#DC2626]">
                      Invalid ID
                    </span>
                    <span className="ml-auto text-xs tabular-nums text-[#374151]">{formatUsd(1800)}</span>
                  </div>
                  <p className="mb-2 text-xs text-[#6B7280]">
                    Expected in: Mountain West · Not found in any of the 40 accounts. This ID may be invalid or belong to
                    a different customer.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-[#E5E7EB] bg-white px-3 py-1.25 text-xs text-[#374151] hover:bg-[#F9FAFB]"
                    >
                      Search for similar
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-[#FECACA] bg-white px-3 py-1.25 text-xs text-[#DC2626] hover:bg-[#FEF2F2]"
                    >
                      Flag & Skip
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CR-8016 */}
            <div className="border-b border-[#F3F4F6] px-4 py-3">
              <div className="flex gap-3">
                <Checkbox
                  id="mr-cr8016"
                  checked={reviewActioned.has("cr8016")}
                  onCheckedChange={() => toggleReview("cr8016")}
                  className={checkboxPoolClass}
                  aria-label="Mark CR-8016 as actioned"
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-0.75 flex flex-wrap items-center gap-2">
                    <span className="text-[13.5px] font-semibold text-[#111827]">CR-8016</span>
                    <span className="rounded-sm bg-[#F3F4F6] px-1.75 py-0.5 text-[11px] font-bold text-[#6B7280]">
                      Not located
                    </span>
                    <span className="ml-auto text-xs tabular-nums text-[#374151]">{formatUsd(2400)}</span>
                  </div>
                  <p className="mb-2 text-xs text-[#6B7280]">Expected in: Great Plains Area · From remittance</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <ScopedAccountSearch customerName="Global Retail" className="min-w-0 flex-1" />
                    <button
                      type="button"
                      className="shrink-0 rounded-md border border-[#9CA3AF] px-2.5 py-1.75 text-[13px] text-[#374151] hover:bg-[#F9FAFB]"
                    >
                      Skip · Can&apos;t locate
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CR-8013 */}
            <div className="border-b border-[#F3F4F6] px-4 py-3">
              <div className="flex gap-3">
                <Checkbox
                  id="mr-cr8013"
                  checked={reviewActioned.has("cr8013")}
                  onCheckedChange={() => toggleReview("cr8013")}
                  className={checkboxPoolClass}
                  aria-label="Mark CR-8013 as actioned"
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-0.75 flex flex-wrap items-center gap-2">
                    <span className="text-[13.5px] font-semibold text-[#111827]">CR-8013</span>
                    <span className="rounded-sm bg-[#F3F4F6] px-1.75 py-0.5 text-[11px] font-bold text-[#6B7280]">
                      Not located
                    </span>
                    <span className="ml-auto text-xs tabular-nums text-[#374151]">{formatUsd(3700)}</span>
                  </div>
                  <p className="mb-2 text-xs text-[#6B7280]">Expected in: Northeast Corridor · From remittance</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <ScopedAccountSearch customerName="Global Retail" className="min-w-0 flex-1" />
                    <button
                      type="button"
                      className="shrink-0 rounded-md border border-[#9CA3AF] px-2.5 py-1.75 text-[13px] text-[#374151] hover:bg-[#F9FAFB]"
                    >
                      Skip · Can&apos;t locate
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CR-8010 skipped */}
            <div className="bg-[#F9FAFB] px-4 py-3">
              <div className="flex gap-3">
                <div className="mt-0.75 flex size-[18px] shrink-0 items-center justify-center rounded-sm border-[1.5px] border-[#D1D5DB] bg-[#F3F4F6]">
                  <svg width="8" height="2" viewBox="0 0 8 2" fill="none" aria-hidden>
                    <line x1="0" y1="1" x2="8" y2="1" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.75 flex flex-wrap items-center gap-2">
                    <span className="text-[13.5px] font-semibold text-[#9CA3AF] line-through decoration-1">CR-8010</span>
                    <span className="rounded-sm bg-[#F3F4F6] px-1.75 py-0.5 text-[11px] font-bold text-[#9CA3AF]">
                      Skipped · Flagged for follow-up
                    </span>
                    <span className="ml-auto text-xs tabular-nums text-[#D1D5DB]">{formatUsd(2100)}</span>
                  </div>
                  <p className="mb-1.25 text-xs text-[#9CA3AF]">
                    Expected in: Upper Midwest · Could not be located. Will be flagged for ops review after submission.
                  </p>
                  <button type="button" className="text-xs text-[#4F46E5] hover:underline">
                    Undo skip
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Paper 2UT-0 — sidebar */}
        <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[338px]">
          <div className="overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] px-4 py-3.5">
              <span className="text-sm font-semibold text-[#0F172A]">Funding pool</span>
              <span className="text-[11px] text-[#64748B]">4 of 11 confirmed</span>
            </div>
            <div className="flex flex-col gap-2 px-3.5 py-3">
              <div className="flex items-center rounded-lg border border-[#E5E7EB] px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-semibold text-[#111827]">{manualScenarioCheckPayment.primary}</div>
                  <div className="text-[11px] text-[#9CA3AF]">{manualScenarioCheckPayment.secondary}</div>
                </div>
                <span className="ml-2 shrink-0 text-[13px] font-bold tabular-nums text-[#4F46E5]">
                  {formatUsd(manualScenarioCheckPayment.amount)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-0.5">
                <div className="h-px grow bg-[#F3F4F6]" />
                <span className="shrink-0 text-[10.5px] font-medium text-[#9CA3AF]">
                  Confirmed credits ({MANUAL_HIGH_CONFIDENCE_COUNT})
                </span>
                <div className="h-px grow bg-[#F3F4F6]" />
              </div>
              {SIDEBAR_CREDIT_ORDER.map((id) => {
                const c = hcById[id];
                if (!c) return null;
                return (
                  <div key={id} className="flex items-center rounded-lg border border-[#E5E7EB] px-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="text-[12.5px] font-semibold text-[#111827]">{c.number}</div>
                      <div className="text-[11px] text-[#9CA3AF]">Credit · {creditShort(c.line)}</div>
                    </div>
                    <span className="ml-2 shrink-0 text-[13px] font-bold tabular-nums text-[#4F46E5]">
                      {formatUsd(c.amount)}
                    </span>
                  </div>
                );
              })}
              <div className="flex items-center gap-1.5 px-0.5">
                <div className="h-px grow bg-[#F3F4F6]" />
                <span className="shrink-0 text-center text-[10.5px] font-medium text-[#9CA3AF]">
                  6 credits pending · 1 skipped
                </span>
                <div className="h-px grow bg-[#F3F4F6]" />
              </div>
              <div className="rounded-lg border-[1.5px] border-dashed border-[#D1D5DB] px-3 py-2.5">
                <p className="text-center text-xs text-[#9CA3AF]">Resolve credits on the left to add them here</p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 border-t border-[#E5E7EB] px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6B7280]">Payment</span>
                <span className="text-[13px] font-semibold tabular-nums text-[#111827]">
                  {formatUsd(manualScenarioCheckPayment.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6B7280]">Credits confirmed</span>
                <span className="text-[13px] font-semibold tabular-nums text-[#111827]">
                  {formatUsd(MANUAL_SIDEBAR_CREDITS_CONFIRMED)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="min-w-0 text-xs text-[#6B7280]">Potential additional credits</span>
                <span className="text-[13px] font-semibold tabular-nums text-[#111827]">
                  {formatUsd(MANUAL_POTENTIAL_ADDITIONAL)}
                </span>
              </div>
              <div className="mt-0.5 flex items-end justify-between border-t border-[#F3F4F6] pt-2">
                <div>
                  <div className="text-sm font-semibold text-[#111827]">Pool Total</div>
                  <div className="mt-px text-[10.5px] text-[#9CA3AF]">grows as credits confirmed</div>
                </div>
                <span className="text-[15px] font-bold tabular-nums text-[#4F46E5]">{formatUsd(MANUAL_POOL_TOTAL)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/allocation/apply"
              className="flex w-full items-center justify-center gap-1 rounded-sm bg-[#4F46E5] py-[13px] text-sm font-medium text-white hover:bg-[#4338CA]"
            >
              <span>Continue with {MANUAL_HIGH_CONFIDENCE_COUNT} credits</span>
              <NavArrowRight variant="onPrimary" />
            </Link>
            <Link
              href={`/allocation/import/parsed?format=${state.remittanceFormat}&customer=${encodeURIComponent(MANUAL_SCENARIO_CUSTOMER)}`}
              className="flex w-full items-center justify-center gap-1 rounded-sm border border-[#4F46E5] bg-white px-[13px] py-[13px] text-[13px] font-medium text-[#4F46E5] hover:bg-[#EEF2FF]"
            >
              <NavArrowLeft />
              <span>Back to Remittance</span>
            </Link>
            <Link
              href="/allocation/funding"
              className="text-center text-[13px] font-medium text-[#9CA3AF] underline-offset-2 hover:text-[#4F46E5] hover:underline"
            >
              Return to standard funding
            </Link>
            <p className="text-[11.5px] leading-relaxed text-[#9CA3AF]">
              6 unresolved credits will be flagged for ops follow-up after submission. These credits won&apos;t be
              included in this allocation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
