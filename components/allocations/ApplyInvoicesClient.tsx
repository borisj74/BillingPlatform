"use client";

import Link from "next/link";
import { useMemo } from "react";
import { toast } from "sonner";
import {
  AllocationBreadcrumbs,
  allocationApplyInvoicesCrumbs,
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
            <div key={`${token}-row`} className="flex flex-wrap items-baseline gap-2">
              <span className="rounded-md bg-brand-subtle px-2 py-0.5 text-[11px] font-semibold text-brand">
                PYMT
              </span>
              <span className="text-[11px] text-[#6B7280]">{paymentDetails.method}</span>
            </div>
          );
        }
        const cr = creditByNumber(token);
        return (
          <div key={token} className="flex flex-wrap items-baseline gap-2">
            <span className="rounded-md bg-[#F3E8FF] px-2 py-0.5 text-[11px] font-semibold text-[#7C3AED]">
              {token}
            </span>
            {cr ? (
              <span className="text-[11px] tabular-nums text-[#6B7280]">{formatUsd(cr.amount)}</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/** Paper FVO-0 — bordered field, value + pencil; no number spinners. */
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
    <div className="flex min-w-[108px] max-w-[140px] flex-1 items-center justify-between gap-1 rounded-md border border-solid border-brand bg-white p-1.5 antialiased">
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
          "min-w-0 flex-1 border-0 bg-transparent p-0 text-xs font-medium text-[#111827] tabular-nums shadow-none outline-none",
          "focus-visible:ring-0",
        )}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-[9px] shrink-0 text-brand opacity-40"
        aria-hidden
      >
        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
        <path d="m15 5 4 4" />
      </svg>
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
    return state.selectedCreditIds
      .map((id) => {
        const c = credits.find((x) => x.id === id);
        if (!c) return null;
        const used = sourceShareApplied(c.amount, applied, poolTotal);
        const pct = c.amount > 0 ? Math.round((used / c.amount) * 100) : 0;
        return { id, number: c.number, used, cap: c.amount, pct };
      })
      .filter(Boolean) as { id: string; number: string; used: number; cap: number; pct: number }[];
  }, [state.selectedCreditIds, applied, poolTotal]);

  return (
    <div className="mx-auto max-w-[1200px]">
      <AllocationBreadcrumbs items={allocationApplyInvoicesCrumbs(state.customer)} />
      <AllocationStepper current={3} hideActiveSuffix />

      {/* Paper 1O6-0 — single toolbar card */}
      <div className="mb-4 flex shrink-0 flex-wrap items-center gap-4 rounded-[10px] border border-solid border-[#E5E7EB] bg-white px-5 py-3.5 antialiased">
        <div className="min-w-0 text-[13.5px] font-medium leading-4 text-[#374151]">
          Invoices to Allocate · {state.customer} · {accountCount}{" "}
          {accountCount === 1 ? "account" : "accounts"}
        </div>
        <div className="min-w-[12px] grow basis-0" aria-hidden />
        <span className="text-[13px] leading-4 text-[#6B7280]">Applied:</span>
        <span className="text-[15px] font-bold leading-[18px] text-brand">{formatUsd(applied)}</span>
        <span className="text-[13px] leading-4 text-[#9CA3AF]">of {formatUsd(poolTotal)}</span>
        {poolFullyAllocated ? (
          <div className="flex items-center gap-1.5 rounded-[20px] bg-[#F0FDF4] py-1 pl-3 pr-3">
            <div className="size-1.5 shrink-0 rounded-full bg-[#16A34A]" aria-hidden />
            <span className="shrink-0 text-[12.5px] font-semibold leading-4 text-[#16A34A]">Fully covered</span>
          </div>
        ) : null}
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-[4px] border border-[#C7D2FE] bg-brand-subtle px-3 py-1.5 text-[12.5px] font-semibold text-brand transition-colors hover:bg-[#E0E7FF]"
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

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,242px)] lg:items-start">
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
                      <div className="text-[11px] text-[#9CA3AF]">Due {inv.due}</div>
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
              <tr className="border-t border-[#E5E7EB] bg-[#F9FAFB]">
                <td colSpan={7} className="px-4 py-3 align-middle">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-relaxed text-[#6B7280]">
                      {remaining > EPS ? (
                        <>
                          <span className="font-medium text-text-primary">{formatUsd(remaining)}</span> left in the
                          funding pool. Distribute to invoices above or review allocation.
                        </>
                      ) : (
                        <>Pool balance is fully allocated across these invoices.</>
                      )}
                    </p>
                    <button
                      type="button"
                      disabled={remaining <= EPS}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "shrink-0 border-[#D1D5DB] bg-white text-[#374151] disabled:opacity-50",
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

        <aside className="flex min-w-0 flex-col gap-4">
          <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
            <h2 className="mb-2.5 text-[12.5px] font-semibold uppercase tracking-[0.04em] text-[#6B7280]">
              Funding Pool Status
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-[#6B7280]">Pool Total</dt>
                <dd className="tabular-nums font-semibold text-text-primary">{formatUsd(poolTotal)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-[#6B7280]">Applied</dt>
                <dd className="tabular-nums font-semibold text-brand">{formatUsd(applied)}</dd>
              </div>
            </dl>
            <div className="mt-3">
              <div className="h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
                <div
                  className="h-full rounded-full bg-brand transition-[width]"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
            <div className="mt-3 flex justify-between gap-2 text-sm">
              <span className="text-[#6B7280]">Remaining</span>
              <span
                className={cn(
                  "tabular-nums font-semibold",
                  remaining > EPS ? "text-warning" : "text-[#6B7280]",
                )}
              >
                {formatUsd(Math.max(0, remaining))}
              </span>
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
                  <span className="inline-block shrink-0 rounded-sm bg-brand-subtle px-1.75 py-0.5">
                    <span className="text-[11.5px] font-bold leading-[14px] text-brand">{wirePct}%</span>
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
                    <span className="inline-block shrink-0 rounded-sm bg-success-subtle px-1.75 py-0.5">
                      <span className="text-[11.5px] font-bold leading-[14px] text-success">{line.pct}%</span>
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
            className="flex w-full flex-col items-center justify-center gap-[13px] rounded-sm bg-[#4F46E5] px-[13px] py-[13px] text-center text-sm font-medium leading-[18px] text-white antialiased hover:bg-[#4338CA]"
          >
            Review & Confirm →
          </Link>
          {/* Paper G5H-0 — secondary CTA */}
          <Link
            href="/allocation/funding"
            className="flex w-full flex-col items-center justify-center gap-[13px] self-stretch rounded-sm border border-solid border-[#4F46E5] bg-white px-[13px] py-[13px] text-center text-[13px] font-medium leading-4 text-[#4F46E5] antialiased hover:bg-brand-subtle"
          >
            ← Back to Funding Pool
          </Link>
        </aside>
      </div>
    </div>
  );
}
