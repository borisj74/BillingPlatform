"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import {
  AllocationBreadcrumbs,
  allocationReviewPaperCrumbs,
} from "@/components/allocations/AllocationBreadcrumbs";
import { AllocationStepper } from "@/components/allocations/AllocationStepper";
import { getFundingPoolTotal, getTotalApplied, useAllocation } from "@/lib/allocation-store";
import { credits, invoices as allInvoices, paymentDetails, remittances } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const EPS = 0.01;

function invoiceRowKind(applied: number, amount: number): "full" | "partial" | "none" {
  if (applied >= amount - EPS) return "full";
  if (applied > EPS) return "partial";
  return "none";
}

function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#16A34A" />
      <polyline points="9 12 11 14 15 10" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarningCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#F59E0B" />
      <path d="M12 8v4m0 4h.01" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Paper JEY-0 — source chips: PYMT blue, credits purple; tight padding. */
function SourcePills({ tokens }: { tokens: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {tokens.map((t, i) =>
        t === "PYMT" ? (
          <span
            key={`pymt-${i}`}
            className="inline-block rounded-sm bg-[#DBEAFE] px-1.5 py-0.5 text-[11px] font-bold leading-[14px] text-[#1D4ED8]"
          >
            PYMT
          </span>
        ) : (
          <span
            key={`${t}-${i}`}
            className="inline-block rounded-sm bg-[#F3E8FF] px-1.5 py-0.5 text-[11px] font-bold leading-[14px] text-[#7C3AED]"
          >
            {t}
          </span>
        ),
      )}
    </div>
  );
}

/** “CR-4821 and CR-4819” for validation / post-submission copy. */
function creditNamesSentence(creditList: { number: string }[]): string {
  const nums = creditList.map((c) => c.number);
  if (nums.length === 0) return "";
  if (nums.length === 1) return nums[0];
  if (nums.length === 2) return `${nums[0]} and ${nums[1]}`;
  return `${nums.slice(0, -1).join(", ")} and ${nums[nums.length - 1]}`;
}

