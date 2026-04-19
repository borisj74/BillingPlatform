"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export function OverpaymentClient() {
  return (
    <div className="flex flex-col gap-[14px] overflow-clip px-4 pb-5 pt-5 antialiased">
      <div className="flex items-center gap-[5px]">
        <span className="inline-block text-[12px] leading-4 text-[#9CA3AF]">Payments</span>
        <span className="inline-block text-[12px] leading-4 text-[#9CA3AF]">/</span>
        <span className="inline-block text-[12px] leading-4 text-[#9CA3AF]">...</span>
        <span className="inline-block text-[12px] leading-4 text-[#9CA3AF]">/</span>
        <span className="inline-block text-[12px] leading-4 text-[#9CA3AF]">Funding Pool</span>
        <span className="inline-block text-[12px] leading-4 text-[#9CA3AF]">/</span>
        <span className="inline-block text-[12px] leading-4 text-[12px] font-medium leading-4 text-[#374151]">Invoices</span>
      </div>

      <div className="flex shrink-0 items-center justify-between rounded-[10px] border border-[#E5E7EB] bg-white px-6 py-4">
        <div className="flex items-center gap-[10px]">
          <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#4F46E5]">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase leading-3 tracking-[0.06em] text-[#9CA3AF]">Step 1</div>
            <div className="text-[12px] leading-4 text-[#9CA3AF] line-through decoration-1">Remittance Details</div>
          </div>
        </div>
        <div className="mx-4 h-[1.5px] flex-1 bg-[#4F46E5]" />
        <div className="flex items-center gap-[10px]">
          <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#4F46E5]">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase leading-3 tracking-[0.06em] text-[#9CA3AF]">Step 2</div>
            <div className="text-[12px] leading-4 text-[#9CA3AF] line-through decoration-1">Build Funding Pool</div>
          </div>
        </div>
        <div className="mx-4 h-[1.5px] flex-1 bg-[#4F46E5]" />
        <div className="flex items-center gap-[10px]">
          <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#4F46E5]">
            <span className="flex text-[12px] font-bold leading-4 text-white">3</span>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase leading-3 tracking-[0.06em] text-[#4F46E5]">Step 3</div>
            <div className="text-[13px] font-semibold leading-4 text-[#111827]">Apply to Invoices</div>
          </div>
        </div>
        <div className="mx-4 h-[1.5px] flex-1 bg-[#E5E7EB]" />
        <div className="flex items-center gap-[10px]">
          <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full border-2 border-[#D1D5DB] bg-white">
            <span className="flex text-[12px] font-semibold leading-4 text-[#9CA3AF]">4</span>
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase leading-3 tracking-[0.06em] text-[#9CA3AF]">Step 4</div>
            <div className="text-[12px] leading-4 text-[#9CA3AF]">Review &amp; Confirm</div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-[10px] rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-px shrink-0">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="#D97706" />
          <line x1="12" y1="9" x2="12" y2="13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="17" r="1" fill="#FFFFFF" />
        </svg>
        <span className="inline-block text-[12px] font-semibold leading-4 text-[#92400E]">
          Pool exceeds invoices by $500 · Remaining balance will stay as unallocated credit on account. Decide how to handle before continuing to review.
        </span>
      </div>

      <div className="flex items-start justify-end gap-4">
        <div className="flex w-[762px] shrink-0 flex-col rounded-lg border border-[#E5E7EB] bg-white">
          <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#E5E7EB] px-5 py-[14px]">
            <span className="inline-block shrink-0 text-[14px] font-semibold leading-[18px] text-[#111827]">
              Invoices to Allocate · Acme Corp · 3 accounts
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

          <div className="flex">
            <div className="flex shrink-0 flex-col" style={{ width: 125 }}>
              <div className="flex min-w-0 items-center gap-3 border-b border-[#E5E7EB] bg-[#F9FAFB] px-5 py-[10px]">
                <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.05em] text-[#9CA3AF]">Invoice</span>
              </div>
              <div className="flex flex-col" style={{ width: 151 }}>
                <div className="flex min-h-[56px] min-w-0 items-center gap-3 border-b border-[#F3F4F6] px-5">
                  <div>
                    <div className="text-[13px] font-semibold leading-4 text-[#111827]">INV-10402</div>
                    <div className="mt-0.5 text-[11.5px] leading-[14px] text-[#9CA3AF]">Mar 15</div>
                  </div>
                </div>
                <div className="flex min-h-[56px] min-w-0 items-center gap-3 border-b border-[#F3F4F6] px-5">
                  <div>
                    <div className="text-[13px] font-semibold leading-4 text-[#111827]">INV-10418</div>
                    <div className="mt-0.5 text-[11.5px] leading-[14px] text-[#9CA3AF]">Mar 12</div>
                  </div>
                </div>
                <div className="flex min-h-[56px] min-w-0 items-center gap-3 border-b border-[#F3F4F6] bg-white px-5">
                  <div>
                    <div className="text-[13px] font-semibold leading-4 text-[#111827]">INV-10440</div>
                    <div className="mt-0.5 text-[11.5px] leading-[14px] text-[#9CA3AF]">Mar 20</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col" style={{ width: 117 }}>
              <div className="flex min-w-0 items-center gap-3 border-b border-[#E5E7EB] bg-[#F9FAFB] px-2 py-[10px]">
                <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.05em] text-[#9CA3AF]">Account</span>
              </div>
              <div className="flex flex-col">
                <div className="flex min-h-[56px] min-w-0 items-center gap-3 border-b border-[#F3F4F6] px-2">
                  <span className="text-[12.5px] leading-4 text-[#374151]">Operating 40021</span>
                </div>
                <div className="flex min-h-[56px] min-w-0 items-center gap-3 border-b border-[#F3F4F6] px-2">
                  <span className="shrink-0 text-[12.5px] leading-4 text-[#374151]">AP · 40007</span>
                </div>
                <div className="flex min-h-[56px] min-w-0 items-center gap-3 border-b border-[#F3F4F6] bg-white px-2">
                  <span className="text-[12.5px] leading-4 text-[#374151]">Utilities 40019</span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col" style={{ width: 75 }}>
              <div className="flex min-w-0 items-center gap-3 border-b border-[#E5E7EB] bg-[#F9FAFB] px-2 py-[10px]">
                <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.05em] text-[#9CA3AF]">Due</span>
              </div>
              <div className="flex flex-col">
                <div className="flex min-h-[56px] min-w-0 items-center gap-3 border-b border-[#F3F4F6] px-2">
                  <span className="flex-1 text-[12.5px] leading-4 text-[#374151]">Mar 15</span>
                </div>
                <div className="flex min-h-[56px] min-w-0 items-center gap-3 border-b border-[#F3F4F6] px-2">
                  <span className="shrink-0 text-[12.5px] font-semibold leading-4 text-[#DC2626]">Mar 12</span>
                </div>
                <div className="flex min-h-[56px] min-w-0 items-center gap-3 border-b border-[#F3F4F6] bg-white px-2">
                  <span className="shrink-0 text-[12.5px] leading-4 text-[#374151]">Mar 20</span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col" style={{ width: 129 }}>
              <div className="flex min-w-0 items-center gap-3 border-b border-[#E5E7EB] bg-[#F9FAFB] px-2 py-[10px]">
                <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.05em] text-[#9CA3AF]">Inv. Amount</span>
              </div>
              <div className="flex flex-col">
                <div className="flex min-h-[56px] min-w-0 items-center gap-3 border-b border-[#F3F4F6] px-2">
                  <span className="shrink-0 text-[13px] font-semibold leading-4 text-[#111827]">$12,400.00</span>
                </div>
                <div className="flex min-h-[56px] min-w-0 items-center gap-3 border-b border-[#F3F4F6] px-2">
                  <span className="shrink-0 text-[13px] font-semibold leading-4 text-[#111827]">$3,200.00</span>
                </div>
                <div className="flex min-h-[56px] min-w-0 items-center gap-3 border-b border-[#F3F4F6] bg-white px-2">
                  <span className="shrink-0 text-[13px] font-semibold leading-4 text-[#111827]">$4,300.00</span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col" style={{ width: 130 }}>
              <div className="flex min-w-0 items-center gap-3 border-b border-[#E5E7EB] bg-[#F9FAFB] px-5 py-[10px]">
                <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.05em] text-[#9CA3AF]">Source</span>
              </div>
              <div className="flex flex-col">
                <div className="flex min-h-[56px] min-w-0 items-center gap-2 border-b border-[#F3F4F6] px-2">
                  <div className="flex items-center gap-[5px]">
                    <span className="inline-block rounded-[3px] bg-[#DBEAFE] px-[5px] py-0.5 text-[10.5px] font-bold leading-[14px] text-[#1D4ED8]">PYMT</span>
                    <span className="inline-block text-[12px] leading-4 text-[#374151]">Wire</span>
                  </div>
                </div>
                <div className="flex min-h-[56px] min-w-0 flex-wrap items-center gap-[5px] border-b border-[#F3F4F6] px-2">
                  <span className="inline-block rounded-[3px] bg-[#F3E8FF] px-[5px] py-0.5 text-[10.5px] font-bold leading-[14px] text-[#7C3AED]">CR-4819</span>
                  <span className="inline-block rounded-[3px] bg-[#DBEAFE] px-[5px] py-0.5 text-[10.5px] font-bold leading-[14px] text-[#1D4ED8]">PYMT</span>
                </div>
                <div className="flex min-h-[56px] min-w-0 flex-wrap items-center gap-[5px] border-b border-[#F3F4F6] bg-white px-2">
                  <span className="inline-block rounded-[3px] bg-[#F3E8FF] px-[5px] py-0.5 text-[10.5px] font-bold leading-[14px] text-[#7C3AED]">CR-9022</span>
                  <span className="inline-block rounded-[3px] bg-[#DBEAFE] px-[5px] py-0.5 text-[10.5px] font-bold leading-[14px] text-[#1D4ED8]">PYMT</span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end" style={{ width: 148 }}>
              <div className="flex min-w-0 items-center gap-3 border-b border-[#E5E7EB] bg-[#F9FAFB] px-5 py-[10px]">
                <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.05em] text-[#9CA3AF]">Applied</span>
              </div>
              <div className="flex flex-col self-stretch">
                <div className="flex min-h-[56px] min-w-0 items-center justify-center gap-3 border-b border-[#F3F4F6] px-2" style={{ width: 148 }}>
                  <div className="flex shrink-0 items-center justify-end gap-1 rounded-md border border-[#4F46E5] bg-white px-[6px] py-[6px]" style={{ width: 108 }}>
                    <span className="inline-block text-[12px] font-medium leading-4 text-[#111827]">$4,500.00</span>
                  </div>
                </div>
                <div className="flex min-h-[56px] min-w-0 items-center justify-center gap-3 border-b border-[#F3F4F6] px-2">
                  <div className="flex shrink-0 items-center justify-end gap-0 rounded-md border border-[#4F46E5] bg-white px-[6px] py-[6px]" style={{ width: 109 }}>
                    <span className="inline-block text-[12px] font-medium leading-4 text-[#111827]">$8,750.00</span>
                  </div>
                </div>
                <div className="flex min-h-[56px] min-w-0 items-center justify-center gap-3 border-b border-[#F3F4F6] px-2">
                  <div className="flex shrink-0 items-center justify-end gap-0 rounded-md border border-[#4F46E5] bg-white px-[6px] py-[6px]" style={{ width: 106 }}>
                    <span className="inline-block text-[12px] font-medium leading-4 text-[#111827]">$15,200.00</span>
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

        <div className="flex shrink-0 flex-col gap-3" style={{ minWidth: 286, width: 383 }}>
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
              <button className="w-full rounded-md border border-[#C7D2FE] bg-[#EEF2FF] px-[14px] py-[9px] text-left text-[12.5px] font-medium leading-4 text-[#4F46E5] hover:bg-[#E0E7FF]">
                Return $500 to credit pool
              </button>
              <button className="w-full rounded-md border border-[#C7D2FE] bg-[#EEF2FF] px-[14px] py-[9px] text-left text-[12.5px] font-medium leading-4 text-[#4F46E5] hover:bg-[#E0E7FF]">
                Apply to another invoice
              </button>
              <button className="w-full rounded-md border border-[#E5E7EB] bg-white px-[14px] py-[9px] text-left text-[12.5px] font-medium leading-4 text-[#6B7280] hover:bg-[#F9FAFB]">
                Flag as overpayment
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
              href="/allocation/apply"
              className="flex items-center justify-center rounded-[4px] border border-[#4F46E5] bg-white px-[13px] py-[13px] text-[13px] font-medium leading-4 text-[#4F46E5] hover:bg-[#EEF2FF]"
            >
              ← Back to Remittance
            </Link>
            <button
              disabled
              className="flex cursor-not-allowed items-center justify-center rounded-[4px] bg-[#D1D5DB] px-[13px] py-[13px] text-[14px] font-medium leading-[18px] text-[#9DA3AF]"
            >
              Review &amp; Confirm →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
