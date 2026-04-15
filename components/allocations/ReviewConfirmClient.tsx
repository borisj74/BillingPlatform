"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AllocationBreadcrumbs } from "@/components/allocations/AllocationBreadcrumbs";
import { AllocationStepper } from "@/components/allocations/AllocationStepper";
import { getFundingPoolTotal, getTotalApplied, useAllocation } from "@/lib/allocation-store";
import { invoices as allInvoices } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ReviewConfirmClient() {
  const router = useRouter();
  const { state, dispatch } = useAllocation();
  const poolTotal = getFundingPoolTotal(state);
  const applied = getTotalApplied(state);
  const variance = poolTotal - applied;

  function confirm() {
    toast.success("Allocation submitted (prototype)");
    dispatch({ type: "RESET" });
    router.push("/accounts");
  }

  return (
    <div className="mx-auto max-w-[1158px]">
      <AllocationBreadcrumbs
        items={[
          { label: "Payments" },
          { label: "Payment Allocations" },
          { label: `New Allocation — ${state.customer}` },
        ]}
      />
      <AllocationStepper current={4} />

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-6">
            <h2 className="text-sm font-semibold text-[#111827]">Summary</h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[#6B7280]">Customer</dt>
                <dd className="font-medium text-[#111827]">{state.customer}</dd>
              </div>
              <div>
                <dt className="text-[#6B7280]">Remittance file</dt>
                <dd className="font-medium text-[#111827]">{state.remittanceFileName ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-[#6B7280]">Funding pool</dt>
                <dd className="font-semibold tabular-nums text-[#111827]">{formatUsd(poolTotal)}</dd>
              </div>
              <div>
                <dt className="text-[#6B7280]">Total applied</dt>
                <dd className="font-semibold tabular-nums text-[#111827]">{formatUsd(applied)}</dd>
              </div>
            </dl>
            <div
              className={cn(
                "mt-4 rounded-lg px-3 py-2 text-sm",
                Math.abs(variance) < 0.01 ? "bg-[#F0FDF4] text-[#166534]" : "bg-[#FFFBEB] text-[#92400E]",
              )}
            >
              {Math.abs(variance) < 0.01
                ? "Pool and applied amounts are balanced."
                : `Variance: ${formatUsd(variance)} — adjust on the previous step if needed.`}
            </div>
          </div>

          <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-6">
            <h2 className="text-sm font-semibold text-[#111827]">Per-invoice application</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {allInvoices.map((inv) => (
                <li key={inv.id} className="flex justify-between gap-4 border-b border-[#F3F4F6] py-2 last:border-0">
                  <span className="text-[#374151]">
                    {inv.number} · {inv.account}
                  </span>
                  <span className="tabular-nums font-medium text-[#111827]">
                    {formatUsd(state.appliedAmounts[inv.id] ?? 0)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {state.internalNote && (
            <div className="rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-sm">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Internal note</div>
              <p className="mt-2 text-[#374151]">{state.internalNote}</p>
            </div>
          )}
        </div>

        <aside className="h-fit space-y-3 rounded-[10px] border border-[#E5E7EB] bg-white p-5">
          <button
            type="button"
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full justify-center bg-brand text-white hover:bg-brand/90",
            )}
            onClick={confirm}
          >
            Confirm allocation
          </button>
          <Link
            href="/allocation/apply"
            className={cn(buttonVariants({ variant: "outline" }), "flex w-full justify-center")}
          >
            Back to invoices
          </Link>
          <Link href="/accounts" className={cn(buttonVariants({ variant: "ghost" }), "flex w-full justify-center")}>
            Save draft (prototype)
          </Link>
        </aside>
      </div>
    </div>
  );
}
