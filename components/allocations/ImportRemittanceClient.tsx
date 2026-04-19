"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AllocationBreadcrumbs,
  allocationImportPaperCrumbs,
} from "@/components/allocations/AllocationBreadcrumbs";
import { AllocationStepper } from "@/components/allocations/AllocationStepper";
import { RemittanceFormatBadges } from "@/components/allocations/RemittanceFormatBadges";
import { NavArrowLeft, NavArrowRight } from "@/components/ui/NavArrowIcons";
import { Textarea } from "@/components/ui/textarea";
import { useAllocation } from "@/lib/allocation-store";
import { detectRemittanceFormatFromInput, isRemittanceFormatId, type RemittanceFormatId } from "@/lib/remittance-format";
import { cn } from "@/lib/utils";

/** Paper J43-0 — Raw EDI 820 source block (Courier, dark panel). */
const EDI_820_SAMPLE_LINES = [
  "ISA*00* *00* *ZZ*NORTHWIND *ZZ*BILLINGCO *250401*1200*^*00501*000000001*0*P*:",
  "GS*RA*NORTHWIND*BILLINGCO*20250401*1200*1*X*005010X306",
  "ST*820*0001",
  "BPR*C*12500.00*C*ACH*CCD**01*021000021*DA*123456789*20250401",
  "TRN*1*8821REF*0021000021",
  "N1*PR*Northwind Trading Co.*92*CUST-8821",
  "ENT*1",
  "RMR*IV*INV-20441**5000.00*5000.00",
  "RMR*IV*INV-20455**4500.00*4500.00",
  "RMR*IV*INV-20467**3000.00*3000.00",
  "SE*10*0001",
  "GE*1*1",
  "IEA*1*000000001",
] as const;

