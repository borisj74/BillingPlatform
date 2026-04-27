"use client";

import Link from "next/link";
import {
  AllocationBreadcrumbs,
  allocationApplyPaperCrumbs,
} from "@/components/allocations/AllocationBreadcrumbs";
import { AllocationStepper } from "@/components/allocations/AllocationStepper";
import { IconInfo } from "@/components/layout/paper-sidebar/NavGlyphIcons";
import { useAllocation } from "@/lib/allocation-store";
import { NavArrowLeft, NavArrowRight } from "@/components/ui/NavArrowIcons";

export function OverpaymentClient() {
  const { state } = useAllocation();
  const accountCount: number = 3;

  return (
    <div className="w-full text-xs/4 antialiased">
      <AllocationBreadcrumbs items={allocationApplyPaperCrumbs(state.customer)} variant="applyFp" />
      <AllocationStepper className="mb-5" current={3} hideActiveSuffix />

      <div className="flex w-full min-w-0 flex-col gap-4 pb-5 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-[14px]">
          <div className="flex w-full items-start gap-2.5 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-px shrink-0">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="#D97706" />
              <line x1="12" y1="9" x2="12" y2="13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="17" r="1" fill="#FFFFFF" />
            </svg>
            <span className="min-w-0 text-[12px] font-semibold leading-4 text-[#92400E]">
              Pool exceeds invoices by $500 · Remaining balance will stay as unallocated credit on account. Decide how to
              handle before continuing to review.
            </span>
          </div>

          <div className="flex min-w-0 w-full flex-col rounded-lg border border-[#E5E7EB] bg-white">
          <div className="flex h-[72px] shrink-0 items-center justify-between gap-3 border-b border-[#E5E7EB] px-5 py-[14px]">
            <span className="inline-block min-w-0 shrink text-[14px] font-semibold leading-[18px] text-[#111827]">
              Invoices to Allocate · {state.customer} · {accountCount}{" "}
              {accountCount === 1 ? "account" : "accounts"}
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-block text-[13px] leading-4 text-[#6B7280]">Applied: $12,000.00 of $12,000.00</span>
              <div className="flex shrink-0 flex-col items-start justify-center rounded-md border border-[#59F6A5] bg-[#DCFCE7] px-[10px] py-1">
                <span className="inline-block text-[12px] font-semibold leading-4 text-[#16A34A]">Fully covered</span>
              </div>
              <div className="flex items-center gap-[6px] rounded-md border border-[#C7D2FE] bg-[#EEF2FF] px-3 py-[5px]">
                <span className="inline-block text-[12px] font-medium leading-4 text-[#4F46E5]">Auto-fill</span>
              </div>
            </div>
          </div>

          {/* Paper K4A-0 — min widths preserve layout; Applied column grows so table matches warning column width. */}
          <div className="flex min-w-0 w-full overflow-x-auto">
            <div className="flex w-full min-w-[762px]">
              <div className="flex w-[151px] shrink-0 flex-col">
                <div className="flex min-h-0 items-center gap-3 border-b border-[#E5E7EB] bg-[#F9FAFB] px-5 py-2.5">
                  <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.05em] text-[#9CA3AF]">
                    Invoice
                  </span>
                </div>
                <div className="flex min-h-14 items-center gap-3 border-b border-[#F3F4F6] px-5">
                  <div>
                    <div className="text-[13px] font-semibold leading-4 text-[#111827]">INV-10402</div>
                    <div className="mt-0.5 text-[11.5px] leading-[14px] text-[#9CA3AF]">Mar 15</div>
                  </div>
                </div>
                <div className="flex min-h-14 items-center gap-3 border-b border-[#F3F4F6] px-5">
                  <div>
                    <div className="text-[13px] font-semibold leading-4 text-[#111827]">INV-10418</div>
                    <div className="mt-0.5 text-[11.5px] leading-[14px] text-[#9DA3AF]">Mar 12</div>
                  </div>
                </div>
                <div className="flex min-h-14 items-center gap-3 border-b border-[#F3F4F6] bg-white px-5">
                  <div>
                    <div className="text-[13px] font-semibold leading-4 text-[#111827]">INV-10440</div>
                    <div className="mt-0.5 text-[11.5px] leading-[14px] text-[#9CA3AF]">Mar 20</div>
                  </div>
                </div>
              </div>

              <div className="flex w-[117px] shrink-0 flex-col">
                <div className="flex min-h-0 items-center gap-3 border-b border-[#E5E7EB] bg-[#F9FAFB] px-2 py-2.5">
                  <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.05em] text-[#9CA3AF]">
                    Account
                  </span>
                </div>
                <div className="flex min-h-14 items-center gap-3 border-b border-[#F3F4F6] px-2">
                  <span className="text-[12.5px] leading-4 text-[#374151]">Operating 40021</span>
                </div>
                <div className="flex min-h-14 items-center gap-3 border-b border-[#F3F4F6] px-2">
                  <span className="shrink-0 text-[12.5px] leading-4 text-[#374151]">AP · 40007</span>
                </div>
                <div className="flex min-h-14 items-center gap-3 border-b border-[#F3F4F6] bg-white px-2">
                  <span className="text-[12.5px] leading-4 text-[#374151]">Utilities 40019</span>
                </div>
              </div>

              <div className="flex w-[75px] shrink-0 flex-col">
                <div className="flex min-h-0 items-center gap-3 border-b border-[#E5E7EB] bg-[#F9FAFB] px-2 py-2.5">
                  <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.05em] text-[#9CA3AF]">Due</span>
                </div>
                <div className="flex min-h-14 items-center gap-3 border-b border-[#F3F4F6] px-2">
                  <span className="flex-1 text-[12.5px] leading-4 text-[#374151]">Mar 15</span>
                </div>
                <div className="flex min-h-14 items-center gap-3 border-b border-[#F3F4F6] px-2">
                  <span className="shrink-0 text-[12.5px] font-semibold leading-4 text-[#DC2626]">Mar 12</span>
                </div>
                <div className="flex min-h-14 items-center gap-3 border-b border-[#F3F4F6] bg-white px-2">
                  <span className="shrink-0 text-[12.5px] leading-4 text-[#374151]">Mar 20</span>
                </div>
              </div>

              <div className="flex w-[129px] shrink-0 flex-col">
                <div className="flex min-h-0 items-center gap-3 border-b border-[#E5E7EB] bg-[#F9FAFB] px-2 py-2.5">
                  <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.05em] text-[#9CA3AF]">
                    Inv. Amount
                  </span>
                </div>
                <div className="flex min-h-14 items-center gap-3 border-b border-[#F3F4F6] px-2">
                  <span className="shrink-0 text-[13px] font-semibold leading-4 text-[#111827]">$12,400.00</span>
                </div>
                <div className="flex min-h-14 items-center gap-3 border-b border-[#F3F4F6] px-2">
                  <span className="shrink-0 text-[13px] font-semibold leading-4 text-[#111827]">$3,200.00</span>
                </div>
                <div className="flex min-h-14 items-center gap-3 border-b border-[#F3F4F6] bg-white px-2">
                  <span className="shrink-0 text-[13px] font-semibold leading-4 text-[#111827]">$4,300.00</span>
                </div>
              </div>

              <div className="flex w-[130px] shrink-0 flex-col">
                <div className="flex min-h-0 items-center gap-3 border-b border-[#E5E7EB] bg-[#F9FAFB] px-5 py-2.5">
                  <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.05em] text-[#9CA3AF]">
                    Source
                  </span>
                </div>
                <div className="flex min-h-14 items-center gap-2 border-b border-[#F3F4F6] px-2">
                  <div className="flex items-center gap-[5px]">
                    <span className="inline-block rounded-[3px] bg-[#DBEAFE] px-1.25 py-0.5 text-[10.5px] font-bold leading-[14px] text-[#1D4ED8]">
                      PYMT
                    </span>
                    <span className="inline-block text-xs leading-4 text-[#374151]">Wire</span>
                  </div>
                </div>
                <div className="flex min-h-14 flex-nowrap items-center gap-2 border-b border-[#F3F4F6] px-2">
                  <span className="inline-block shrink-0 rounded-[3px] bg-[#F3E8FF] px-1.25 py-0.5 text-[10.5px] font-bold leading-[14px] text-[#7C3AED]">
                    CR-4819
                  </span>
                  <span className="inline-block shrink-0 rounded-[3px] bg-[#DBEAFE] px-1.25 py-0.5 text-[10.5px] font-bold leading-[14px] text-[#1D4ED8]">
                    PYMT
                  </span>
                </div>
                <div className="flex min-h-14 flex-nowrap items-center gap-2 border-b border-[#F3F4F6] bg-white px-2">
                  <span className="inline-block shrink-0 rounded-[3px] bg-[#F3E8FF] px-1.25 py-0.5 text-[10.5px] font-bold leading-[14px] text-[#7C3AED]">
                    CR-9022
                  </span>
                  <span className="inline-block shrink-0 rounded-[3px] bg-[#DBEAFE] px-1.25 py-0.5 text-[10.5px] font-bold leading-[14px] text-[#1D4ED8]">
                    PYMT
                  </span>
                </div>
              </div>

              {/* Applied column absorbs extra width when the table stretches with the alert column */}
              <div className="flex min-w-[160px] flex-1 flex-col items-stretch">
                <div className="flex w-full items-center border-b border-[#E5E7EB] bg-[#F9FAFB] px-5 py-2.5">
                  <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.05em] text-[#9CA3AF]">
                    Applied
                  </span>
                </div>
                <div className="flex min-h-14 w-full items-center justify-end border-b border-[#F3F4F6] pl-2 pr-5">
                  <div className="flex w-[108px] shrink-0 items-center justify-end rounded-md border border-[#4F46E5] bg-white p-1.5">
                    <span className="text-xs font-medium leading-4 text-[#111827]">$4,500.00</span>
                  </div>
                </div>
                <div className="flex min-h-14 w-full items-center justify-end border-b border-[#F3F4F6] pl-2 pr-5">
                  <div className="flex w-[109px] shrink-0 items-center justify-end rounded-md border border-[#4F46E5] bg-white p-1.5">
                    <span className="text-xs font-medium leading-4 text-[#111827]">$8,750.00</span>
                  </div>
                </div>
                <div className="flex min-h-14 w-full items-center justify-end border-b border-[#F3F4F6] pl-2 pr-5">
                  <div className="flex w-[106px] shrink-0 items-center justify-end rounded-md border border-[#4F46E5] bg-white p-1.5">
                    <span className="text-xs font-medium leading-4 text-[#111827]">$15,200.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="inline-block text-[12.5px] leading-4 text-[#D97706]">
                $500 pool remainder — handle in the sidebar before continuing
              </span>
            </div>
          </div>
        </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[383px] lg:min-w-[286px]">
          <div className="rounded-lg border border-[#E5E7EB] bg-white px-[18px] py-[18px]">
            <div className="mb-[14px] flex items-center justify-between">
              <span className="text-[13px] font-semibold leading-4 text-[#111827]">Funding Pool Status</span>
            </div>
            <div className="mb-1 flex justify-between">
              <span className="inline-block text-[12.5px] leading-4 text-[#6B7280]">Pool Total</span>
              <span className="inline-block text-[12.5px] font-medium leading-4 text-[#111827]">$12,500.00</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="inline-block text-[12.5px] leading-4 text-[#6B7280]">Applied</span>
              <span className="inline-block text-[12.5px] font-semibold leading-4 text-[#4F46E5]">$12,000.00</span>
            </div>
            <div className="mb-1 h-[6px] overflow-clip rounded-[3px] bg-[#EEF2FF]">
              <div className="h-full w-[96%] rounded-[3px] bg-[#4F46E5]" />
            </div>
            <div className="mb-[14px] flex justify-between">
              <span className="inline-block text-[12px] leading-4 text-[#9CA3AF]">Remaining</span>
              <span className="inline-block text-[12px] font-semibold leading-4 text-[#D97706]">$500 excess</span>
            </div>
            <div className="mb-[14px] h-px bg-[#F3F4F6]" />
            <div className="mb-[10px] text-[10px] font-semibold uppercase leading-3 tracking-[0.08em] text-[#9CA3AF]">Sources Used</div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[12.5px] font-medium leading-4 text-[#111827]">Wire Transfer</div>
                  <div className="text-[11px] leading-[14px] text-[#9CA3AF]">$11,200 of $12,500</div>
                </div>
                <span className="inline-block text-[12px] font-semibold leading-4 text-[#4F46E5]">90%</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[12.5px] font-medium leading-4 text-[#111827]">CR-8891</div>
                  <div className="text-[11px] leading-[14px] text-[#9CA3AF]">$800 used · full</div>
                </div>
                <span className="inline-block text-[12px] font-semibold leading-4 text-[#16A34A]">100%</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[12.5px] font-medium leading-4 text-[#111827]">CR-9022</div>
                  <div className="text-[11px] leading-[14px] text-[#9CA3AF]">$500 used · full</div>
                </div>
                <span className="inline-block text-[12px] font-semibold leading-4 text-[#16A34A]">100%</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#FDE68A] bg-white px-[18px] py-[18px]">
            <div className="mb-1 text-[13px] font-semibold leading-4 text-[#111827]">Handle remainder</div>
            <div className="mb-3 text-[12px] leading-4 text-[#D97706]">$500 unallocated · must resolve to continue</div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="flex w-full items-center gap-2.5 rounded-md border border-[#C7D2FE] bg-[#EEF2FF] px-[14px] py-[9px] text-left text-[12.5px] font-medium leading-4 text-[#4F46E5] hover:bg-[#E0E7FF]"
              >
                <span className="inline-flex shrink-0 text-[#4F46E5]" aria-hidden>
                  <NavArrowLeft />
                </span>
                <span className="min-w-0 flex-1">Return $500 to credit pool</span>
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2.5 rounded-md border border-[#C7D2FE] bg-[#EEF2FF] px-[14px] py-[9px] text-left text-[12.5px] font-medium leading-4 text-[#4F46E5] hover:bg-[#E0E7FF]"
              >
                <span className="min-w-0 flex-1">Apply to another invoice</span>
                <span className="inline-flex shrink-0 text-[#4F46E5]" aria-hidden>
                  <NavArrowRight />
                </span>
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2.5 rounded-md border border-[#E5E7EB] bg-white px-[14px] py-[9px] text-left text-[12.5px] font-medium leading-4 text-[#6B7280] hover:bg-[#F9FAFB]"
              >
                <span className="inline-flex shrink-0 text-[#6B7280]" aria-hidden>
                  <IconInfo />
                </span>
                <span className="min-w-0 flex-1">Flag as overpayment</span>
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] bg-white px-[18px] py-[18px]">
            <div className="mb-[10px] text-[10px] font-semibold uppercase leading-3 tracking-[0.08em] text-[#9CA3AF]">Invoice Status</div>
            <div className="flex flex-col gap-[6px]">
              <div className="flex justify-between">
                <div className="flex items-center gap-[6px]">
                  <span className="inline-block size-2 shrink-0 rounded-full bg-[#22C55E]" />
                  <span className="inline-block text-[13px] leading-4 text-[#374151]">Fully applied</span>
                </div>
                <span className="inline-block text-[13px] font-semibold leading-4 text-[#111827]">3 of 3</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-[6px]">
                  <span className="inline-block size-2 shrink-0 rounded-full bg-[#F59E0B]" />
                  <span className="inline-block text-[13px] leading-4 text-[#374151]">Partial</span>
                </div>
                <span className="inline-block text-[13px] font-semibold leading-4 text-[#111827]">0</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-[6px]">
                  <span className="inline-block size-2 shrink-0 rounded-full bg-[#E5E7EB]" />
                  <span className="inline-block text-[13px] leading-4 text-[#374151]">Not applied</span>
                </div>
                <span className="inline-block text-[13px] font-semibold leading-4 text-[#111827]">0</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/allocation/funding"
              className="flex items-center justify-center gap-2 rounded-[4px] border border-[#4F46E5] bg-white px-[13px] py-[13px] text-[13px] font-medium leading-4 text-[#4F46E5] hover:bg-[#EEF2FF]"
            >
              <NavArrowLeft />
              <span>Back to Funding Pool</span>
            </Link>
            <button
              disabled
              type="button"
              className="flex cursor-not-allowed items-center justify-center gap-2 rounded-[4px] bg-[#D1D5DB] px-[13px] py-[13px] text-[14px] font-medium leading-[18px] text-[#9DA3AF]"
            >
              <span>Review & Confirm</span>
              <NavArrowRight variant="muted" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
