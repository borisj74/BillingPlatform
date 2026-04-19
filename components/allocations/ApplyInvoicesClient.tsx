"use client";

import Link from "next/link";
import { useMemo } from "react";
import { toast } from "sonner";
import {
  AllocationBreadcrumbs,
  allocationApplyPaperCrumbs,
} from "@/components/allocations/AllocationBreadcrumbs";
import { AllocationStepper } from "@/components/allocations/AllocationStepper";
import { getFundingPoolTotal, getTotalApplied, useAllocation } from "@/lib/allocation-store";
import { credits, invoices as allInvoices, paymentDetails } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EPS = 0.01;

const spinNone =
  "[appearance:textfield] [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

function creditByNumber(num: string) {
  return credits.find((c) => c.number === num);
}

function sourceShareApplied(sourceAmount: number, appliedTotal: number, poolTotal: number): number {
  if (poolTotal <= 0) return 0;
  return Math.min(sourceAmount, (appliedTotal * sourceAmount) / poolTotal);
}

function invoiceRowKind(applied: number, amount: number): "full" | "partial" | "none" {
  if (applied >= amount - EPS) return "full";
  if (applied > EPS) return "partial";
  return "none";
}

function SourceCell({ sources }: { sources: string[] }) {
  return (
    <div className="flex min-w-[140px] flex-col gap-1.5">
      {sources.map((token) => {
        if (token === "PYMT") {
          return (
            <div key={`${token}-row`} className="flex flex-wrap items-baseline gap-1.25">
              <span className="rounded-[3px] bg-[#DBEAFE] px-1.25 py-0.5 text-[10.5px] font-bold text-[#1D4ED8]">
                PYMT
              </span>
              <span className="text-xs text-[#374151]">Wire</span>
            </div>
          );
        }
        const cr = creditByNumber(token);
        return (
          <div key={token} className="flex flex-wrap items-baseline gap-1.25">
            <span className="rounded-[3px] bg-[#F3E8FF] px-1.25 py-0.5 text-[10.5px] font-bold text-[#7C3AED]">
              {token}
            </span>
            {cr ? (
              <span className="text-[11.5px] tabular-nums text-[#374151]">{formatUsd(cr.amount)}</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/** Paper LJ7-0 (FP-0) — Applied column: right-aligned value, purple border, no adornment. */
function AppliedAmountCell({
  value,
  onChange,
  ariaLabel,
}: {
  value: number;
  onChange: (next: number) => void;
  ariaLabel: string;
}) {
  return (
    <div className="flex min-h-[30px] min-w-[108px] max-w-[140px] flex-1 items-center justify-end gap-1 rounded-md border border-solid border-[#4F46E5] bg-white p-1.5 antialiased">
      <input
        type="number"
        inputMode="decimal"
        step="0.01"
        min={0}
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className={cn(
          spinNone,
          "min-w-0 w-full border-0 bg-transparent p-0 text-right text-xs font-medium tabular-nums text-[#111827] shadow-none outline-none",
          "focus-visible:ring-0",
        )}
      />
    </div>
  );
}

export function ApplyInvoicesClient() {
  const { state, dispatch } = useAllocation();
  const poolTotal = getFundingPoolTotal(state);
  const applied = getTotalApplied(state);
  const remaining = poolTotal - applied;

  const accountCount = useMemo(() => new Set(allInvoices.map((i) => i.account)).size, []);
  const invoiceTotal = allInvoices.length;

  /** Paper 1O6-0: show when the pool is exhausted (applied ≥ pool). Over-allocation still counts as “fully covered”. */
  const poolFullyAllocated = poolTotal > 0 && remaining <= EPS;

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

  const progressPct = poolTotal > 0 ? Math.min(100, Math.round((applied / poolTotal) * 100)) : 0;

  const wireCap = state.paymentSelected ? paymentDetails.amount : 0;
  const wireUsed = sourceShareApplied(wireCap, applied, poolTotal);
  const wirePct = wireCap > 0 ? Math.round((wireUsed / wireCap) * 100) : 0;

  const creditUsageLines = useMemo(() => {
    const pool = getFundingPoolTotal(state);
    const appliedTotal = getTotalApplied(state);
    const lines = state.selectedCreditIds
      .map((id) => {
        const c = credits.find((x) => x.id === id);
        if (!c) return null;
        const used = sourceShareApplied(c.amount, appliedTotal, pool);
        const pct = c.amount > 0 ? Math.round((used / c.amount) * 100) : 0;
        return { id, number: c.number, used, cap: c.amount, pct };
      })
      .filter(Boolean) as { id: string; number: string; used: number; cap: number; pct: number }[];
    const order = state.fundingPoolOrder.filter((x) => x !== "payment");
    return [...lines].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  }, [state]);

  return (
    <div className="w-full">
      <AllocationBreadcrumbs items={allocationApplyPaperCrumbs(state.customer)} variant="applyFp" />
      <AllocationStepper current={3} hideActiveSuffix />

      {/* Paper 1O6-0 — single toolbar card */}
      <div className="mb-4 flex shrink-0 flex-wrap items-center gap-4 rounded-[10px] border border-solid border-[#E5E7EB] bg-white px-5 py-3.5 antialiased">
        <div className="min-w-0 text-[13.5px] font-medium leading-4 text-[#374151]">
          Invoices to Allocate · {state.customer} · {accountCount}{" "}
          {accountCount === 1 ? "account" : "accounts"}
        </div>
        <div className="min-w-[12px] grow basis-0" aria-hidden />
        <span className="text-[13px] leading-4 text-[#6B7280]">Applied:</span>
        <span className="text-[15px] font-bold leading-[18px] text-[#4F46E5]">{formatUsd(applied)}</span>
        <span className="text-[13px] leading-4 text-[#9CA3AF]">of {formatUsd(poolTotal)}</span>
        {poolFullyAllocated ? (
          <div className="flex items-center gap-1.5 rounded-[20px] bg-[#F0FDF4] py-1 pl-3 pr-3">
            <div className="size-1.5 shrink-0 rounded-full bg-[#16A34A]" aria-hidden />
            <span className="shrink-0 text-[12.5px] font-semibold leading-4 text-[#16A34A]">Fully covered</span>
          </div>
        ) : null}
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-[7px] border border-[#C7D2FE] bg-[#EEF2FF] px-3 py-1.5 text-[12.5px] font-semibold text-[#4F46E5] transition-colors hover:bg-[#E0E7FF]"
          onClick={() => {
            dispatch({ type: "AUTO_FILL" });
            toast.success("Auto-filled open balances (prototype)");
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.3L12 17l-6.2 4.2 2.4-7.3L2 9.4h7.6z" fill="currentColor" />
          </svg>
          Auto-fill
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,338px)] lg:items-start">
        <div className="min-w-0 overflow-hidden rounded-[10px] border border-solid border-[#E5E7EB] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                {["Invoice", "Account", "Due", "Inv. Amount", "Source", "Applied", "Status"].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allInvoices.map((inv) => {
                const rowApplied = state.appliedAmounts[inv.id] ?? 0;
                const kind = invoiceRowKind(rowApplied, inv.amount);
                const dueUrgent = inv.due === "Mar 12";
                return (
                  <tr key={inv.id} className="border-b border-[#F3F4F6] last:border-b-0">
                    <td className="px-4 py-3 align-top">
                      <div className="font-semibold text-text-primary">{inv.number}</div>
                      <div className="text-[11.5px] text-[#9CA3AF]">{inv.due}</div>
                    </td>
                    <td className="px-4 py-3 align-top text-[#374151]">{inv.account}</td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className={cn("tabular-nums", dueUrgent ? "font-medium text-error" : "text-[#6B7280]")}
                      >
                        {inv.due}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top tabular-nums font-semibold text-text-primary">
                      {formatUsd(inv.amount)}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <SourceCell sources={inv.source} />
                    </td>
                    <td className="px-4 py-3 align-top">
                      <AppliedAmountCell
                        value={rowApplied}
                        onChange={(amount) => dispatch({ type: "SET_APPLIED", payload: { id: inv.id, amount } })}
                        ariaLabel={`Applied amount for ${inv.number}`}
                      />
                    </td>
                    <td className="px-4 py-3 align-top">
                      {kind === "full" ? (
                        <span className="inline-flex rounded-full bg-success-subtle px-2.5 py-0.5 text-[11px] font-semibold text-success">
                          Applied
                        </span>
                      ) : kind === "partial" ? (
                        <span className="inline-flex rounded-full bg-warning-subtle px-2.5 py-0.5 text-[11px] font-semibold text-warning">
                          Partial
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-[#F3F4F6] px-2.5 py-0.5 text-[11px] font-semibold text-[#6B7280]">
                          Not applied
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-[#E5E7EB] bg-[#F8FAFC]">
                <td colSpan={7} className="px-4 py-3 align-middle">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-[#6B7280]">
                      <span className="mt-1.5 size-1.75 shrink-0 rounded-full bg-[#9CA3AF]" aria-hidden />
                      <span>
                        {remaining > EPS ? (
                          <>
                            Remaining pool balance of{" "}
                            <span className="font-medium text-[#374151]">{formatUsd(remaining)}</span> will stay as
                            unallocated credit on account.
                          </>
                        ) : (
                          <>Pool balance is fully allocated across these invoices.</>
                        )}
                      </span>
                    </p>
                    <button
                      type="button"
                      disabled={remaining <= EPS}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "shrink-0 rounded-md border-[#D1D5DB] bg-white text-[12.5px] text-[#374151] disabled:opacity-50",
                      )}
                      onClick={() => {
                        dispatch({ type: "ALLOCATE_REMAINDER" });
                        toast.success("Remainder allocated (prototype)");
                      }}
                    >
                      Allocate remainder
                    </button>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
          </div>
        </div>

        <aside className="flex min-w-0 flex-col gap-3 lg:w-[338px]">
          <div className="overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] px-4 py-3.5">
              <h2 className="text-sm font-semibold text-[#0F172A]">Funding Pool Status</h2>
            </div>
            <div className="flex flex-col gap-1.5 border-t border-[#E5E7EB] px-4 py-3">
              <div className="mb-1.5 flex justify-between gap-2">
                <span className="text-[12.5px] text-[#6B7280]">Pool Total</span>
                <span className="text-[13px] font-semibold tabular-nums text-[#111827]">{formatUsd(poolTotal)}</span>
              </div>
              <div className="mb-1.5 flex justify-between gap-2">
                <span className="text-[12.5px] text-[#6B7280]">Applied</span>
                <span className="text-[13px] font-semibold tabular-nums text-[#4F46E5]">{formatUsd(applied)}</span>
              </div>
              <div className="my-2.5 h-1.5 overflow-hidden rounded-[3px] bg-[#E5E7EB]">
                <div
                  className="h-full rounded-[3px] bg-[#4F46E5] transition-[width]"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex items-end justify-between gap-2 border-t border-[#F3F4F6] pt-2">
                <span className="text-sm font-semibold text-[#111827]">Remaining</span>
                <span
                  className={cn(
                    "text-[15px] font-bold tabular-nums leading-[18px]",
                    remaining > EPS ? "text-[#F59E0B]" : "text-[#6B7280]",
                  )}
                >
                  {formatUsd(Math.max(0, remaining))}
                </span>
              </div>
            </div>
          </div>

          {/* Paper 1S5-0 — Sources Used */}
          <div className="rounded-[10px] border border-solid border-[#E5E7EB] bg-white px-4 py-3.5 antialiased">
            <div className="mb-2.5 text-[12.5px] font-semibold uppercase tracking-[0.04em] text-[#6B7280]">
              Sources Used
            </div>
            {state.paymentSelected ? (
              <div className="mb-2">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[13px] font-medium text-[#111827]">Wire Transfer</span>
                  <span className="inline-block shrink-0 rounded-sm bg-[#EEF2FF] px-1.75 py-0.5">
                    <span className="text-[11.5px] font-bold leading-[14px] text-[#4F46E5]">{wirePct}%</span>
                  </span>
                </div>
                <p className="text-[11.5px] leading-[14px] text-[#9CA3AF]">
                  {formatUsd(wireUsed)} of {formatUsd(wireCap)}
                </p>
              </div>
            ) : null}
            {creditUsageLines.map((line) => {
              const full = line.pct >= 100 || line.used >= line.cap - EPS;
              return (
                <div key={line.id} className="mb-2 last:mb-0">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[13px] font-medium text-[#111827]">{line.number}</span>
                    <span className="inline-block shrink-0 rounded-sm bg-[#F0FDF4] px-1.75 py-0.5">
                      <span className="text-[11.5px] font-bold leading-[14px] text-[#16A34A]">{line.pct}%</span>
                    </span>
                  </div>
                  <p className="text-[11.5px] leading-[14px] text-[#9CA3AF]">
                    {full
                      ? `${formatUsd(line.used)} used · full`
                      : `${formatUsd(line.used)} of ${formatUsd(line.cap)}`}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Paper 1SP-0 — Invoice Status */}
          <div className="rounded-[10px] border border-solid border-[#E5E7EB] bg-white px-4 py-3.5 antialiased">
            <div className="mb-2.5 text-[12.5px] font-semibold uppercase tracking-[0.04em] text-[#6B7280]">
              Invoice Status
            </div>
            <div className="mb-1.5 flex justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <div className="size-1.5 shrink-0 rounded-full bg-[#16A34A]" aria-hidden />
                <span className="text-[13px] text-[#374151]">Fully applied</span>
              </div>
              <span className="text-[13px] font-semibold text-[#111827]">
                {invoiceStats.full} of {invoiceTotal}
              </span>
            </div>
            <div className="mb-1.5 flex justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <div className="size-1.5 shrink-0 rounded-full bg-[#F59E0B]" aria-hidden />
                <span className="text-[13px] text-[#374151]">Partial</span>
              </div>
              <span className="text-[13px] font-semibold text-[#111827]">{invoiceStats.partial}</span>
            </div>
            <div className="flex justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <div className="size-1.5 shrink-0 rounded-full bg-[#E5E7EB]" aria-hidden />
                <span className="text-[13px] text-[#374151]">Not applied</span>
              </div>
              <span className="text-[13px] font-semibold text-[#111827]">{invoiceStats.none}</span>
            </div>
          </div>

          {/* Paper 1T6-0 — primary CTA */}
          <Link
            href="/allocation/review"
            className="flex w-full flex-col items-center justify-center gap-1 rounded-sm bg-[#4F46E5] px-[13px] py-[13px] text-center text-sm font-medium leading-[18px] text-white antialiased hover:bg-[#4338CA]"
          >
            <span>Review & Confirm →</span>
          </Link>
          <Link
            href="/allocation/funding"
            className="flex w-full flex-col items-center justify-center gap-1 self-stretch rounded-sm border border-solid border-[#4F46E5] bg-white px-[13px] py-[13px] text-center text-[13px] font-medium leading-4 text-[#4F46E5] antialiased hover:bg-[#EEF2FF]"
          >
            <span>← Back to Funding Pool</span>
          </Link>
        </aside>
      </div>
    </div>
  );
}
