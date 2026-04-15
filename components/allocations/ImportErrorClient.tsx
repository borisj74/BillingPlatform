"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  AllocationBreadcrumbs,
  allocationFlowCrumbs,
} from "@/components/allocations/AllocationBreadcrumbs";
import { AllocationStepper } from "@/components/allocations/AllocationStepper";
import { FileDocumentGlyph } from "@/components/allocations/RemittanceAdviceFileCard";
import { useAllocation } from "@/lib/allocation-store";
import type { Invoice } from "@/lib/mock-data";
import { credits as allCredits, invoices as allInvoices, paymentDetails } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Paper 3N9-0 — unmatched line items (left column) */
const UNMATCHED_LINES = [
  {
    id: "u1",
    lineLabel: "Line item 4 · from remittance document",
    reference: "REF: ACM-Q1-089B",
    amount: "$7,200.00",
  },
  {
    id: "u2",
    lineLabel: "Line item 5 · from remittance document",
    reference: "WIRE REF: 20260301-NW",
    amount: "$3,650.00",
  },
] as const;

const MATCHED_INVOICES = allInvoices.slice(0, 3);

function filterInvoicesByQuery(invoices: Invoice[], query: string): Invoice[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return invoices.filter((inv) => {
    const num = inv.number.toLowerCase();
    const acct = inv.account.toLowerCase();
    if (num.includes(q) || acct.includes(q)) return true;
    const qDigits = q.replace(/\D/g, "");
    if (qDigits.length >= 2) {
      const numDigits = num.replace(/\D/g, "");
      if (numDigits.includes(qDigits)) return true;
    }
    return false;
  });
}

