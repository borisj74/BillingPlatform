"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AllocationBreadcrumbs,
  allocationImportPaperCrumbs,
} from "@/components/allocations/AllocationBreadcrumbs";
import { AllocationStepper } from "@/components/allocations/AllocationStepper";
import { RemittanceFormatBadges } from "@/components/allocations/RemittanceFormatBadges";
import { NavArrowLeft, NavArrowRight } from "@/components/ui/NavArrowIcons";
import { useAllocation } from "@/lib/allocation-store";
import { detectRemittanceFormatFromFileName, isRemittanceFormatId } from "@/lib/remittance-format";
import { cn } from "@/lib/utils";

/** Paper IUS-0 / IUX-0 — PDF. Paper J43-0 / J48-0 — EDI 820. */

const EDI_RAW_LINES = [
  "ISA*00*          *00*          *ZZ*NORTHWIND      *ZZ*BILLINGCO      *250401*1200*^*00501*000000001*0*P*:~",
  "GS*RA*NORTHWIND*BILLINGCO*20250401*1200*1*X*005010X306~",
  "ST*820*0001~",
  "BPR*C*12500.00*C*ACH*CCD**01*021000021*DA*123456789*20250401~",
  "TRN*1*8821REF*0021000021~",
  "N1*PR*Northwind Trading Co.*92*CUST-8821~",
  "ENT*1~",
  "RMR*IV*INV-20441**5000.00*5000.00~",
  "RMR*IV*INV-20455**4500.00*4500.00~",
  "RMR*IV*INV-20467**3000.00*3000.00~",
  "SE*10*0001~",
  "GE*1*1~",
  "IEA*1*000000001~",
] as const;

const OCR_SAMPLE = `REMITTANCE ADVICE — Acme Holdings Ltd
Payment date: 01 Apr 2025
Wire transfer: $10,000.00 USD
RE: INV-10402 $4,200 · INV-10418 $3,100 · INV-10440 $2,700
Credits applied: CR-8891 ($1,200) · CR-9022 ($800)`;

function isPdfFileName(name: string): boolean {
  return name.toLowerCase().endsWith(".pdf");
}

function ExtractedRow({
  left,
  amount,
  status,
}: {
  left: string;
  amount: string;
  status: "matched" | "review";
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3">
      <span className="min-w-0 text-xs leading-4 text-[#374151]">{left}</span>
      <span className="shrink-0 text-xs font-medium leading-4 text-[#111827]">{amount}</span>
      <span
        className={cn(
          "inline-flex w-[72px] shrink-0 justify-center rounded-[10px] px-2 py-0.5 text-center text-[10px] font-semibold leading-3",
          status === "matched" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEF3C7] text-[#D97706]",
        )}
      >
        {status === "review" ? "review" : "matched"}
      </span>
    </div>
  );
}

