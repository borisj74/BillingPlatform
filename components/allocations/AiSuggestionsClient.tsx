"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const CopilotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" width="20" height="20" className="shrink-0">
    <defs>
      <radialGradient id="cpa" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-10.961 -13.389 12.59 -10.306 38.005 20.514)">
        <stop offset=".096" stopColor="#00AEFF" />
        <stop offset=".773" stopColor="#2253CE" />
        <stop offset="1" stopColor="#0736C4" />
      </radialGradient>
      <radialGradient id="cpb" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(51.84 -28.201 27.85) scale(15.991 15.512)">
        <stop stopColor="#FFB657" />
        <stop offset=".634" stopColor="#FF5F3D" />
        <stop offset=".923" stopColor="#C02B3C" />
      </radialGradient>
      <radialGradient id="cpc" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(109.274 16.301 20.802) scale(38.387 45.987)">
        <stop offset=".066" stopColor="#8C48FF" />
        <stop offset=".5" stopColor="#F2598A" />
        <stop offset=".896" stopColor="#FFB152" />
      </radialGradient>
      <linearGradient id="cpd" x1="12.5" y1="7.5" x2="14.788" y2="33.975" gradientUnits="userSpaceOnUse">
        <stop offset=".156" stopColor="#0D91E1" />
        <stop offset=".487" stopColor="#52B471" />
        <stop offset=".652" stopColor="#98BD42" />
        <stop offset=".937" stopColor="#FFC800" />
      </linearGradient>
      <linearGradient id="cpe" x1="14.5" y1="4" x2="15.75" y2="32.885" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3DCBFF" />
        <stop offset=".247" stopColor="#0588F7" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="cpf" x1="42.586" y1="13.346" x2="42.569" y2="21.215" gradientUnits="userSpaceOnUse">
        <stop offset=".058" stopColor="#F8ADFA" />
        <stop offset=".708" stopColor="#A86EDD" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d="M34.142 7.325A4.63 4.63 0 0029.7 4H28.35a4.63 4.63 0 00-4.554 3.794L21.48 20.407l.575-1.965a4.63 4.63 0 014.444-3.33h7.853l3.294 1.282 3.175-1.283h-.926a4.63 4.63 0 01-4.443-3.325l-1.31-4.461z" fill="url(#cpa)" />
    <path d="M14.33 40.656A4.63 4.63 0 0018.779 44h2.87a4.63 4.63 0 004.629-4.51l.312-12.163-.654 2.233a4.63 4.63 0 01-4.443 3.329h-7.919l-2.823-1.532-3.057 1.532h.912a4.63 4.63 0 014.447 3.344l1.279 4.423z" fill="url(#cpb)" />
    <path d="M29.5 4H13.46c-4.583 0-7.332 6.057-9.165 12.113C2.123 23.29-.72 32.885 7.503 32.885h6.925a4.63 4.63 0 004.456-3.358 2078.617 2078.617 0 014.971-17.156c.843-2.843 1.544-5.284 2.621-6.805C27.08 4.714 28.086 4 29.5 4z" fill="url(#cpd)" />
    <path d="M29.5 4H13.46c-4.583 0-7.332 6.057-9.165 12.113C2.123 23.29-.72 32.885 7.503 32.885h6.925a4.63 4.63 0 004.456-3.358 2078.617 2078.617 0 014.971-17.156c.843-2.843 1.544-5.284 2.621-6.805C27.08 4.714 28.086 4 29.5 4z" fill="url(#cpe)" />
    <path d="M18.498 44h16.04c4.582 0 7.332-6.058 9.165-12.115 2.171-7.177 5.013-16.775-3.208-16.775h-6.926a4.63 4.63 0 00-4.455 3.358 2084.036 2084.036 0 01-4.972 17.16c-.842 2.843-1.544 5.285-2.62 6.806-.604.852-1.61 1.566-3.024 1.566z" fill="url(#cpc)" />
    <path d="M18.498 44h16.04c4.582 0 7.332-6.058 9.165-12.115 2.171-7.177 5.013-16.775-3.208-16.775h-6.926a4.63 4.63 0 00-4.455 3.358 2084.036 2084.036 0 01-4.972 17.16c-.842 2.843-1.544 5.285-2.62 6.806-.604.852-1.61 1.566-3.024 1.566z" fill="url(#cpf)" />
  </svg>
);

