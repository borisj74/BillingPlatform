"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AllocationBreadcrumbs,
  allocationFlowCrumbs,
} from "@/components/allocations/AllocationBreadcrumbs";
import { AllocationStepper } from "@/components/allocations/AllocationStepper";
import { useAllocation } from "@/lib/allocation-store";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

/** Paper DVP-0 — upload glyph in gray tile */
function RemittanceUploadGlyph({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 text-[#6B7280]", className)}
      aria-hidden
    >
      <path
        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ImportRemittanceClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, dispatch } = useAllocation();
  const [dragOver, setDragOver] = useState(false);
  const [pasteText, setPasteText] = useState("");

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

  function goParsed() {
    if (!state.remittanceFileName && !pasteText.trim()) {
      dispatch({ type: "SET_FILE", payload: "remittance-sample.csv" });
    }
    dispatch({ type: "SET_PARSE_STATE", payload: "parsed" });
    router.push("/allocation/import/parsed");
  }

  function goError() {
    if (!state.remittanceFileName && !pasteText.trim()) {
      dispatch({ type: "SET_FILE", payload: "remittance-sample.csv" });
    }
    dispatch({ type: "SET_PARSE_STATE", payload: "error" });
    router.push("/allocation/import/error");
  }

  return (
    <div className="mx-auto flex max-w-[1158px] flex-col gap-4">
      <AllocationBreadcrumbs className="mb-0" items={allocationFlowCrumbs(titleCustomer, "remittance")} />
      <AllocationStepper className="mb-0" current={1} />

      <div
        className={cn(
          "flex w-full flex-col gap-4 rounded-[10px] border border-[#E5E7EB] bg-white p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]",
        )}
      >
          <div className="space-y-1">
            <h2 className="text-[15px] font-semibold leading-[1.125rem] text-[#111827]">Remittance Advice</h2>
            <p className="text-[13px] leading-4 text-[#6B7280]">
              Upload or paste the remittance document from the customer
            </p>
          </div>

          <div
            className={cn(
              "flex cursor-pointer flex-col rounded-lg border-2 border-dashed p-9 transition-colors",
              dragOver ? "border-brand bg-brand-subtle/40" : "border-[#D1D5DB] bg-white",
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
            onClick={() => document.getElementById("remittance-file")?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                document.getElementById("remittance-file")?.click();
              }
            }}
            aria-label="Upload remittance file"
          >
            <div className="mb-3 flex size-10 items-center justify-center self-center rounded-lg bg-[#F3F4F6]">
              <RemittanceUploadGlyph />
            </div>
            <p className="mb-1 text-center text-sm font-semibold leading-[1.125rem] text-[#374151]">
              Drop file here, or browse
            </p>
            <p className="text-center text-xs leading-4 text-[#9CA3AF]">PDF, XLS, CSV, TXT · max 10MB</p>
            <input
              id="remittance-file"
              type="file"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFilePick(f.name);
              }}
            />
          </div>

          <div className="flex items-center gap-2.5">
            <div className="h-px flex-1 bg-[#E5E7EB]" aria-hidden />
            <span className="shrink-0 text-xs font-medium text-[#9CA3AF]">OR PASTE TEXT</span>
            <div className="h-px flex-1 bg-[#E5E7EB]" aria-hidden />
          </div>

          <Textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste remittance text…"
            rows={3}
            className="min-h-20 resize-y rounded-lg border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus-visible:border-brand focus-visible:ring-brand/25"
          />

          {state.remittanceFileName && (
            <p className="text-[13px] text-[#374151]">
              Selected: <span className="font-medium">{state.remittanceFileName}</span>
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-[4px] bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand/90"
              onClick={goParsed}
            >
              Parse Remittance
            </button>
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t border-[#F3F4F6] pt-4">
            <button
              type="button"
              className="text-xs font-medium text-[#9CA3AF] underline-offset-2 hover:text-[#6B7280] hover:underline"
              onClick={goError}
            >
              Simulate parse error (prototype)
            </button>
          </div>
        </div>
    </div>
  );
}
