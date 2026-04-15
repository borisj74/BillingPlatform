"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Upload } from "lucide-react";
import { AllocationBreadcrumbs } from "@/components/allocations/AllocationBreadcrumbs";
import { AllocationStepper } from "@/components/allocations/AllocationStepper";
import { useAllocation } from "@/lib/allocation-store";
import { cn } from "@/lib/utils";

export function ImportRemittanceClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, dispatch } = useAllocation();
  const [dragOver, setDragOver] = useState(false);

  const customerParam = searchParams.get("customer");
  const titleCustomer = customerParam ?? state.customer;

  useEffect(() => {
    if (customerParam) {
      dispatch({ type: "SET_CUSTOMER", payload: customerParam });
    }
  }, [customerParam, dispatch]);

  const onFilePick = useCallback(
    (name: string) => {
      dispatch({ type: "SET_FILE", payload: name });
    },
    [dispatch],
  );

  return (
    <div className="mx-auto max-w-[1158px]">
      <AllocationBreadcrumbs
        items={[
          { label: "Payments" },
          { label: "Payment Allocations" },
          { label: `New Allocation — ${titleCustomer}` },
        ]}
      />
      <AllocationStepper current={1} />

      <div
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-[10px] border-2 border-dashed px-6 py-16 transition-colors",
          dragOver ? "border-brand bg-brand-subtle/40" : "border-[#E5E7EB] bg-white",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f) onFilePick(f.name);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            document.getElementById("remittance-file")?.click();
          }
        }}
        aria-label="Upload remittance file"
      >
        <Upload className="mb-3 h-10 w-10 text-[#9CA3AF]" aria-hidden />
        <p className="text-center text-sm font-medium text-[#111827]">
          Drop remittance advice, CSV, or PDF here
        </p>
        <p className="mt-1 text-center text-xs text-[#6B7280]">or click to browse — prototype accepts any file name</p>
        <input
          id="remittance-file"
          type="file"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFilePick(f.name);
          }}
        />
        <button
          type="button"
          className="mt-4 rounded-lg border border-brand bg-white px-4 py-2 text-sm font-semibold text-brand hover:bg-brand-subtle"
          onClick={() => document.getElementById("remittance-file")?.click()}
        >
          Choose file
        </button>
        {state.remittanceFileName && (
          <p className="mt-4 text-sm text-[#374151]">
            Selected: <span className="font-medium">{state.remittanceFileName}</span>
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
          onClick={() => {
            if (!state.remittanceFileName) {
              dispatch({ type: "SET_FILE", payload: "remittance-sample.csv" });
            }
            dispatch({ type: "SET_PARSE_STATE", payload: "parsed" });
            router.push("/allocation/import/parsed");
          }}
        >
          Parse remittance (success)
        </button>
        <button
          type="button"
          className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#F9FAFB]"
          onClick={() => {
            if (!state.remittanceFileName) {
              dispatch({ type: "SET_FILE", payload: "remittance-sample.csv" });
            }
            dispatch({ type: "SET_PARSE_STATE", payload: "error" });
            router.push("/allocation/import/error");
          }}
        >
          Parse remittance (error)
        </button>
      </div>
    </div>
  );
}