export function ImportParsedClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, dispatch } = useAllocation();
  const customerParam = searchParams.get("customer");
  const formatParam = searchParams.get("format");

  useEffect(() => {
    if (customerParam) {
      dispatch({ type: "SET_CUSTOMER", payload: customerParam });
    }
  }, [customerParam, dispatch]);
  const formatActive = isRemittanceFormatId(formatParam)
    ? formatParam
    : detectRemittanceFormatFromFileName(state.remittanceFileName ?? "remittance_acme_apr.pdf");

  useEffect(() => {
    dispatch({ type: "SET_REMITTANCE_FORMAT", payload: formatActive });
  }, [formatActive, dispatch]);
  const fileName =
    state.remittanceFileName ??
    (formatActive === "edi" ? "remittance_northwind_820.edi" : "remittance_acme_apr.pdf");
  const showEdiPanels = formatActive === "edi";
  const showPdfPanels =
    formatActive === "pdf" || (isPdfFileName(fileName) && formatActive !== "edi" && !showEdiPanels);

  const customerQ = encodeURIComponent(state.customer);

  return (
    <div className="flex w-full flex-col gap-4 text-xs/4 antialiased">
      <AllocationBreadcrumbs className="mb-0" items={allocationImportPaperCrumbs(state.customer)} />
      <AllocationStepper className="mb-0" current={1} hideActiveSuffix />

      <div className="flex flex-col items-stretch self-stretch">
        <RemittanceFormatBadges activeId={formatActive} aria-label="Remittance source formats shown for this import." />

        <div className="mb-4 flex flex-col gap-4 lg:flex-row">
          {showEdiPanels ? (
            <>
              {/* Paper J43-0 / J48-0 — EDI 820 parsed */}
              <div className="min-h-0 flex-1 rounded-lg border border-solid border-[#E5E7EB] bg-white p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-[13px] font-semibold leading-4 text-[#111827]">Raw EDI 820 source</h2>
                  <div className="rounded-[20px] bg-[#F3F4F6] px-2.5 py-0.5">
                    <span className="text-[10px] font-semibold leading-3 text-[#6B7280]">Auto-received · SFTP</span>
                  </div>
                </div>
                <div className="rounded-md bg-[#111827] p-4">
                  {EDI_RAW_LINES.map((line, index) => (
                    <div
                      key={index}
                      className="text-[10px] leading-[1.7] text-[#D1FAE5] [font-family:ui-monospace,'Courier_New',monospace]"
                    >
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

              <div className="min-h-0 flex-1 rounded-lg border border-solid border-[#E5E7EB] bg-white p-5">
                <h3 className="mb-3.5 text-[13px] font-semibold leading-4 text-[#111827]">Extracted payment details</h3>

                <div className="mb-2.5">
                  <div className="mb-1 text-[11px] leading-[0.875rem] text-[#6B7280]">Payment amount (BPR segment)</div>
                  <div className="rounded-md border border-solid border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
                    <p className="text-[13px] font-medium leading-4 text-[#111827]">$12,500.00 USD · ACH transfer</p>
                  </div>
                </div>

                <div className="mb-2.5">
                  <div className="mb-1 text-[11px] leading-[0.875rem] text-[#6B7280]">Payment date</div>
                  <div className="rounded-md border border-solid border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
                    <p className="text-[13px] font-medium leading-4 text-[#111827]">Apr 1, 2025</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="mb-1 text-[11px] leading-[0.875rem] text-[#6B7280]">Invoice line items (RMR segments)</div>
                  <div className="space-y-1.5 rounded-md border border-solid border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5">
                    <ExtractedRow left="INV-20441" amount="$5,000.00" status="matched" />
                    <ExtractedRow left="INV-20455" amount="$4,500.00" status="matched" />
                    <ExtractedRow left="INV-20467" amount="$3,000.00" status="matched" />
                  </div>
                </div>

                <div className="rounded-md bg-[#F0FDF4] px-3 py-2.5">
                  <p className="text-sm leading-5 text-[#111827]">
                    Automation rule matched · Northwind EDI auto-match rule will be applied on continue
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="min-h-0 flex-1 rounded-lg border border-solid border-[#E5E7EB] bg-white p-5">
                <div className="mb-3.5 flex items-center justify-between gap-2">
                  <h2 className="text-[13px] font-semibold leading-4 text-[#111827]">Uploaded: {fileName}</h2>
                  {showPdfPanels ? (
                    <button
                      type="button"
                      className="text-[11px] font-medium leading-[0.875rem] text-[#3B82F6] hover:underline"
                    >
                      View full PDF
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="text-[11px] font-medium leading-[0.875rem] text-[#3B82F6] hover:underline"
                    >
                      View file
                    </button>
                  )}
                </div>

                {showPdfPanels ? (
                  <>
                    <div className="mb-3 min-h-[140px] rounded-md border border-solid border-[#E5E7EB] bg-[#F9FAFB] p-4">
                      <div className="mb-2 text-[11px] leading-[0.875rem] text-[#9CA3AF]">OCR extracted text:</div>
                      <div className="whitespace-pre-wrap text-[12px] leading-[1.6] text-[#374151]">{OCR_SAMPLE}</div>
                    </div>
                    <div className="rounded-md bg-[#F0FDF4] p-2.5">
                      <p className="text-[11px] font-semibold leading-[0.875rem] text-[#16A34A]">
                        OCR complete · 8 entities extracted · no parsing errors
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="min-h-[120px] rounded-md border border-solid border-[#E5E7EB] bg-[#F9FAFB] p-4">
                    <div className="mb-2 text-[11px] leading-[0.875rem] text-[#9CA3AF]">Parsed preview:</div>
                    <p className="text-[12px] leading-[1.6] text-[#374151]">
                      Structured fields extracted from {fileName}. Review totals on the right before continuing.
                    </p>
                  </div>
                )}
              </div>

              <div className="min-h-0 flex-1 rounded-lg border border-solid border-[#E5E7EB] bg-white p-5">
                <h3 className="mb-3.5 text-[13px] font-semibold leading-4 text-[#111827]">
                  Extracted fields — confirm before continuing
                </h3>

                <div className="mb-2.5">
                  <div className="mb-1 text-[11px] leading-[0.875rem] text-[#6B7280]">Payment amount</div>
                  <div className="rounded-md border border-solid border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
                    <p className="text-[13px] font-medium leading-4 text-[#111827]">$10,000.00 USD</p>
                  </div>
                </div>

                <div className="mb-2.5">
                  <div className="mb-1 text-[11px] leading-[0.875rem] text-[#6B7280]">Payment date</div>
                  <div className="rounded-md border border-solid border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
                    <p className="text-[13px] font-medium leading-4 text-[#111827]">Apr 1, 2025</p>
                  </div>
                </div>

                <div className="mb-2.5">
                  <div className="mb-1 text-[11px] leading-[0.875rem] text-[#6B7280]">Invoices referenced</div>
                  <div className="space-y-1.5 rounded-md border border-solid border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
                    <ExtractedRow left="INV-10402" amount="$4,200.00" status="matched" />
                    <ExtractedRow left="INV-10418" amount="$3,100.00" status="matched" />
                    <ExtractedRow left="INV-10440" amount="$2,700.00" status="matched" />
                  </div>
                </div>

                <div>
                  <div className="mb-1 text-[11px] leading-[0.875rem] text-[#6B7280]">Credits referenced</div>
                  <div className="space-y-1.5 rounded-md border border-solid border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
                    <ExtractedRow left="CR-8891" amount="$1,200.00" status="matched" />
                    <ExtractedRow left="CR-9022" amount="$800.00" status="review" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mb-5 rounded-lg border border-solid border-[#BFDBFE] bg-[#EFF6FF] px-[18px] py-3.5">
          <p className="text-xs font-semibold leading-4 text-[#3B82F6]">Suggested allocation ready</p>
          <p className="mt-0.5 text-xs leading-4 text-[#3B82F6]">
            Remittance references matched to invoices — amounts will be pre-filled on the Apply step. You can edit any field.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12.5px] leading-4 text-[#9CA3AF]">Session auto-saved · You can resume later</p>
          <div className="flex w-full shrink-0 items-stretch gap-2 sm:w-auto">
            <button
              type="button"
              onClick={() =>
                router.push(`/allocation/import?customer=${customerQ}&format=${formatActive}`)
              }
              className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-sm border border-brand px-3 py-3 text-[13px] font-medium leading-4 text-brand sm:flex-initial sm:min-w-[10rem]"
            >
              <NavArrowLeft />
              <span>Back</span>
            </button>
            <Link
              href="/allocation/funding"
              className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-sm bg-brand px-3 py-3 text-sm font-medium leading-[1.125rem] text-white sm:flex-initial sm:min-w-[14rem]"
            >
              <span>Continue to Funding Pool</span>
              <NavArrowRight variant="onPrimary" />
            </Link>
          </div>
        </div>

        <div className="mt-4 flex justify-end border-t border-[#F3F4F6] pt-4">
          <Link
            href="/allocation/import/error"
            className="text-xs font-medium text-[#9CA3AF] underline-offset-2 hover:text-[#6B7280] hover:underline"
          >
            Open error preview
          </Link>
        </div>
      </div>
    </div>
  );
}