/** Paper JEY-0 — Screen 5 Review & Confirm */
export function ReviewConfirmClient() {
  const router = useRouter();
  const { state, dispatch } = useAllocation();
  const poolTotal = getFundingPoolTotal(state);
  const applied = getTotalApplied(state);
  const remainingOnAccount = Math.max(0, poolTotal - applied);

  const remittance = useMemo(
    () => remittances.find((r) => r.customer === state.customer),
    [state.customer],
  );

  const invoiceStats = useMemo(() => {
    let full = 0;
    let partial = 0;
    let none = 0;
    for (const inv of allInvoices) {
      const a = state.appliedAmounts[inv.id] ?? 0;
      const k = invoiceRowKind(a, inv.amount);
      if (k === "full") full += 1;
      else if (k === "partial") partial += 1;
      else none += 1;
    }
    return { full, partial, none };
  }, [state.appliedAmounts]);

  const invoiceTotal = allInvoices.length;
  const selectedCredits = credits.filter((c) => state.selectedCreditIds.includes(c.id));
  const creditLabelsJoined = selectedCredits.map((c) => c.number).join(" + ");
  const creditsCopy = creditNamesSentence(selectedCredits);

  const customerSummary = remittance
    ? `${remittance.accounts} accounts · ${remittance.paymentType} · ${remittance.date}`
    : `${paymentDetails.method} · ${paymentDetails.date}`;

  const allInvoicesFullyCovered = invoiceStats.full === invoiceTotal;

  function confirm() {
    const confirmation = `PA-${String(Math.floor(10000 + Math.random() * 90000))}`;
    toast.success("Allocation submitted (prototype)");
    dispatch({ type: "RESET" });
    router.push(`/allocation/confirm?confirmation=${encodeURIComponent(confirmation)}`);
  }

  return (
    <div className="w-full text-xs/4 antialiased">
      <AllocationBreadcrumbs items={allocationReviewPaperCrumbs(state.customer)} variant="reviewFp" />
      <AllocationStepper current={4} hideActiveSuffix />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[10px] border border-solid border-[#E5E7EB] bg-white px-4 py-3.5">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">Customer</div>
              <div className="text-[15px] font-bold leading-[18px] text-[#111827]">{state.customer}</div>
              <div className="mt-0.5 text-xs leading-4 text-[#9CA3AF]">{customerSummary}</div>
            </div>
            <div className="rounded-[10px] border border-solid border-[#E5E7EB] bg-white px-4 py-3.5">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">Total Applied</div>
              <div className="text-[15px] font-bold leading-[18px] text-[#4F46E5]">{formatUsd(applied)}</div>
              <div className="mt-0.5 text-xs font-medium leading-4 text-[#16A34A]">
                {invoiceStats.full} {invoiceStats.full === 1 ? "invoice" : "invoices"} fully settled
              </div>
            </div>
            <div className="rounded-[10px] border border-solid border-[#E5E7EB] bg-white px-4 py-3.5">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">Funding Pool</div>
              <div className="text-[15px] font-bold leading-[18px] text-[#111827]">{formatUsd(poolTotal)}</div>
              <div className="mt-0.5 text-xs font-medium leading-4 text-[#F59E0B]">
                {remainingOnAccount > EPS
                  ? `${formatUsd(remainingOnAccount)} remains on account`
                  : "Pool fully allocated"}
              </div>
            </div>
            <div className="rounded-[10px] border border-solid border-[#E5E7EB] bg-white px-4 py-3.5">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">Credits Used</div>
              <div className="text-[15px] font-bold leading-[18px] text-[#111827]">
                {selectedCredits.length} of {credits.length}
              </div>
              <div className="mt-0.5 text-xs leading-4 text-[#9CA3AF]">
                {creditLabelsJoined || "—"}
              </div>
            </div>
          </div>

          <div className="rounded-[10px] border border-solid border-[#E5E7EB] bg-white px-5 py-4.5">
            <div className="mb-3.5 text-[15px] font-semibold leading-[18px] text-[#111827]">Validation Checks</div>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <CheckCircleIcon />
                <span className="text-[13.5px] leading-[18px] text-[#374151]">
                  {allInvoicesFullyCovered
                    ? `All ${invoiceTotal} invoices are fully covered by the funding pool`
                    : `${invoiceStats.full} of ${invoiceTotal} invoices are fully covered — review amounts before submitting`}
                </span>
              </div>
              {selectedCredits.length > 0 ? (
                <div className="flex items-center gap-2.5">
                  <CheckCircleIcon />
                  <span className="text-[13.5px] leading-[18px] text-[#374151]">
                    Credits {creditsCopy} are valid and unallocated
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <CheckCircleIcon />
                  <span className="text-[13.5px] leading-[18px] text-[#374151]">No credits applied to this allocation</span>
                </div>
              )}
              {state.paymentSelected ? (
                <div className="flex items-center gap-2.5">
                  <CheckCircleIcon />
                  <span className="text-[13.5px] leading-[18px] text-[#374151]">
                    Wire transfer {paymentDetails.reference} confirmed received
                  </span>
                </div>
              ) : null}
              <div className="flex items-center gap-2.5">
                <CheckCircleIcon />
                <span className="text-[13.5px] leading-[18px] text-[#374151]">No duplicate allocations detected</span>
              </div>
              {remainingOnAccount > EPS ? (
                <div className="flex items-center gap-2.5">
                  <WarningCircleIcon />
                  <span className="min-w-0 flex-1 text-[13.5px] leading-[18px] text-[#374151]">
                    Remaining {formatUsd(remainingOnAccount)} will stay as unallocated balance on account
                  </span>
                  <Link
                    href="/allocation/apply"
                    className="ml-auto shrink-0 rounded-md border border-solid border-[#D1D5DB] px-2.5 py-1 text-xs font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB]"
                  >
                    Allocate now
                  </Link>
                </div>
              ) : null}
            </div>
          </div>

          <div className="overflow-hidden rounded-[10px] border border-solid border-[#E5E7EB] bg-white">
            <div className="border-b border-solid border-[#F3F4F6] px-5 py-3.5">
              <div className="text-[15px] font-semibold leading-[18px] text-[#111827]">Allocation Breakdown</div>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                <div className="grid grid-cols-4 gap-0 border-b border-solid border-[#E5E7EB] bg-[#F9FAFB] px-5 py-2.5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">Invoice</div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">Account</div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">Source</div>
                  <div className="text-right text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">Applied</div>
                </div>
                {allInvoices.map((inv, i) => {
                  const rowApplied = state.appliedAmounts[inv.id] ?? 0;
                  const isLast = i === allInvoices.length - 1;
                  return (
                    <div
                      key={inv.id}
                      className={cn(
                        "grid grid-cols-4 items-center px-5 py-3",
                        !isLast && "border-b border-solid border-[#F9FAFB]",
                      )}
                    >
                      <div className="text-[13.5px] font-medium leading-[18px] text-[#111827]">{inv.number}</div>
                      <div className="text-[13px] leading-4 text-[#6B7280]">{inv.account}</div>
                      <div className="min-w-0">
                        <SourcePills tokens={inv.source} />
                      </div>
                      <div className="text-right text-[13.5px] font-semibold leading-[18px] text-[#111827]">
                        {formatUsd(rowApplied)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <aside className="flex w-full shrink-0 flex-col gap-3 lg:w-[338px]">
          <div className="rounded-[10px] border border-solid border-[#E5E7EB] bg-white p-4">
            <div className="mb-3 text-[13.5px] font-semibold leading-[18px] text-[#111827]">Post-Submission</div>
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <span className="mt-px shrink-0 text-[13px] text-[#16A34A]" aria-hidden>
                  ✓
                </span>
                <span className="text-[12.5px] leading-4 text-[#374151]">
                  All {invoiceTotal} invoices will be marked Paid on submission
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-px shrink-0 text-[13px] text-[#4F46E5]" aria-hidden>
                  ◉
                </span>
                <span className="text-[12.5px] leading-4 text-[#374151]">
                  An audit log entry will be created with your name and timestamp
                </span>
              </div>
              {selectedCredits.length > 0 ? (
                <div className="flex items-start gap-2">
                  <span className="mt-px shrink-0 text-[13px] text-[#16A34A]" aria-hidden>
                    ✓
                  </span>
                  <span className="text-[12.5px] leading-4 text-[#374151]">
                    Credits {creditsCopy} will be marked as used
                  </span>
                </div>
              ) : null}
              {remainingOnAccount > EPS ? (
                <div className="flex items-start gap-2">
                  <span className="mt-px shrink-0 text-[13px] text-[#F59E0B]" aria-hidden>
                    →
                  </span>
                  <span className="text-[12.5px] leading-4 text-[#374151]">
                    {formatUsd(remainingOnAccount)} will remain as unallocated balance on account
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-lg border border-solid border-[#E5E7EB] bg-white p-4">
            <div className="mb-2 text-[13px] font-semibold text-[#111827]">Audit</div>
            <p className="whitespace-pre-wrap text-[11px] leading-[160%] text-[#6B7280]">
              Session ALC-2048 · Operator Sarah M.{"\n"}Idempotent post · Ledger entries generated on commit.
            </p>
          </div>

          <div className="rounded-[10px] border border-solid border-[#E5E7EB] bg-white p-4">
            <div className="mb-2 text-[13px] font-medium leading-4 text-[#374151]">Internal Note (optional)</div>
            <Textarea
              className="min-h-[72px] resize-y rounded-[7px] border-[#E5E7EB] bg-[#F9FAFB] text-sm text-[#374151] placeholder:text-[#C0C6CF]"
              placeholder="Add a note about this allocation…"
              value={state.internalNote}
              onChange={(e) => dispatch({ type: "SET_NOTE", payload: e.target.value })}
            />
          </div>

          <div className="rounded-[10px] border border-solid border-[#86EFAC] bg-[#F0FDF4] p-4 [border-width:1.5px]">
            <div className="mb-2.5 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <circle cx="12" cy="12" r="10" fill="#16A34A" />
                <polyline points="9 12 11 14 15 10" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[13.5px] font-semibold leading-[18px] text-[#166534]">Ready to submit</span>
            </div>
            <div className="mb-3.5 text-xs leading-4 text-[#16A34A]">
              All checks passed · {invoiceTotal} invoices · {formatUsd(applied)}
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={confirm}
                className="flex w-full flex-col items-center justify-center rounded-sm bg-[#4F46E5] px-[13px] py-[13px] text-center text-sm font-medium leading-[18px] text-white antialiased hover:bg-[#4338CA]"
              >
                Confirm & Submit Allocation
              </button>
              <Link
                href="/allocation/apply"
                className="flex w-full flex-col items-center justify-center rounded-sm border border-solid border-[#4F46E5] bg-white px-[13px] py-[13px] text-center text-[13px] font-medium leading-4 text-[#4F46E5] antialiased hover:bg-[#EEF2FF]"
              >
                ← Edit Allocations
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