export function AiSuggestionsClient() {
  return (
    <div className="flex min-h-screen flex-col gap-[14px] bg-[#F9FAFB] px-4 py-[22px] antialiased md:px-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-[5px]">
        <span className="text-[12px] leading-[16px] text-[#9CA3AF]">Payments</span>
        <span className="text-[12px] leading-[16px] text-[#9CA3AF]">/</span>
        <span className="text-[12px] leading-[16px] text-[#9CA3AF]">New Allocation — Acme Corp</span>
        <span className="text-[12px] leading-[16px] text-[#9CA3AF]">/</span>
        <span className="text-[12px] font-medium leading-[16px] text-[#374151]">AI Insights</span>
      </div>

      {/* Stepper */}
      <div className="flex items-center rounded-[10px] border border-[#E5E7EB] bg-white px-6 py-4">
        <div className="flex items-center gap-[10px]">
          <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#4F46E5]">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" xmlns="http://www.w3.org/2000/svg">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase leading-[12px] tracking-[0.06em] text-[#9CA3AF]">Step 1</div>
            <div className="text-[12px] leading-[16px] text-[#9CA3AF] line-through decoration-[1px]">Remittance Details</div>
          </div>
        </div>
        <div className="mx-4 h-[1.5px] flex-1 bg-[#4F46E5]" />
        <div className="flex items-center gap-[10px]">
          <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#4F46E5]">
            <span className="text-[12px] font-bold leading-[16px] text-white">2</span>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase leading-[12px] tracking-[0.06em] text-[#4F46E5]">Step 2</div>
            <div className="text-[13px] font-semibold leading-[16px] text-[#111827]">Build Funding Pool</div>
          </div>
        </div>
        <div className="mx-4 h-[1.5px] flex-1 bg-[#E5E7EB]" />
        <div className="flex items-center gap-[10px]">
          <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full border-2 border-[#D1D5DB] bg-white">
            <span className="text-[12px] font-semibold leading-[16px] text-[#9CA3AF]">3</span>
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase leading-[12px] tracking-[0.06em] text-[#9CA3AF]">Step 3</div>
            <div className="text-[12px] leading-[16px] text-[#9CA3AF]">Apply to Invoices</div>
          </div>
        </div>
        <div className="mx-4 h-[1.5px] flex-1 bg-[#E5E7EB]" />
        <div className="flex items-center gap-[10px]">
          <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full border-2 border-[#D1D5DB] bg-white">
            <span className="text-[12px] font-semibold leading-[16px] text-[#9CA3AF]">4</span>
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase leading-[12px] tracking-[0.06em] text-[#9CA3AF]">Step 4</div>
            <div className="text-[12px] leading-[16px] text-[#9CA3AF]">Review &amp; Confirm</div>
          </div>
        </div>
      </div>

      {/* AI banner */}
      <div className="flex items-center gap-[14px] rounded-[10px] border border-[#E6E7EB] bg-[#FBFBFB] px-4 py-4">
        <div className="shrink-0 rounded-[6px] p-1">
          <CopilotIcon />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13.5px] font-semibold leading-[18px] text-[#111827]">AI-powered suggestions ready</div>
          <div className="mt-[2px] text-[12px] leading-[16px] text-[#6B7280]">
            Based on Acme Corp's payment history and remittance data, 3 intelligent suggestions are available to speed up allocation.
          </div>
        </div>
        <button className="shrink-0 rounded-[7px] bg-[#4F46E5] px-[18px] py-[9px] text-[13px] font-semibold leading-[16px] text-white hover:bg-[#4338CA]">
          Apply all suggestions
        </button>
        <button className="shrink-0 text-[#616161] hover:text-[#374151]" aria-label="Dismiss banner">
          <X size={16} />
        </button>
      </div>

      {/* Three suggestion cards */}
      <div className="flex items-stretch gap-[14px]">

        {/* Card 1 — Predictive Match */}
        <div className="flex flex-1 flex-col gap-[14px] rounded-[10px] border border-[#E5E7EB] bg-white px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="rounded-[4px] bg-[#EEF2FF] px-2 py-[3px] text-[10px] font-bold uppercase leading-[12px] tracking-[0.1em] text-[#4F46E5]">
              Predictive Match
            </span>
            <span className="rounded-full bg-[#DCFCE7] px-[10px] py-[3px] text-[12px] font-semibold leading-[16px] text-[#16A34A]">
              98% confidence
            </span>
          </div>

          <div>
            <div className="mb-[6px] text-[15px] font-semibold leading-[18px] text-[#111827]">Auto-apply remittance lines</div>
            <div className="text-[12.5px] leading-[19px] text-[#6B7280]">
              AI matched all 3 remittance line items to open invoices using historical patterns. Suggested allocation: $10,000 across INV-10402, INV-10418, INV-10440.
            </div>
          </div>

          <div className="flex flex-col gap-[6px] rounded-[7px] border border-[#F3F4F6] bg-[#F9FAFB] px-3 py-3">
            <div className="flex justify-between">
              <span className="text-[12.5px] leading-[16px] text-[#6B7280]">INV-10402</span>
              <span className="text-[12.5px] font-medium leading-[16px] text-[#111827]">$4,200.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12.5px] leading-[16px] text-[#6B7280]">INV-10418</span>
              <span className="text-[12.5px] font-medium leading-[16px] text-[#111827]">$3,100.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12.5px] leading-[16px] text-[#6B7280]">INV-10440</span>
              <span className="text-[12.5px] font-medium leading-[16px] text-[#111827]">$2,700.00</span>
            </div>
          </div>

          <div className="mt-auto flex gap-2">
            <button className="flex flex-1 items-center justify-center rounded-[7px] border border-[#E5E7EB] bg-white py-2 text-[13px] font-medium leading-[16px] text-[#6B7280] hover:bg-[#F9FAFB]">
              Review
            </button>
            <button className="flex flex-1 items-center justify-center rounded-[7px] border border-[#4F46E5] bg-[#4F46E5] py-2 text-[13px] font-semibold leading-[16px] text-white hover:bg-[#4338CA]">
              Apply suggestion
            </button>
          </div>
        </div>

        {/* Card 2 — Smart Workflow */}
        <div className="flex flex-1 flex-col gap-[14px] rounded-[10px] border border-[#E5E7EB] bg-white px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="rounded-[4px] bg-[#EDE9FE] px-2 py-[3px] text-[10px] font-bold uppercase leading-[12px] tracking-[0.1em] text-[#7C3AED]">
              Smart Workflow
            </span>
            <span className="rounded-full bg-[#EDE9FE] px-[10px] py-[3px] text-[12px] font-semibold leading-[16px] text-[#7C3AED]">
              12 prior matches
            </span>
          </div>

          <div>
            <div className="mb-[6px] text-[15px] font-semibold leading-[18px] text-[#111827]">Recurring pattern detected</div>
            <div className="text-[12.5px] leading-[19px] text-[#6B7280]">
              Acme Corp typically pays invoices in batches by billing cycle. This payment matches the Apr cycle. Save as automation rule for future allocations.
            </div>
          </div>

          <div className="rounded-[7px] border border-[#DDD6FE] bg-[#F5F3FF] px-3 py-3">
            <div className="mb-[6px] text-[10px] font-semibold uppercase leading-[12px] tracking-[0.06em] text-[#7C3AED]">
              Suggested rule
            </div>
            <div className="text-[12px] leading-[18px] text-[#4C1D95]">
              When payment from Acme ≥ $8,000 in first 15 days of month → auto-match by billing cycle, apply credits first.
            </div>
          </div>

          <div className="mt-auto flex gap-2">
            <button className="flex flex-1 items-center justify-center rounded-[7px] border border-[#E5E7EB] bg-white py-[9px] text-[13px] font-medium leading-[16px] text-[#6B7280] hover:bg-[#F9FAFB]">
              Dismiss
            </button>
            <button className="flex flex-1 items-center justify-center rounded-[7px] border border-[#7C3AEC] bg-[#7C3AED] py-[9px] text-[13px] font-semibold leading-[16px] text-white hover:bg-[#6D28D9]">
              Save as rule
            </button>
          </div>
        </div>

        {/* Card 3 — Anomaly Alert */}
        <div className="flex flex-1 flex-col gap-[14px] rounded-[10px] border border-[#FDE68A] bg-white px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="rounded-[4px] bg-[#FEF3C7] px-2 py-[3px] text-[10px] font-bold uppercase leading-[12px] tracking-[0.1em] text-[#92400E]">
              Anomaly Alert
            </span>
            <span className="rounded-full bg-[#FEF3C7] px-[10px] py-[3px] text-[12px] font-semibold leading-[16px] text-[#D97706]">
              Review needed
            </span>
          </div>

          <div>
            <div className="mb-[6px] text-[15px] font-semibold leading-[18px] text-[#111827]">Unusual credit usage</div>
            <div className="text-[12.5px] leading-[19px] text-[#6B7280]">
              CR-9022 ($800) is being applied alongside a full-payment wire. Historically this customer only uses credits when underpaying. Flagged for review.
            </div>
          </div>

          <div className="rounded-[7px] border border-[#FDE68A] bg-[#FFFBEB] px-3 py-3">
            <div className="text-[12px] leading-[18px] text-[#92400E]">
              This pattern appears in 2 of 47 prior allocations. Proceeding is allowed — just verify intent with the AR team.
            </div>
          </div>

          <div className="mt-auto flex gap-2">
            <button className="flex flex-1 items-center justify-center rounded-[7px] border border-[#E5E7EB] bg-white py-[9px] text-[13px] font-medium leading-[16px] text-[#6B7280] hover:bg-[#F9FAFB]">
              Ignore
            </button>
            <button className="flex flex-1 items-center justify-center rounded-[7px] border border-[#D37407] bg-[#D97706] py-[9px] text-[13px] font-semibold leading-[16px] text-white hover:bg-[#B45309]">
              Flag for AR team
            </button>
          </div>
        </div>

      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] leading-[16px] text-[#9CA3AF]">Session auto-saved · You can resume later</span>
        <div className="flex shrink-0 gap-2">
          <Link
            href="/allocation/funding"
            className="flex min-w-[120px] items-center justify-center rounded-[4px] border border-[#4F46E5] bg-white px-[13px] py-[13px] text-center text-[13px] font-medium leading-[16px] text-[#4F46E5] hover:bg-[#EEF2FF]"
          >
            ← Back
          </Link>
          <Link
            href="/allocation/apply"
            className="flex min-w-[220px] items-center justify-center rounded-[4px] bg-[#4F46E5] px-[13px] py-[13px] text-center text-[14px] font-medium leading-[18px] text-white hover:bg-[#4338CA]"
          >
            Continue to Apply Invoices →
          </Link>
        </div>
      </div>

    </div>
  );
}