function EdiImportPanels() {
  return (
    <div className="mb-4 flex flex-col gap-4 lg:flex-row">
      <div className="min-h-0 flex-1 rounded-lg border border-[#E5E7EB] bg-white p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-[13px] font-semibold leading-4 text-[#111827]">Raw EDI 820 source</h3>
          <span className="inline-flex rounded-[20px] bg-[#F3F4F6] px-2.5 py-0.75 text-[10px] font-semibold leading-3 text-[#6B7280]">
            Auto-received · SFTP
          </span>
        </div>
        <div className="overflow-hidden rounded-md bg-[#111827] p-4">
          {EDI_820_SAMPLE_LINES.map((line) => (
            <div key={line} className="font-mono text-[10px] leading-[170%] text-[#D1FAE5]">
              {line}
            </div>
          ))}
        </div>
        <div className="mt-2.5 rounded-md bg-[#F0FDF4] px-3 py-2">
          <p className="text-[11px] font-semibold leading-[0.875rem] text-[#16A34A]">
            EDI parsed · 0 errors · 3 RMR segments · 1 TRN reference
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 rounded-lg border border-[#E5E7EB] bg-white p-5">
        <h3 className="mb-3.5 text-[13px] font-semibold leading-4 text-[#111827]">Extracted payment details</h3>
        <div className="mb-2.5">
          <p className="mb-1 text-[11px] leading-[0.875rem] text-[#6B7280]">Payment amount (BPR segment)</p>
          <div className="rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
            <p className="text-[13px] font-medium leading-4 text-[#111827]">$12,500.00 USD · ACH transfer</p>
          </div>
        </div>
        <div className="mb-2.5">
          <p className="mb-1 text-[11px] leading-[0.875rem] text-[#6B7280]">Payment date</p>
          <div className="rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
            <p className="text-[13px] font-medium leading-4 text-[#111827]">Apr 1, 2025</p>
          </div>
        </div>
        <div className="mb-3">
          <p className="mb-1 text-[11px] leading-[0.875rem] text-[#6B7280]">Invoice line items (RMR segments)</p>
          <div className="rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5">
            {(
              [
                { inv: "INV-20441", amt: "$5,000.00" },
                { inv: "INV-20455", amt: "$4,500.00" },
                { inv: "INV-20467", amt: "$3,000.00" },
              ] as const
            ).map((row, i, arr) => (
              <div
                key={row.inv}
                className={cn(
                  "grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2",
                  i < arr.length - 1 && "mb-1.5",
                )}
              >
                <span className="min-w-0 text-xs leading-4 text-[#374151]">{row.inv}</span>
                <span className="text-xs font-medium leading-4 text-[#111827]">{row.amt}</span>
                <span className="inline-flex justify-self-end rounded-[10px] bg-[#DCFCE7] px-2 py-0.5 text-[10px] font-semibold leading-3 text-[#16A34A]">
                  matched
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-md bg-[#F0FDF4] px-3 py-2.5">
          <p className="text-xs leading-5 text-[#111827]">
            Automation rule matched · Northwind EDI auto-match rule will be applied on continue
          </p>
        </div>
      </div>
    </div>
  );
}

export function ImportRemittanceClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, dispatch } = useAllocation();
  const [dragOver, setDragOver] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const customerParam = searchParams.get("customer");
  const formatParam = searchParams.get("format");
  const titleCustomer = customerParam ?? state.customer;

  /** Derived from `?format=`, uploaded file / paste, or PDF browse default. Badges only reflect this — they are not controls. */
  const selectedFormat = useMemo((): RemittanceFormatId => {
    if (isRemittanceFormatId(formatParam)) return formatParam;
    const d = detectRemittanceFormatFromInput(state.remittanceFileName, pasteText);
    if (d) return d;
    return "pdf";
  }, [formatParam, state.remittanceFileName, pasteText]);

  useEffect(() => {
    dispatch({ type: "SET_REMITTANCE_FORMAT", payload: selectedFormat });
  }, [selectedFormat, dispatch]);

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

  function continueToParsed() {
    const fallbackFile = "remittance_acme_apr.pdf";
    const effectiveFileName = state.remittanceFileName ?? (pasteText.trim() ? null : fallbackFile);
    if (!state.remittanceFileName && !pasteText.trim()) {
      dispatch({ type: "SET_FILE", payload: fallbackFile });
    }
    dispatch({ type: "SET_PARSE_STATE", payload: "parsed" });
    const fmt = detectRemittanceFormatFromInput(effectiveFileName, pasteText) ?? selectedFormat;
    dispatch({ type: "SET_REMITTANCE_FORMAT", payload: fmt });
    router.push(
      `/allocation/import/parsed?format=${fmt}&customer=${encodeURIComponent(state.customer)}`,
    );
  }

  function goError() {
    if (!state.remittanceFileName && !pasteText.trim()) {
      dispatch({ type: "SET_FILE", payload: "remittance-sample.csv" });
    }
    dispatch({ type: "SET_PARSE_STATE", payload: "error" });
    router.push(`/allocation/import/error?customer=${encodeURIComponent(state.customer)}`);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <AllocationBreadcrumbs className="mb-0" items={allocationImportPaperCrumbs(titleCustomer)} />
      <AllocationStepper className="mb-0" current={1} hideActiveSuffix />

      <div className="flex flex-col gap-4 text-xs/4 antialiased">
        <RemittanceFormatBadges
          activeId={selectedFormat}
          aria-label="Remittance source formats shown for this import."
        />

        {selectedFormat === "edi" ? (
          <EdiImportPanels />
        ) : (
          <>
            <div className="w-full rounded-[10px] border border-solid border-[#E5E7EB] bg-white p-5">
              <div className="mb-3.5 flex flex-wrap items-start justify-between gap-2">
                <h2 className="text-[13px] font-semibold leading-4 text-[#111827]">Import remittance</h2>
                <p className="text-[11px] leading-[0.875rem] text-[#9CA3AF]">
                  Flow: choose source → upload → extract → confirm in remittance panel
                </p>
              </div>
              <p className="mb-3.5 text-xs leading-4 text-[#6B7280]">
                PDF, Excel, CSV, bank files, or paste — same parser, then confirm below.
              </p>

              <div
                className={cn(
                  "relative mb-4 flex min-h-[152.5px] flex-col items-center justify-center rounded-md border border-dashed p-7 transition-colors",
                  dragOver ? "border-brand bg-brand-subtle/40" : "border-[#D1D5DB] bg-[#F9FAFB]",
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
                <p className="mb-2.5 text-center text-xs leading-4 text-[#6B7280]">
                  Drop PDF, Excel, or CSV — or use Browse
                </p>
                <button
                  type="button"
                  className="mb-2 rounded-sm border border-[#E5E7EB] bg-white px-4 py-1.5 text-center text-xs font-medium leading-4 text-[#111827] hover:bg-[#F9FAFB]"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById("remittance-file")?.click();
                  }}
                >
                  Browse files
                </button>
                <p className="text-center text-[10px] leading-3 text-[#9CA3AF]">
                  Max 25 MB · scanned PDFs use OCR · duplicates deduped
                </p>
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

              <div className="mb-3 flex items-center gap-2.5">
                <div className="h-px flex-1 bg-[#E5E7EB]" aria-hidden />
                <span className="shrink-0 text-xs font-medium text-[#9CA3AF]">OR PASTE TEXT</span>
                <div className="h-px flex-1 bg-[#E5E7EB]" aria-hidden />
              </div>

              <Textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Paste remittance text…"
                rows={4}
                className="mb-4 min-h-20 resize-y rounded-lg border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus-visible:border-brand focus-visible:ring-brand/25"
                aria-label="Paste remittance text"
              />

              {state.remittanceFileName ? (
                <p className="mb-4 text-[13px] text-[#374151]">
                  Selected: <span className="font-medium">{state.remittanceFileName}</span>
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="min-h-0 flex-[2] rounded-lg border border-[#E5E7EB] bg-white p-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="text-[13px] font-semibold leading-4 text-[#111827]">Remittance preview</h3>
                  <span className="text-[11px] font-medium leading-[0.875rem] text-[#3B82F6]">View full PDF ↗</span>
                </div>
                <div className="mb-2.5 rounded-sm bg-[#F9FAFB] p-3">
                  <p className="text-[12px] leading-[1.6] text-[#374151]">
                    Wire $10,000 on Mar 1. Apply CR-8891 ($1,200) and CR-9022 ($800). Pay INV-10402, INV-10418,
                    INV-10440.
                  </p>
                </div>
                <p className="text-[11px] leading-[0.875rem] text-[#9CA3AF]">Parsed for matching · 6 entities detected</p>
              </div>

              <div className="min-h-0 flex-[1.5] rounded-lg border border-[#E5E7EB] bg-white p-5">
                <h3 className="mb-3.5 text-[13px] font-semibold leading-4 text-[#111827]">Declared totals</h3>
                <p className="mb-1 text-[11px] leading-[0.875rem] text-[#6B7280]">Payment amount</p>
                <div className="mb-2.5 rounded-sm border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
                  <p className="text-[13px] font-medium leading-4 text-[#111827]">$10,000.00 USD</p>
                </div>
                <p className="mb-1 text-[11px] leading-[0.875rem] text-[#6B7280]">Credits to apply</p>
                <div className="mb-2.5 rounded-sm border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
                  <p className="text-[13px] font-medium leading-4 text-[#111827]">CR-8891 · $1,200 · matched</p>
                </div>
                <div className="rounded-sm bg-[#F0FDF4] px-3 py-2">
                  <p className="text-[11px] font-medium leading-[0.875rem] text-[#16A34A]">
                    Match health: strong · 0 unresolved references
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-[18px] py-3.5">
          <p className="text-xs font-semibold leading-4 text-[#3B82F6]">Suggested allocation ready</p>
          <p className="mt-0.5 text-xs leading-4 text-[#3B82F6]">
            Remittance references matched to invoices — amounts will be pre-filled on the Apply step. You can edit any
            field.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12.5px] leading-4 text-[#9CA3AF]">Session auto-saved · You can resume later</p>
          <div className="flex w-full shrink-0 items-stretch gap-2 sm:w-auto">
            <button
              type="button"
              onClick={() => router.push("/accounts")}
              className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-sm border border-brand px-3 py-3 text-[13px] font-medium leading-4 text-brand sm:flex-initial sm:min-w-[10rem]"
            >
              <NavArrowLeft />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={continueToParsed}
              className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-sm bg-brand px-3 py-3 text-sm font-medium leading-[1.125rem] text-white sm:flex-initial sm:min-w-[14rem]"
            >
              <span>Continue to Funding Pool</span>
              <NavArrowRight variant="onPrimary" />
            </button>
          </div>
        </div>

        {process.env.NODE_ENV === "development" ? (
          <div className="flex justify-end border-t border-[#F3F4F6] pt-4">
            <button
              type="button"
              className="text-xs font-medium text-[#9CA3AF] underline-offset-2 hover:text-[#6B7280] hover:underline"
              onClick={goError}
            >
              Simulate parse error (prototype)
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
