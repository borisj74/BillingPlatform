"use client";

import Link from "next/link";
import { IconInfo } from "@/components/layout/paper-sidebar/NavGlyphIcons";
import { NavArrowLeft, NavArrowRight } from "@/components/ui/NavArrowIcons";
import {
  AllocationBreadcrumbs,
  allocationReviewConfirmCrumbs,
} from "@/components/allocations/AllocationBreadcrumbs";
import { AllocationStepper } from "@/components/allocations/AllocationStepper";

export function VarianceBlockedClient() {
  return (
    <div className="flex flex-col gap-3.5">
      <AllocationBreadcrumbs items={allocationReviewConfirmCrumbs("Acme Corp")} />

      <AllocationStepper current={4} />

      {/* Error banner */}
      <div className="flex items-start gap-2.5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#DB2627"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-px shrink-0"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
        <p className="text-[12px] font-semibold leading-4 text-[#DC2626]">
          Commit blocked · Remittance total ($12,200) does not match funding pool ($12,000). Resolve
          the $200 variance before posting.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-2.5">
        <div className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-4">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">
            Customer
          </div>
          <div className="text-[15px] font-semibold leading-[18px] text-[#111827]">Acme Corp</div>
          <div className="mt-0.5 text-[11px] leading-[14px] text-[#9CA3AF]">
            28 accounts · Wire · Mar 1
          </div>
        </div>
        <div className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-4">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">
            Total Applied
          </div>
          <div className="text-[15px] font-semibold leading-[18px] text-[#4F46E5]">$48,000.00</div>
          <div className="mt-0.5 text-[11px] leading-[14px] text-[#9CA3AF]">
            5 invoices fully settled
          </div>
        </div>
        <div className="rounded-lg border border-[#FECACA] bg-white px-4 py-4">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">
            Funding Pool
          </div>
          <div className="text-[15px] font-semibold leading-[18px] text-[#DC2626]">$59,950.00</div>
          <div className="mt-0.5 text-[11px] leading-[14px] text-[#DC2626]">
            ↑ $200 variance detected
          </div>
        </div>
        <div className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-4">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">
            Credits Used
          </div>
          <div className="text-[15px] font-semibold leading-[18px] text-[#111827]">2 of 5</div>
          <div className="mt-0.5 text-[11px] leading-[14px] text-[#9CA3AF]">CR-4821 + CR-4819</div>
        </div>
      </div>

      <div className="flex items-start gap-4">
        {/* Left column */}
        <div className="flex flex-1 flex-col gap-3.5">
          {/* Validation Checks */}
          <div className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-5">
            <h2 className="mb-3.5 text-[14px] font-semibold leading-[18px] text-[#111827]">
              Validation Checks
            </h2>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-start gap-2.5">
                <div className="mt-px flex size-[18px] shrink-0 items-center justify-center rounded-full bg-[#FEE2E2]">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="3.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <p className="text-[13px] font-medium leading-4 text-[#DC2626]">
                  Remittance total ($12,200) does not match funding pool ($12,000) — $200 gap remains
                </p>
              </div>
              {[
                "Credits CR-4821 and CR-4819 are valid and unallocated",
                "Wire transfer WR-20260301-4821 confirmed received",
                "No duplicate allocations detected",
                "All 5 invoices are fully covered by the funding pool",
              ].map((msg) => (
                <div key={msg} className="flex items-center gap-2.5">
                  <div className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-[#DCFCE7]">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="3.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-[13px] leading-4 text-[#374151]">{msg}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Allocation Breakdown */}
          <div className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-5">
            <h2 className="mb-3.5 text-[14px] font-semibold leading-[18px] text-[#111827]">
              Allocation Breakdown
            </h2>
            <div className="mb-1 flex border-b border-[#F3F4F6] pb-2">
              <div className="grow-[2] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Invoice</div>
              <div className="grow-[1.5] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Account</div>
              <div className="grow-[1.5] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Source</div>
              <div className="grow text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Applied</div>
            </div>
            {[
              { inv: "INV-2026-0142", account: "Main Account", badges: [{ label: "PYMT", bg: "#DBEAFE", text: "#1D4ED8" }], amount: "$12,400.00" },
              { inv: "INV-2026-0137", account: "West Region", badges: [{ label: "CR-4819", bg: "#EDE9FE", text: "#6D28D9" }, { label: "PYMT", bg: "#DBEAFE", text: "#1D4ED8" }], amount: "$8,750.00" },
              { inv: "INV-2026-0129", account: "East Region", badges: [{ label: "CR-4821", bg: "#CCFBF1", text: "#0F766E" }, { label: "PYMT", bg: "#DBEAFE", text: "#1D4ED8" }], amount: "$15,200.00" },
              { inv: "INV-2026-0118", account: "South Branch", badges: [{ label: "PYMT", bg: "#DBEAFE", text: "#1D4ED8" }], amount: "$6,900.00" },
              { inv: "INV-2026-0105", account: "HQ Operations", badges: [{ label: "PYMT", bg: "#DBEAFE", text: "#1D4ED8" }], amount: "$4,750.00" },
            ].map((row, i, arr) => (
              <div
                key={row.inv}
                className={`flex items-center py-2 ${i < arr.length - 1 ? "border-b border-[#F9FAFB]" : ""}`}
              >
                <div className="grow-[2] text-[13px] font-medium leading-4 text-[#111827]">{row.inv}</div>
                <div className="grow-[1.5] text-[13px] leading-4 text-[#6B7280]">{row.account}</div>
                <div className="flex grow-[1.5] gap-1">
                  {row.badges.map((b) => (
                    <span
                      key={b.label}
                      className="inline-block rounded px-[7px] py-0.5 text-[11px] font-semibold leading-[14px]"
                      style={{ backgroundColor: b.bg, color: b.text }}
                    >
                      {b.label}
                    </span>
                  ))}
                </div>
                <div className="grow text-right text-[13px] leading-4 text-[#111827]">{row.amount}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex w-[383px] shrink-0 flex-col gap-3">
          {/* Where is the variance */}
          <div className="rounded-lg border border-[#E5E7EB] bg-white px-[18px] py-[18px]">
            <h3 className="mb-2 text-[13px] font-semibold leading-4 text-[#111827]">
              Where is the variance?
            </h3>
            <p className="mb-3 text-[12.5px] leading-[1.5] text-[#6B7280]">
              The $200 gap is between the remittance declared total and the funding pool. The apply
              step is balanced.
            </p>
            <div className="flex flex-col gap-1.5">
              <div className="rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2">
                <p className="text-[12px] font-medium leading-4 text-[#DC2626]">
                  Pool is $200 short of remittance declared
                </p>
              </div>
              <div className="rounded-md border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-2">
                <p className="text-[12px] font-medium leading-4 text-[#16A34A]">
                  Apply step is balanced — no issue there
                </p>
              </div>
            </div>
          </div>

          {/* Resolve options */}
          <div className="rounded-lg border border-[#E5E7EB] bg-white px-[18px] py-[18px]">
            <h3 className="mb-2.5 text-[13px] font-semibold leading-4 text-[#111827]">
              Resolve options
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/allocation/funding"
                className="flex w-full items-center gap-2.5 rounded-md border border-[#C7D2FE] bg-[#EEF2FF] px-3.5 py-2.5 text-[12.5px] font-medium leading-4 text-[#4F46E5] hover:bg-[#E0E7FF]"
              >
                <span className="inline-flex shrink-0" aria-hidden>
                  <NavArrowLeft />
                </span>
                <span className="min-w-0 flex-1 text-left">Go back to Pool and add $200</span>
              </Link>
              <button
                type="button"
                className="flex w-full items-center gap-2.5 rounded-md border border-[#C7D2FE] bg-[#EEF2FF] px-3.5 py-2.5 text-left text-[12.5px] font-medium leading-4 text-[#4F46E5] hover:bg-[#E0E7FF]"
              >
                <span className="min-w-0 flex-1">Adjust remittance declared total</span>
                <span className="inline-flex shrink-0" aria-hidden>
                  <NavArrowRight />
                </span>
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2.5 rounded-md border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-left text-[12.5px] font-medium leading-4 text-[#6B7280] hover:bg-[#F9FAFB]"
              >
                <span className="inline-flex shrink-0 text-[#6B7280]" aria-hidden>
                  <IconInfo />
                </span>
                <span className="min-w-0 flex-1">Flag for supervisor review</span>
              </button>
            </div>
          </div>

          {/* Internal note */}
          <div className="rounded-lg border border-[#E5E7EB] bg-white px-[18px] py-[18px]">
            <h3 className="mb-2 text-[13px] font-semibold leading-4 text-[#111827]">
              Internal Note (optional)
            </h3>
            <textarea
              placeholder="Add a note about this allocation..."
              className="min-h-[52px] w-full resize-none rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5 text-[12.5px] leading-4 text-[#111827] placeholder:text-[#D1D5DB] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            />
          </div>

          {/* Commit blocked */}
          <div className="flex flex-col gap-1.5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-4">
            <div className="mb-1.5 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
              <span className="text-[13px] font-semibold leading-4 text-[#DC2626]">
                Commit blocked
              </span>
            </div>
            <p className="mb-3.5 text-[12px] leading-4 text-[#DC2626]">
              Resolve the variance above to unlock submission.
            </p>
            <Link
              href="/allocation/apply"
              className="flex w-full items-center justify-center gap-2 rounded-sm border border-[#4F46E5] bg-white px-3 py-3 text-[13px] font-medium leading-4 text-[#4F46E5] hover:bg-brand-subtle"
            >
              <NavArrowLeft />
              <span>Edit Allocations</span>
            </Link>
            <button
              disabled
              type="button"
              className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-sm bg-[#D1D5DB] px-3 py-3 text-[14px] font-medium leading-[18px] text-[#9DA3AF]"
            >
              <span>Confirm</span>
              <NavArrowRight variant="muted" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
