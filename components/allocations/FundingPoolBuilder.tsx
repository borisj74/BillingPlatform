"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Search } from "lucide-react";
import {
  AllocationBreadcrumbs,
  allocationFundingPaperCrumbs,
} from "@/components/allocations/AllocationBreadcrumbs";
import { AllocationStepper } from "@/components/allocations/AllocationStepper";
import { credits as allCredits, paymentDetails } from "@/lib/mock-data";
import { getFundingPoolTotal, useAllocation } from "@/lib/allocation-store";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";
import { NavArrowLeft, NavArrowRight } from "@/components/ui/NavArrowIcons";
import { Checkbox } from "@/components/ui/checkbox";

const checkboxPoolClass =
  "size-[18px] rounded-sm border-[#CBD5E1] data-checked:border-[#22C55E] data-checked:bg-[#22C55E] data-checked:text-white";

/** Paper 9Y-0 — confidence pill (green or amber). */
function ConfidencePill({ value, high }: { value: number; high: boolean }) {
  return (
    <div
      className={cn(
        "mr-4 flex items-center gap-1 rounded-full px-2 py-0.5",
        high ? "bg-[#DCFCE7]" : "bg-[#FEF3C7]",
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", high ? "bg-[#22C55E]" : "bg-[#F59E0B]")} />
      <span className={cn("text-[11px] font-semibold leading-[0.875rem]", high ? "text-[#15803D]" : "text-[#92400E]")}>
        {value}%
      </span>
    </div>
  );
}

function creditPoolSubtitle(account: string): string {
  const tail = account.includes(" · ") ? account.split(" · ").slice(1).join(" · ") : account;
  return `Credit · ${tail}`;
}

function wireDateShort(isoLike: string): string {
  const t = Date.parse(isoLike);
  if (Number.isNaN(t)) return "Mar 1";
  return new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function FundingPoolBuilder() {
  const { state, dispatch } = useAllocation();

  const creditMap = useMemo(() => Object.fromEntries(allCredits.map((c) => [c.id, c])), []);

  const paymentAmount = paymentDetails.amount;
  const creditsTotal = allCredits
    .filter((c) => state.selectedCreditIds.includes(c.id))
    .reduce((s, c) => s + c.amount, 0);
  const poolTotal = getFundingPoolTotal(state);
  const paymentsLine = state.paymentSelected ? paymentAmount : 0;

  const totalInvoiced = paymentAmount;

  const poolRowsOrdered = useMemo(() => {
    return state.fundingPoolOrder.filter((id) => {
      if (id === "payment") return state.paymentSelected;
      return state.selectedCreditIds.includes(id);
    });
  }, [state.fundingPoolOrder, state.paymentSelected, state.selectedCreditIds]);

  const poolItemCount = poolRowsOrdered.length;
  const totalSourceSlots = 1 + allCredits.length;

  const exceeds = poolTotal > totalInvoiced;
  const excessAmount = exceeds ? poolTotal - totalInvoiced : 0;

  function addAllHighConfidence() {
    const highIds = allCredits.filter((c) => c.aiConfidence >= 90).map((c) => c.id);
    highIds.forEach((id) => {
      if (!state.selectedCreditIds.includes(id)) {
        dispatch({ type: "TOGGLE_CREDIT", payload: id });
      }
    });
    if (!state.paymentSelected) {
      dispatch({ type: "TOGGLE_PAYMENT" });
    }
  }

  return (
    <div className="mx-auto max-w-[1158px] text-xs/4 antialiased">
      <AllocationBreadcrumbs className="mb-3.5" items={allocationFundingPaperCrumbs(state.customer)} />
      <AllocationStepper className="mb-5" current={2} />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        {/* Paper 9Y-0 — left column: credits + unallocated payment */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F1F5F9] px-[18px] py-3.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-sm font-semibold text-[#0F172A]">Credits found</span>
                <span className="inline-flex rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[11px] font-semibold text-[#16A34A]">
                  {allCredits.length} across {allCredits.length} accounts
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className="flex items-center gap-1.5 rounded-md border border-[#E5E7EB] bg-white py-1.5 pl-2.5 pr-3"
                  role="search"
                >
                  <Search className="size-3 shrink-0 text-[#64748B]" aria-hidden />
                  <span className="text-xs text-[#64748B]">Search by ID, account, amount</span>
                </div>
                <button
                  type="button"
                  onClick={addAllHighConfidence}
                  className="rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0F172A] hover:bg-[#F8FAFC]"
                >
                  Add all high-confidence
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              {allCredits.map((c) => {
                const selected = state.selectedCreditIds.includes(c.id);
                const highAi = c.aiConfidence >= 90;
                const creditToggleId = `funding-credit-${c.id}`;
                return (
                  <div
                    key={c.id}
                    className={cn(
                      "flex border-b border-[#E5E7EB] last:border-b-0",
                      selected && highAi && "bg-[#F0FDF4]",
                      selected && !highAi && "bg-white",
                      !selected && "bg-white",
                    )}
                  >
                    <label
                      htmlFor={creditToggleId}
                      className="flex min-w-0 flex-1 cursor-pointer items-center gap-1 py-3 pl-5 pr-2"
                    >
                      <Checkbox
                        id={creditToggleId}
                        checked={selected}
                        onCheckedChange={() => dispatch({ type: "TOGGLE_CREDIT", payload: c.id })}
                        className={cn("mr-3 shrink-0", checkboxPoolClass)}
                        aria-label={`Include credit ${c.number} in funding pool`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-sm font-semibold text-[#374151]">{c.number}</span>
                          {!highAi ? (
                            <span className="inline-flex rounded-full bg-[#FEF3C7] px-1.5 py-0.5 text-[10px] font-semibold text-[#92400E]">
                              Review suggested
                            </span>
                          ) : null}
                        </div>
                        <div className="text-xs leading-4 text-[#6B7280]">
                          {c.account} · {c.issued}
                        </div>
                      </div>
                    </label>
                    <div className="flex w-[174px] shrink-0 flex-col items-end justify-center py-3 pr-2">
                      <ConfidencePill value={c.aiConfidence} high={highAi} />
                    </div>
                    <div className="flex w-[173px] shrink-0 flex-col justify-center py-3 pr-5 text-right">
                      <span className="text-sm font-semibold tabular-nums text-[#374151]">{formatUsd(c.amount)}</span>
                    </div>
                    <div className="flex w-[120px] shrink-0 flex-col items-end justify-center py-3 pr-5">
                      {selected ? (
                        <span className="text-xs font-semibold text-[#16A34A]">Added</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => dispatch({ type: "TOGGLE_CREDIT", payload: c.id })}
                          className="inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-md border border-[#0F172A] bg-white px-2 py-1 text-xs font-medium text-[#0F172A] hover:bg-[#F8FAFC]"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F1F5F9] px-[18px] py-3.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-sm font-semibold text-[#0F172A]">Unallocated payments</span>
                <span className="inline-flex rounded-full bg-[#DBEAFE] px-2 py-0.5 text-[11px] font-semibold text-[#1E40AF]">
                  1 flagged · matches remittance
                </span>
              </div>
              <span className="text-xs text-[#64748B]">Flagged by the system today</span>
            </div>
            <div
              className={cn(
                "flex items-start",
                state.paymentSelected ? "bg-[#F0FDF4]" : "bg-white",
              )}
            >
              <label
                htmlFor="funding-payment-toggle"
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-1 py-3 pl-5 pr-2"
              >
                <Checkbox
                  id="funding-payment-toggle"
                  checked={state.paymentSelected}
                  onCheckedChange={() => dispatch({ type: "TOGGLE_PAYMENT" })}
                  className={cn("mr-3 shrink-0", checkboxPoolClass)}
                  aria-label="Include wire payment in funding pool"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-[#374151]">
                    {paymentDetails.method} · {paymentDetails.reference}
                  </div>
                  <div className="text-xs leading-4 text-[#6B7280]">
                    Received {paymentDetails.date} · Unallocated · matches remittance payment
                  </div>
                </div>
              </label>
              <div className="flex w-[173px] shrink-0 flex-col justify-center py-3 pr-5 text-right">
                <span className="text-sm font-semibold tabular-nums text-[#374151]">{formatUsd(paymentAmount)}</span>
              </div>
              <div className="flex w-[120px] shrink-0 flex-col items-end justify-center py-3 pr-5">
                {state.paymentSelected ? (
                  <span className="text-xs font-semibold text-[#16A34A]">Added</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "TOGGLE_PAYMENT" })}
                    className="inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-md border border-[#0F172A] bg-white px-2 py-1 text-xs font-medium text-[#0F172A] hover:bg-[#F8FAFC]"
                  >
                    + Add
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Paper 9Y-0 — right column: pool summary + actions */}
        <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[340px]">
          <div className="overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] px-4 py-3.5">
              <span className="text-sm font-semibold text-[#0F172A]">Funding pool</span>
              <span className="text-[11px] text-[#64748B]">
                {poolItemCount} of {totalSourceSlots} items
              </span>
            </div>

            <div className="flex flex-col py-2">
              {poolRowsOrdered.map((id) => {
                if (id === "payment") {
                  return (
                    <div key="payment" className="flex items-center justify-between px-4 py-2">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#0F172A]">
                          Wire {paymentDetails.reference}
                        </div>
                        <div className="text-[11px] text-[#64748B]">Payment · {wireDateShort(paymentDetails.date)}</div>
                      </div>
                      <span className="shrink-0 text-[13px] font-semibold tabular-nums text-[#0F172A]">
                        {formatUsd(paymentAmount)}
                      </span>
                    </div>
                  );
                }
                const c = creditMap[id];
                if (!c) return null;
                return (
                  <div key={id} className="flex items-center justify-between px-4 py-2">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#0F172A]">{c.number}</div>
                      <div className="text-[11px] text-[#64748B]">{creditPoolSubtitle(c.account)}</div>
                    </div>
                    <span className="shrink-0 text-[13px] font-semibold tabular-nums text-[#0F172A]">
                      {formatUsd(c.amount)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-1 border-t border-[#F1F5F9] bg-[#F8FAFC] px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#64748B]">Payments</span>
                <span className="text-xs font-medium tabular-nums text-[#0F172A]">{formatUsd(paymentsLine)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#64748B]">Credits</span>
                <span className="text-xs font-medium tabular-nums text-[#0F172A]">{formatUsd(creditsTotal)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#E5E7EB] px-4 py-3.5">
              <span className="text-[13px] font-semibold text-[#0F172A]">Pool total</span>
              <span className="text-[22px] font-bold leading-7 tracking-[-0.02em] tabular-nums text-[#0F172A]">
                {formatUsd(poolTotal)}
              </span>
            </div>

            <div className="flex flex-col gap-2 border-t border-dashed border-[#E5E7EB] bg-white px-4 py-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                  Check vs invoices
                </span>
                {exceeds ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2 py-0.5">
                    <span className="size-1.5 rounded-full bg-[#F59E0B]" />
                    <span className="text-[10px] font-semibold text-[#92400E]">Over-funded</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2 py-0.5">
                    <span className="size-1.5 rounded-full bg-[#22C55E]" />
                    <span className="text-[10px] font-semibold text-[#15803D]">Balanced</span>
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748B]">Total invoiced</span>
                <span className="text-xs tabular-nums text-[#0F172A]">{formatUsd(totalInvoiced)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748B]">Pool covers</span>
                <span className="text-xs tabular-nums text-[#0F172A]">
                  {formatUsd(Math.min(poolTotal, totalInvoiced))}
                </span>
              </div>
              {exceeds ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#92400E]">Excess</span>
                    <span className="text-xs font-semibold tabular-nums text-[#92400E]">{formatUsd(excessAmount)}</span>
                  </div>
                  <div className="mt-1 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2.5">
                    <p className="text-xs font-semibold text-[#92400E]">What happens to the excess?</p>
                    <p className="mt-1 text-[11px] leading-[150%] text-[#78350F]">
                      {formatUsd(excessAmount)} will post as a new credit on Acme · Main Account after commit. You can
                      reassign or split in Step 3.
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/allocation/apply"
              className="flex w-full items-center justify-center gap-1 rounded-sm bg-[#4F46E5] py-[13px] text-sm font-medium text-white hover:bg-[#4338CA]"
            >
              <span>Continue to Apply Invoices</span>
              <NavArrowRight variant="onPrimary" />
            </Link>
            <Link
              href="/allocation/import/parsed"
              className="flex w-full items-center justify-center gap-1 rounded-sm border border-[#4F46E5] bg-white px-[13px] py-[13px] text-[13px] font-medium text-[#4F46E5] hover:bg-[#EEF2FF]"
            >
              <NavArrowLeft className="mr-1" />
              <span>Back to Remittance</span>
            </Link>
            <p className="p-1 text-center text-[11px] text-[#94A3B8]">Session auto-saved · You can resume later</p>
            <Link
              href="/allocation/funding/manual"
              className="text-center text-[12px] font-medium text-[#94A3B8] underline-offset-2 hover:text-[#64748B] hover:underline"
            >
              Manual fallback (prototype)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
