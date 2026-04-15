"use client";

import Link from "next/link";
import { remittances, type Remittance } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { AllocationAiBanner } from "@/components/allocations/AllocationAiBanner";
import {
  AllocationBreadcrumbs,
  hubPaymentAllocationsCrumbs,
} from "@/components/allocations/AllocationBreadcrumbs";

function StatusBadge({ status }: { status: Remittance["status"] }) {
  if (status === "Pending") {
    return (
      <span className="inline-block rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-[11.5px] font-semibold text-[#D97706]">
        Pending
      </span>
    );
  }
  if (status === "Overdue") {
    return (
      <span className="inline-block rounded-full bg-[#FEE2E2] px-2.5 py-0.5 text-[11.5px] font-semibold text-[#DC2626]">
        Overdue
      </span>
    );
  }
  return (
    <span className="inline-block rounded-full bg-[#F0FDF4] px-2.5 py-0.5 text-[11.5px] font-semibold text-[#16A34A]">
      Completed
    </span>
  );
}

function AiMatchCell({ value }: { value: number | null }) {
  if (value == null) {
    return <span className="pl-1 text-sm text-[#D1D5DB]">—</span>;
  }
  return (
    <span className="inline-block rounded-[5px] bg-brand-subtle px-1.75 py-0.5 text-[11px] font-bold text-brand">
      AI {value}%
    </span>
  );
}

export function RemittanceHub() {
  const pendingCount = remittances.filter((r) => r.status === "Pending").length;

  return (
    <div className="mx-auto max-w-[1344px]">
      <AllocationBreadcrumbs items={hubPaymentAllocationsCrumbs()} />

      <AllocationAiBanner />

      <div className="mb-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[10px] border border-[#E5E7EB] bg-white px-5 py-4.5">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
            Pending Remittances
          </div>
          <div className="text-[28px] font-bold leading-none text-[#111827]">{pendingCount}</div>
          <div className="mt-1.5 text-xs font-medium text-[#F59E0B]">↑ 3 new today</div>
        </div>
        <div className="rounded-[10px] border border-[#E5E7EB] bg-white px-5 py-4.5">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
            Unallocated Payments
          </div>
          <div className="text-[28px] font-bold leading-none text-[#111827]">$184,320</div>
          <div className="mt-1.5 text-xs text-[#6B7280]">Across 12 payments</div>
        </div>
        <div className="rounded-[10px] border border-[#E5E7EB] bg-white px-5 py-4.5">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
            Available Credits
          </div>
          <div className="text-[28px] font-bold leading-none text-[#111827]">$42,750</div>
          <div className="mt-1.5 text-xs text-[#6B7280]">Across 8 accounts</div>
        </div>
        <div className="rounded-[10px] border border-[#E5E7EB] bg-white px-5 py-4.5">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
            Allocated Today
          </div>
          <div className="text-[28px] font-bold leading-none text-[#111827]">$95,200</div>
          <div className="mt-1.5 text-xs font-medium text-[#16A34A]">✓ 4 completed</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white">
        <div className="flex flex-wrap items-center gap-2 border-b border-[#E5E7EB] px-5 pb-3.5 pt-4">
          <h2 className="text-[15px] font-bold text-[#111827]">Pending Remittances</h2>
          <span className="inline-block rounded-[20px] bg-brand-subtle px-2.5 py-0.5 text-[11px] font-bold text-brand">
            {pendingCount} awaiting
          </span>
          <div className="flex-1" />
          <span className="text-[13px] text-[#6B7280]">All customers</span>
          <span className="text-[13px] text-[#6B7280]">All statuses</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                {["Customer", "Accounts", "Payment Amt", "Credits Req.", "Received", "Status", "AI Match", "Action"].map(
                  (h) => (
                    <th
                      key={h}
                      scope="col"
                      className="whitespace-nowrap px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {remittances.map((r) => (
                <tr
                  key={r.id}
                  className={cn(
                    "border-b border-[#F3F4F6]",
                    r.customer === "Global Retail Inc." && "bg-[#FFFBEB]",
                  )}
                >
                  <td className="min-h-14 px-5 py-3 align-middle">
                    <div className="font-semibold text-[#111827]">{r.customer}</div>
                    <div className="mt-0.5 text-[11.5px] text-[#9CA3AF]">
                      {r.paymentType} · {r.date}
                    </div>
                  </td>
                  <td className="px-5 py-3 align-middle text-[#374151]">{r.accounts} accounts</td>
                  <td className="px-5 py-3 align-middle font-semibold text-[#111827]">
                    {formatUsd(r.paymentAmt)}
                  </td>
                  <td className="px-5 py-3 align-middle">
                    {r.creditsReq === 0 ? (
                      <span className="text-[#9CA3AF]">None</span>
                    ) : (
                      <span className="font-medium text-brand">
                        {r.creditsReq} credit{r.creditsReq === 1 ? "" : "s"}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 align-middle text-[#6B7280]">{r.received}</td>
                  <td className="px-5 py-3 align-middle">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-5 py-3 align-middle">
                    <AiMatchCell value={r.aiMatch} />
                  </td>
                  <td className="px-5 py-3 align-middle">
                    {r.status === "Completed" ? (
                      <Link
                        href={`/allocation/review?from=${r.id}`}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "rounded-[4px] border-[#16A34A] font-medium text-[#16A34A]",
                        )}
                      >
                        View Details
                      </Link>
                    ) : (
                      <Link
                        href={`/allocation/import?customer=${encodeURIComponent(r.customer)}`}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "rounded-[4px] border-brand font-semibold text-brand hover:bg-brand-subtle hover:text-brand",
                        )}
                      >
                        Start Allocation
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
