"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AllocationBreadcrumbs } from "@/components/allocations/AllocationBreadcrumbs";
import { AllocationStepper } from "@/components/allocations/AllocationStepper";
import { getFundingPoolTotal, getTotalApplied, useAllocation } from "@/lib/allocation-store";
import { invoices as allInvoices, paymentDetails } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export function ApplyInvoicesClient() {
  const { state, dispatch } = useAllocation();
  const poolTotal = getFundingPoolTotal(state);
  const applied = getTotalApplied(state);

  const progress = useMemo(() => {
    if (poolTotal <= 0) return 0;
    return Math.min(100, Math.round((applied / poolTotal) * 100));
  }, [applied, poolTotal]);

  return (
    <div className="mx-auto max-w-[1158px]">
      <AllocationBreadcrumbs
        items={[
          { label: "Payments" },
          { label: "Payment Allocations" },
          { label: `New Allocation — ${state.customer}` },
        ]}
      />
      <AllocationStepper current={3} />

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[#E5E7EB] pb-4">
        <div>
          <h2 className="text-[15px] font-bold text-[#111827]">
            Invoices to Allocate · {state.customer} · {allInvoices.length} invoices
          </h2>
          <p className="mt-1 text-xs text-[#6B7280]">Payment {paymentDetails.reference}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-[#6B7280]">Applied:</span>
          <span className="font-semibold tabular-nums text-[#111827]">{formatUsd(applied)}</span>
          <span className="text-[#6B7280]">of {formatUsd(poolTotal)}</span>
          <div className="w-28">
            <Progress value={progress} />
          </div>
          <button
            type="button"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-brand text-brand")}
            onClick={() => dispatch({ type: "AUTO_FILL" })}
          >
            Auto-fill
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_242px]">
        <div className="overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                {["Invoice", "Account", "Due", "Open", "Applied"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-[#F3F4F6]">
                  <td className="px-4 py-3 font-medium text-[#111827]">{inv.number}</td>
                  <td className="px-4 py-3 text-[#374151]">{inv.account}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{inv.due}</td>
                  <td className="px-4 py-3 tabular-nums font-semibold text-[#111827]">{formatUsd(inv.amount)}</td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      className="h-8 w-28 tabular-nums"
                      value={state.appliedAmounts[inv.id] ?? 0}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_APPLIED",
                          payload: { id: inv.id, amount: Number(e.target.value) || 0 },
                        })
                      }
                      aria-label={`Applied amount for ${inv.number}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Internal note</h3>
            <Textarea
              className="mt-2 min-h-[88px] border-[#E5E7EB] bg-[#F9FAFB] text-sm text-[#374151]"
              placeholder="Optional note for audit trail…"
              value={state.internalNote}
              onChange={(e) => dispatch({ type: "SET_NOTE", payload: e.target.value })}
            />
          </div>
          <Link
            href="/allocation/review"
            className={cn(
              buttonVariants({ size: "lg" }),
              "flex w-full justify-center bg-brand text-white hover:bg-brand/90",
            )}
          >
            Review & confirm
          </Link>
        </aside>
      </div>
    </div>
  );
}
