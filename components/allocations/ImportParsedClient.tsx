"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { AllocationBreadcrumbs } from "@/components/allocations/AllocationBreadcrumbs";
import { AllocationStepper } from "@/components/allocations/AllocationStepper";
import { useAllocation } from "@/lib/allocation-store";
import { paymentDetails } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ImportParsedClient() {
  const { state } = useAllocation();

  return (
    <div className="mx-auto max-w-[1158px]">
      <AllocationBreadcrumbs
        items={[
          { label: "Payments" },
          { label: "Payment Allocations" },
          { label: `New Allocation — ${state.customer}` },
        ]}
      />
      <AllocationStepper current={1} />

      <div className="mb-6 flex items-start gap-3 rounded-[10px] border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#16A34A]" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-[#111827]">Remittance parsed successfully</p>
          <p className="mt-0.5 text-xs text-[#6B7280]">
            Matched payment reference {paymentDetails.reference} · {state.remittanceFileName ?? "remittance.csv"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-6">
          <h2 className="text-sm font-semibold text-[#111827]">Payment details</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[#6B7280]">Amount</dt>
              <dd className="font-semibold text-[#111827]">{formatUsd(paymentDetails.amount)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#6B7280]">Method</dt>
              <dd className="text-[#111827]">{paymentDetails.method}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#6B7280]">Date</dt>
              <dd className="text-[#111827]">{paymentDetails.date}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#6B7280]">Reference</dt>
              <dd className="font-mono text-[13px] text-[#111827]">{paymentDetails.reference}</dd>
            </div>
          </dl>
        </div>
        <div className="flex flex-col justify-end gap-3">
          <Link
            href="/allocation/funding"
            className={cn(buttonVariants({ size: "lg" }), "w-full justify-center bg-brand text-white hover:bg-brand/90")}
          >
            Continue to funding pool
          </Link>
          <Link
            href="/allocation/funding/manual"
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "w-full justify-center",
            )}
          >
            Open manual fallback preview
          </Link>
        </div>
      </div>
    </div>
  );
}
