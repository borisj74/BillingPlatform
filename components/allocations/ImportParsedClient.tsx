"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  AllocationBreadcrumbs,
  allocationFlowCrumbs,
} from "@/components/allocations/AllocationBreadcrumbs";
import { AllocationStepper } from "@/components/allocations/AllocationStepper";
import { RemittanceAdviceFileCard } from "@/components/allocations/RemittanceAdviceFileCard";
import { useAllocation } from "@/lib/allocation-store";
import { credits as allCredits, invoices as allInvoices, paymentDetails } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

const PARSED_INVOICES = allInvoices.slice(0, 5);
const AI_CONFIDENCE = 99;

function ParsedSuccessIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
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

function AiSparkStar() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.3L12 17l-6.2 4.2 2.4-7.3L2 9.4h7.6z" fill="#4F46E5" />
    </svg>
  );
}

export function ImportParsedClient() {
  const { state, dispatch } = useAllocation();
  const fileName = state.remittanceFileName ?? "remittance-sample.csv";
  const invoiceTotal = PARSED_INVOICES.reduce((s, i) => s + i.amount, 0);
  const creditCount = allCredits.length;

  return (
    <div className="mx-auto flex max-w-[1158px] flex-col gap-4">
      <AllocationBreadcrumbs className="mb-0" items={allocationFlowCrumbs(state.customer, "remittance")} />
      <AllocationStepper className="mb-0" current={1} />

      <RemittanceAdviceFileCard
        fileName={fileName}
        metaLine="2.4 MB · Uploaded just now"
        customerQuery={state.customer}
        onReplace={(name) => dispatch({ type: "SET_FILE", payload: name })}
      />

      <div className="flex flex-wrap items-start gap-3 rounded-[10px] border border-[#BBF7D0] bg-[#F0FDF4] p-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <ParsedSuccessIcon />
            <p className="text-[13.5px] font-semibold leading-[1.125rem] text-[#15803D]">
              Remittance parsed successfully
            </p>
          </div>
          <p className="ml-6 mt-1 text-xs leading-4 text-[#166534]">
            {PARSED_INVOICES.length} invoices · {creditCount} credits detected
          </p>
        </div>
        <div className="mt-2 flex shrink-0 items-center gap-1.5 rounded-md bg-brand-subtle px-2.5 py-1.5 sm:mt-0">
          <AiSparkStar />
          <span className="text-[11.5px] font-semibold leading-[0.875rem] text-brand">
            AI parsed · {AI_CONFIDENCE}% confidence
          </span>
        </div>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[1fr_300px]">
        <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-5">
          <h2 className="mb-4 text-[15px] font-semibold leading-[1.125rem] text-[#111827]">Payment Details</h2>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <PaymentField label="Payment Amount" emphasized>
              {formatUsd(paymentDetails.amount)}
            </PaymentField>
            <PaymentField label="Payment Method">{paymentDetails.method}</PaymentField>
            <PaymentField label="Payment Date">{paymentDetails.date}</PaymentField>
            <PaymentField label="Reference / Check #">{paymentDetails.reference}</PaymentField>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 lg:w-[300px]">
          <div className="overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white">
            <div className="flex items-center border-b border-[#F3F4F6] px-4 py-3.5">
              <span className="text-[13.5px] font-semibold leading-[1.125rem] text-[#111827]">
                Invoices Referenced
              </span>
              <span className="ml-auto rounded-[20px] bg-brand-subtle px-2 py-0.5 text-[11.5px] font-semibold leading-[0.875rem] text-brand">
                {PARSED_INVOICES.length} invoices
              </span>
            </div>
            <div className="px-4">
              {PARSED_INVOICES.map((inv, idx) => (
                <div
                  key={inv.id}
                  className={cn(
                    "flex justify-between gap-3 py-2.5",
                    idx < PARSED_INVOICES.length - 1 && "border-b border-[#F9FAFB]",
                  )}
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium leading-4 text-[#111827]">{inv.number}</p>
                    <p className="text-[11.5px] leading-[0.875rem] text-[#9CA3AF]">
                      {state.customer} · {inv.account}
                    </p>
                  </div>
                  <p className="shrink-0 text-[13px] font-semibold leading-4 text-[#111827]">
                    {formatUsd(inv.amount)}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5">
              <span className="text-[12.5px] font-medium leading-4 text-[#6B7280]">Total Invoiced</span>
              <span className="text-[13.5px] font-bold leading-[1.125rem] text-[#111827]">
                {formatUsd(invoiceTotal)}
              </span>
            </div>
          </div>

          <div className="rounded-[10px] border border-[#E5E7EB] bg-white px-4 py-3.5">
            <div className="mb-2.5 flex items-center">
              <span className="text-[13.5px] leading-[1.125rem] text-[#111827]">Credits Referenced</span>
              <span className="ml-auto rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[11px] leading-[0.875rem] font-medium text-[#D97706]">
                Needs lookup
              </span>
            </div>
            <div className="mb-2 rounded-[7px] border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2.5">
              <p className="text-xs leading-4 text-[#92400E]">
                {allCredits.map((c) => c.number).join(" · ")}
              </p>
            </div>
            <p className="text-xs leading-4 text-[#6B7280]">
              These credits will be located across accounts in Step 2
            </p>
          </div>

          <Link
            href="/allocation/funding"
            className="flex items-center justify-center gap-1 rounded-[4px] bg-brand px-3 py-3.5 text-sm font-medium text-white hover:bg-brand/90"
          >
            Continue to Funding Pool
            <span aria-hidden>→</span>
          </Link>

          <Link
            href="/allocation/import/error"
            className="text-center text-sm font-medium text-[#6B7280] underline-offset-2 hover:text-[#374151] hover:underline"
          >
            Open error preview
          </Link>
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
      <div
        className={cn(
          "rounded-[7px] border border-[#D1D5DB] bg-[#F9FAFB] px-3 py-[9px] text-[13.5px] leading-[1.125rem] text-[#374151]",
          emphasized && "font-semibold text-[#111827]",
        )}
      >
        {children}
      </div>
    </div>
  );
}