function MatchToInvoiceField({
  lineId,
  value,
  onChange,
}: {
  lineId: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const filtered = useMemo(() => filterInvoicesByQuery(allInvoices, value), [value]);
  const showMenu = menuOpen && value.trim().length > 0;

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function selectInvoice(inv: Invoice) {
    onChange(inv.number);
    setMenuOpen(false);
  }

  return (
    <div ref={containerRef} className="relative min-w-0 flex-1">
      <Input
        id={`inv-${lineId}`}
        role="combobox"
        aria-expanded={showMenu}
        aria-controls={`invoice-list-${lineId}`}
        aria-autocomplete="list"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setMenuOpen(true);
        }}
        onFocus={() => value.trim().length > 0 && setMenuOpen(true)}
        placeholder="Enter invoice number (e.g. INV-2026-0113)"
        autoComplete="off"
        className="h-auto min-h-9 w-full rounded-[7px] border-[1.5px] border-[#FCA5A5] bg-white px-2.75 py-2 text-[13px] placeholder:text-[#9CA3AF] focus-visible:border-brand focus-visible:ring-brand/25"
      />
      {showMenu ? (
        <ul
          id={`invoice-list-${lineId}`}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-md border border-solid border-[#E5E7EB] bg-white py-1 shadow-md"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-[13px] text-[#6B7280]">No invoices match</li>
          ) : (
            filtered.map((inv) => (
              <li key={inv.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-[13px] hover:bg-[#F9FAFB] focus:bg-[#F9FAFB] focus:outline-none"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectInvoice(inv)}
                >
                  <span className="font-medium text-text-primary">{inv.number}</span>
                  <span className="text-[11px] text-[#6B7280]">
                    {inv.account} · {formatUsd(inv.amount)}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}

function AmberWarningTriangle({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      style={{ marginTop: 1 }}
      aria-hidden
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="#D97706" />
      <line x1="12" y1="9" x2="12" y2="13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="17" x2="12.01" y2="17" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function UnmatchedSectionHeaderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#DC2626" />
      <line x1="12" y1="8" x2="12" y2="13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="16" x2="12.01" y2="16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconCheck14() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#16A34A" />
      <path
        d="m9 12 2 2 4-4"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconError14() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#DC2626" />
      <line x1="12" y1="8" x2="12" y2="13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="16" x2="12.01" y2="16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconStar11() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.3L12 17l-6.2 4.2 2.4-7.3L2 9.4h7.6z" fill="#D97706" />
    </svg>
  );
}

function IconError12() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#DC2626" />
      <line x1="12" y1="8" x2="12" y2="13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="16" x2="12.01" y2="16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ImportErrorClient() {
  const router = useRouter();
  const { state, dispatch } = useAllocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileName = state.remittanceFileName ?? "acme_remittance_mar2026.pdf";
  const [invoiceById, setInvoiceById] = useState<Record<string, string>>({});

  const q = encodeURIComponent(state.customer);
  const creditLine = allCredits.map((c) => c.number).join(" · ");

  return (
    <div className="mx-auto flex max-w-[1158px] flex-col gap-4">
      <AllocationBreadcrumbs className="mb-0" items={allocationFlowCrumbs(state.customer, "error")} />
      <AllocationStepper className="mb-0" current={1} />

      <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-col rounded-[10px] border border-solid border-[#E5E7EB] bg-white px-5 pb-5 pt-5">
            <div className="mb-1.5 text-[15px] font-normal leading-[1.125rem] text-[#111827]">Remittance Advice</div>
            <div className="mb-4 text-[13px] leading-4 text-[#6B7280]">
              Upload or paste the remittance document from the customer
            </div>

            <div className="mb-3.5 flex flex-wrap items-center gap-3 rounded-lg border border-solid border-[#D1D5DB] bg-[#F9FAFB] px-3.5 py-[11px]">
              <div className="flex size-[34px] shrink-0 items-center justify-center rounded-lg bg-brand-subtle">
                <FileDocumentGlyph />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] leading-4 text-[#111827]">{fileName}</p>
                <p className="text-[11.5px] leading-[0.875rem] text-[#9CA3AF]">2.4 MB · Uploaded just now</p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-[4px] border border-solid border-[#D1D5DB] bg-white px-2.5 py-1.25 text-[13px] text-[#374151] hover:bg-[#F9FAFB]"
                onClick={() => fileInputRef.current?.click()}
              >
                Replace
              </button>
              <button
                type="button"
                className="shrink-0 rounded-[4px] border border-solid border-[#D1D5DB] bg-white px-2.5 py-1.25 text-[13px] text-[#374151] hover:bg-[#F9FAFB]"
                onClick={() => router.push(`/allocation/import?customer=${q}`)}
              >
                Re-parse Document
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) dispatch({ type: "SET_FILE", payload: f.name });
                  e.target.value = "";
                }}
              />
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-solid border-[#FDE68A] bg-[#FFFBEB] px-3.5 py-3">
              <AmberWarningTriangle />
              <div className="min-w-0">
                <p className="mb-0.5 text-[13.5px] font-semibold leading-[1.125rem] text-[#92400E]">
                  Low confidence parse — manual review required
                </p>
                <p className="text-[12px] leading-[150%] text-[#B45309]">
                  The PDF format was only partially recognised. 3 of 5 line items matched automatically. Resolve the 2
                  unmatched items below before continuing.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-[10px] border-[1.5px] border-solid border-[#FCA5A5] bg-white p-5">
            <div className="flex flex-wrap items-center gap-2">
              <UnmatchedSectionHeaderIcon />
              <div className="text-[15px] font-normal leading-[1.125rem] text-[#111827]">Unmatched Items</div>
              <div className="ml-auto rounded-full bg-[#FEE2E2] px-2.25 py-0.5 text-[11px] leading-[0.875rem] text-[#DC2626]">
                2 items need attention
              </div>
            </div>
            <p className="-mt-1 text-[13px] leading-4 text-[#6B7280]">
              These line items could not be matched to an existing invoice. Enter the correct invoice number or skip the
              item.
            </p>

            {UNMATCHED_LINES.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2.5 rounded-lg border border-solid border-[#FCA5A5] bg-[#FFF7F7] px-4 py-3.5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-block rounded-sm bg-[#FEE2E2] px-2 py-0.5 text-[11px] font-medium leading-[0.875rem] text-[#DC2626]">
                    Unmatched
                  </span>
                  <span className="text-xs leading-4 text-[#6B7280]">{item.lineLabel}</span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.04em] text-[#6B7280]">
                      Reference in document
                    </div>
                    <div className="rounded-md bg-[#F3F4F6] px-2.5 py-1.75">
                      <p className="text-[13px] leading-4 text-[#374151]">{item.reference}</p>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.04em] text-[#6B7280]">
                      Amount
                    </div>
                    <div className="rounded-md bg-[#F3F4F6] px-2.5 py-1.75">
                      <p className="text-[13px] leading-4 text-[#374151]">{item.amount}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.25 block text-xs font-medium text-[#374151]" htmlFor={`inv-${item.id}`}>
                    Match to invoice *
                  </label>
                  <div className="flex flex-wrap items-start gap-2">
                    <MatchToInvoiceField
                      lineId={item.id}
                      value={invoiceById[item.id] ?? ""}
                      onChange={(next) => setInvoiceById((prev) => ({ ...prev, [item.id]: next }))}
                    />
                    <button
                      type="button"
                      className="shrink-0 rounded-[4px] border border-solid border-[#D1D5DB] bg-white px-3 py-2 text-xs font-medium text-[#374151] hover:bg-[#F9FAFB]"
                      onClick={() => {
                        document.getElementById(`inv-${item.id}`)?.focus();
                      }}
                    >
                      Search invoices
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs font-medium text-brand underline decoration-1 underline-offset-2 hover:text-brand/90"
                  >
                    Skip this item
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[10px] border border-solid border-[#E5E7EB] bg-white p-5">
            <div className="mb-4 text-[15px] font-semibold leading-[1.125rem] text-[#111827]">Payment Details</div>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <PaymentField label="Payment Amount" emphasized>
                {formatUsd(paymentDetails.amount)}
              </PaymentField>
              <PaymentField label="Payment Method">{paymentDetails.method}</PaymentField>
              <PaymentField label="Payment Date">{paymentDetails.date}</PaymentField>
              <PaymentField label="Reference / Check #">{paymentDetails.reference}</PaymentField>
            </div>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[300px]">
          <div className="flex flex-col rounded-[10px] border border-solid border-[#FDE68A] bg-[#FFFBEB] p-4">
            <div className="mb-1.5 flex items-center gap-2">
              <AmberWarningTriangle />
              <span className="text-[13.5px] font-normal leading-[1.125rem] text-[#92400E]">Parsing incomplete</span>
            </div>
            <p className="mb-2.5 pl-6 text-[12px] leading-[150%] text-[#92400E]">
              3 of 5 invoices matched · 2 items need manual entry
            </p>
            <div className="flex w-fit items-center gap-1.5 rounded-md bg-[#FEF3C7] px-2.5 py-1.5">
              <IconStar11 />
              <span className="text-[11.5px] font-normal leading-[0.875rem] text-[#D97706]">
                AI parsed · 60% confidence
              </span>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden rounded-[10px] border border-solid border-[#E5E7EB] bg-white">
            <div className="flex items-center border-b border-solid border-[#F3F4F6] px-4 py-[13px]">
              <span className="text-[13.5px] font-normal leading-[1.125rem] text-[#111827]">Invoices Referenced</span>
              <span className="ml-auto rounded-full bg-[#FEF3C7] px-2.25 py-0.5 text-[11.5px] font-normal leading-[0.875rem] text-[#D97706]">
                3 / 5 matched
              </span>
            </div>
            <div className="flex flex-col px-4">
              {MATCHED_INVOICES.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between border-b border-solid border-[#F9FAFB] py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <IconCheck14 />
                    <div>
                      <div className="text-[13px] leading-4 text-[#111827]">{inv.number}</div>
                      <div className="text-[11px] leading-[0.875rem] text-[#9CA3AF]">
                        {state.customer} · {inv.account}
                      </div>
                    </div>
                  </div>
                  <div className="text-[13px] leading-4 text-[#111827]">{formatUsd(inv.amount)}</div>
                </div>
              ))}

              <div className="flex flex-col gap-1 border-b border-solid border-[#F9FAFB] py-2.5">
                <div className="flex justify-between gap-4">
                  <div className="flex items-start gap-2">
                    <IconError14 />
                    <div>
                      <div className="text-[13px] leading-4 text-[#9CA3AF]">ACM-Q1-089B</div>
                      <div className="text-[11px] leading-[0.875rem] text-[#DC2626]">No match found</div>
                    </div>
                  </div>
                  <div className="text-[13px] leading-4 text-[#9CA3AF]">$7,200.00</div>
                </div>
                <div className="pl-[22px]">
                  <span className="inline-block text-[11.5px] font-normal leading-[0.875rem] text-brand">
                    Enter manually ↓
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 py-2.5">
                <div className="flex justify-between gap-4">
                  <div className="flex items-start gap-2">
                    <IconError14 />
                    <div>
                      <div className="text-[13px] leading-4 text-[#9CA3AF]">WIRE REF: 20260301-NW</div>
                      <div className="text-[11px] leading-[0.875rem] text-[#DC2626]">No match found</div>
                    </div>
                  </div>
                  <div className="text-[13px] leading-4 text-[#9CA3AF]">$3,650.00</div>
                </div>
                <div className="pl-[22px]">
                  <span className="inline-block text-[11.5px] font-normal leading-[0.875rem] text-brand">
                    Enter manually ↓
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between border-t border-solid border-[#FCA5A5] bg-[#FFF7F7] px-4 py-2.5">
              <span className="text-[12.5px] font-normal leading-4 text-[#DC2626]">Unresolved</span>
              <span className="text-[13.5px] font-normal leading-[1.125rem] text-[#DC2626]">$10,850.00</span>
            </div>
          </div>

          <div className="flex flex-col rounded-[10px] border border-solid border-[#E5E7EB] bg-white px-4 py-3.5">
            <div className="mb-2.5 flex items-center">
              <span className="text-[13.5px] leading-[1.125rem] text-[#111827]">Credits Referenced</span>
              <span className="ml-auto rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[11px] font-normal leading-[0.875rem] text-[#D97706]">
                Needs lookup
              </span>
            </div>
            <div className="mb-2 rounded-[7px] border border-solid border-[#FDE68A] bg-[#FFFBEB] px-3 py-2.5">
              <p className="text-xs leading-4 text-[#92400E]">{creditLine}</p>
            </div>
            <p className="text-xs leading-4 text-[#6B7280]">
              These credits will be located across accounts in Step 2
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center rounded-lg bg-[#E5E7EB] px-3.25 py-3.25 opacity-60">
              <span className="text-sm font-normal leading-[1.125rem] text-[#6B7280]">
                Continue to Funding Pool →
              </span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <IconError12 />
              <span className="text-xs leading-4 text-[#DC2626]">Resolve 2 unmatched items to continue</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentField({
  label,
  children,
  emphasized,
}: {
  label: string;
  children: ReactNode;
  emphasized?: boolean;
}) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-medium leading-4 text-[#374151]">{label}</div>
      <div className="rounded-[7px] border border-solid border-[#D1D5DB] bg-[#F9FAFB] px-3 py-2.25 text-[13.5px] leading-[1.125rem] text-[#374151]">
        <span className={cn(emphasized && "font-semibold text-[#111827]")}>{children}</span>
      </div>
    </div>
  );
}
