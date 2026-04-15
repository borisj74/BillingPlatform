"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  AllocationBreadcrumbs,
  allocationFlowCrumbs,
} from "@/components/allocations/AllocationBreadcrumbs";
import { AllocationStepper } from "@/components/allocations/AllocationStepper";
import { CopilotMark } from "@/components/layout/paper-sidebar/CopilotMark";
import { credits as allCredits, paymentDetails } from "@/lib/mock-data";
import { getFundingPoolTotal, useAllocation } from "@/lib/allocation-store";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const checkboxPoolClass =
  "size-[18px] rounded-sm border-[#D1D5DB] data-checked:border-success data-checked:bg-success data-checked:text-white";

function FundingSearchAiBanner() {
  return (
    <div className="flex flex-wrap items-start gap-3.5 rounded-[10px] border border-[#E6E7EB] bg-[#FBFBFB] p-4 antialiased">
      <div className="flex shrink-0 items-center justify-center rounded-md p-1">
        <CopilotMark />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-semibold leading-snug text-text-primary">
          Cross-account search complete · AI matched credits automatically
        </p>
        <p className="mt-1.5 text-xs leading-4 text-text-secondary">
          All 28 Acme Corp accounts scanned. 5 matching credits found — no manual account-by-account lookup
          needed. AI confidence: 96% avg.
        </p>
      </div>
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

  const selectedCount = state.selectedCreditIds.length;
  const totalSelectable = allCredits.length + 2;

  const exceeds = poolTotal > totalInvoiced;
  const excessAmount = poolTotal - totalInvoiced;
  const barPct = totalInvoiced > 0 ? Math.min(100, (poolTotal / totalInvoiced) * 100) : 0;

  return (
    <div className="mx-auto max-w-[1158px]">
      <AllocationBreadcrumbs items={allocationFlowCrumbs(state.customer, "funding")} />
      <AllocationStepper current={2} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-3.5">
          <FundingSearchAiBanner />

          <div className="overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white">
            <div className="flex flex-wrap items-center gap-2 border-b border-[#F3F4F6] px-4 py-3.5">
              <div className="text-sm font-semibold text-text-primary">Credits Found</div>
              <div className="ml-2 rounded-[20px] bg-success-subtle px-2 py-0.5">
                <span className="text-[11.5px] font-semibold leading-tight text-success">
                  {allCredits.length} across {allCredits.length} accounts
                </span>
              </div>
              <button
                type="button"
                onClick={() => dispatch({ type: "SELECT_ALL_CREDITS" })}
                className="ml-auto rounded-[4px] border border-[#C7D2FE] px-2.5 py-1 text-xs font-semibold text-brand hover:bg-brand-subtle"
              >
                Add All
              </button>
            </div>

            {allCredits.map((c) => {
              const selected = state.selectedCreditIds.includes(c.id);
              const highAi = c.aiConfidence >= 90;
              const creditToggleId = `funding-credit-${c.id}`;
              return (
                <label
                  key={c.id}
                  htmlFor={creditToggleId}
                  className={cn(
                    "flex cursor-pointer items-center border-b border-[#F9FAFB] px-4 py-3 last:border-b-0",
                    selected && "bg-success-subtle",
                  )}
                >
                  <Checkbox
                    id={creditToggleId}
                    checked={selected}
                    onCheckedChange={() => dispatch({ type: "TOGGLE_CREDIT", payload: c.id })}
                    className={cn("mr-3 shrink-0", checkboxPoolClass)}
                    aria-label={`Include credit ${c.number} in funding pool`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-semibold leading-snug text-text-primary">{c.number}</div>
                    <div className="text-xs leading-4 text-text-secondary">
                      {c.account} · {c.issued}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "mr-3 rounded-sm px-1.75 py-0.5",
                      highAi ? "bg-brand-subtle" : "bg-[#F3F4F6]",
                    )}
                  >
                    <span
                      className={cn(
                        "text-[11px] font-bold leading-tight",
                        highAi ? "text-brand" : "text-text-secondary",
                      )}
                    >
                      AI {c.aiConfidence}%
                    </span>
                  </div>
                  <div
                    className={cn(
                      "mr-3 w-max shrink-0 text-[13.5px] font-semibold tabular-nums",
                      selected ? "text-success" : "text-text-primary",
                    )}
                  >
                    {formatUsd(c.amount)}
                  </div>
                  <span
                    className={cn(
                      "shrink-0 text-[12.5px] font-semibold",
                      selected ? "text-success" : "rounded-md border-[1.5px] border-brand bg-white px-3 py-1 text-xs text-brand",
                    )}
                    aria-hidden
                  >
                    {selected ? "Added" : "+ Add"}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white">
            <div className="border-b border-[#F3F4F6] px-4 py-3.5">
              <div className="text-sm font-semibold text-text-primary">
                Unallocated Payments Flagged for allocation
              </div>
            </div>
            <label
              htmlFor="funding-payment-toggle"
              className={cn(
                "flex cursor-pointer items-center px-4 py-3",
                state.paymentSelected ? "bg-success-subtle" : "",
              )}
            >
              <Checkbox
                id="funding-payment-toggle"
                checked={state.paymentSelected}
                onCheckedChange={() => dispatch({ type: "TOGGLE_PAYMENT" })}
                className={cn("mr-3 shrink-0", checkboxPoolClass)}
                aria-label="Include wire payment in funding pool"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-semibold leading-snug text-text-primary">
                  {paymentDetails.method} · {paymentDetails.reference}
                </div>
                <div className="text-xs leading-4 text-text-secondary">
                  Received {paymentDetails.date} · Unallocated
                </div>
              </div>
              <div
                className={cn(
                  "mr-3 w-max shrink-0 text-[13.5px] font-semibold tabular-nums",
                  state.paymentSelected ? "text-success" : "text-text-primary",
                )}
              >
                {formatUsd(paymentAmount)}
              </div>
              <span
                className={cn(
                  "shrink-0 text-[12.5px] font-semibold",
                  state.paymentSelected ? "text-success" : "rounded-md border-[1.5px] border-brand bg-white px-3 py-1 text-xs text-brand",
                )}
                aria-hidden
              >
                {state.paymentSelected ? "Added" : "+ Add"}
              </span>
            </label>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[300px]">
          <div className="overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white">
            <div className="flex items-center bg-brand px-4 py-3.5">
              <div className="text-sm font-bold text-white">Funding Pool</div>
              <div className="ml-auto text-xs text-[#C7D2FE]">
                {selectedCount} of {totalSelectable} items selected
              </div>
            </div>

            <div className="flex flex-col gap-2 px-3.5 py-3">
              {poolRowsOrdered.map((id) => {
                if (id === "payment") {
                  return (
                    <div
                      key="payment"
                      className="flex items-center rounded-lg border border-[#E5E7EB] px-3 py-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-[12.5px] font-semibold text-text-primary">
                          Wire Transfer {paymentDetails.reference}
                        </div>
                        <div className="text-[11px] text-text-tertiary">
                          Payment · {wireDateShort(paymentDetails.date)}
                        </div>
                      </div>
                      <div className="ml-2 w-max shrink-0 text-[13px] font-bold tabular-nums text-brand">
                        {formatUsd(paymentAmount)}
                      </div>
                    </div>
                  );
                }
                const c = creditMap[id];
                if (!c) return null;
                return (
                  <div key={id} className="flex items-center rounded-lg border border-[#E5E7EB] px-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="text-[12.5px] font-semibold text-text-primary">{c.number}</div>
                      <div className="text-[11px] text-text-tertiary">{creditPoolSubtitle(c.account)}</div>
                    </div>
                    <div className="ml-2 w-max shrink-0 text-[13px] font-bold tabular-nums text-brand">
                      {formatUsd(c.amount)}
                    </div>
                  </div>
                );
              })}

              <div className="rounded-lg border-[1.5px] border-dashed border-[#D1D5DB] px-3 py-2.5">
                <p className="text-center text-xs text-text-tertiary">+ Add more credits from the left panel</p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 border-t border-[#E5E7EB] px-4 py-3">
              <div className="flex justify-between">
                <span className="text-[13px] text-text-secondary">Payments</span>
                <span className="text-[13px] font-semibold tabular-nums text-text-primary">
                  {formatUsd(paymentsLine)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[13px] text-text-secondary">Credits</span>
                <span className="text-[13px] font-semibold tabular-nums text-text-primary">
                  {formatUsd(creditsTotal)}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#E5E7EB] pt-2">
                <span className="text-[13px] font-semibold text-text-primary">Pool Total</span>
                <span className="text-[15px] font-bold tabular-nums text-brand">{formatUsd(poolTotal)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-[10px] border border-[#E5E7EB] bg-white px-4 py-3.5">
            <div className="mb-3 text-[13.5px] font-semibold text-text-primary">Balance Check</div>
            <div className="mb-1.5 flex justify-between">
              <span className="text-[13px] text-text-secondary">Total Invoiced</span>
              <span className="text-[13px] font-medium tabular-nums text-text-primary">
                {formatUsd(totalInvoiced)}
              </span>
            </div>
            <div className="mb-2.5 flex justify-between">
              <span className="text-[13px] text-text-secondary">Funding Pool</span>
              <span className="text-[13px] font-semibold tabular-nums text-brand">{formatUsd(poolTotal)}</span>
            </div>
            <div className="mb-2.5 h-1.5 overflow-hidden rounded-[3px] bg-[#E5E7EB]">
              <div className="h-full rounded-[3px] bg-brand" style={{ width: `${barPct}%` }} />
            </div>
            {exceeds && (
              <div className="flex gap-2 rounded-[7px] border border-amber-200 bg-warning-subtle px-3 py-2.5">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                  aria-hidden
                >
                  <path
                    d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                    fill="#D97706"
                  />
                  <line x1="12" y1="9" x2="12" y2="13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                  <line x1="12" y1="17" x2="12.01" y2="17" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <div>
                  <p className="text-[12.5px] font-semibold text-amber-900">
                    Funding pool exceeds invoices by {formatUsd(excessAmount)}
                  </p>
                  <p className="mt-0.5 text-xs leading-4 text-amber-900">
                    Remaining balance will stay on account. You can adjust in Step 3.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/allocation/apply"
              className="flex w-full flex-col items-center justify-center rounded-[4px] bg-brand py-3.5 text-sm font-medium text-white hover:bg-brand/90"
            >
              Continue to Apply Invoices →
            </Link>
            <Link
              href="/allocation/import/parsed"
              className="flex w-full flex-col items-center justify-center rounded-sm border border-brand bg-white px-3.5 py-3.5 text-[13px] font-medium text-brand hover:bg-brand-subtle"
            >
              ← Back to Remittance
            </Link>
            <Link
              href="/allocation/funding/manual"
              className="text-center text-[13px] font-medium text-text-secondary underline-offset-2 hover:text-brand hover:underline"
            >
              manual fallback
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
