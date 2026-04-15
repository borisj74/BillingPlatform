"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { AllocationBreadcrumbs } from "@/components/allocations/AllocationBreadcrumbs";
import { AllocationStepper } from "@/components/allocations/AllocationStepper";
import { useAllocation } from "@/lib/allocation-store";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ImportErrorClient() {
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

      <div className="mb-6 flex items-start gap-3 rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#DC2626]" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-[#111827]">Could not parse remittance automatically</p>
          <p className="mt-0.5 text-xs text-[#6B7280]">
            The file format was not recognized. Try CSV export from your bank or manual entry.
          </p>
        </div>
      </div>

      <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-6">
        <p className="text-sm text-[#374151]">
          Prototype: use <strong>manual funding</strong> to continue with reduced AI assistance, or go back and upload a
          different file.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/allocation/import"
            className={cn(buttonVariants({ variant: "outline" }), "border-[#E5E7EB]")}
          >
            Back to import
          </Link>
          <Link
            href="/allocation/funding/manual"
            className={cn(buttonVariants(), "bg-brand text-white hover:bg-brand/90")}
          >
            Continue with manual funding
          </Link>
        </div>
      </div>
    </div>
  );
}
