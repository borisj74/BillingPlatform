"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function FileDocumentGlyph({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 text-brand", className)}
      aria-hidden
    >
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export interface RemittanceAdviceFileCardProps {
  fileName: string;
  /** e.g. "2.4 MB · Uploaded just now" */
  metaLine: string;
  customerQuery: string;
  onReplace: (fileName: string) => void;
  className?: string;
}

/** Paper FMR-0 — Remittance Advice + uploaded file row (Replace / Re-parse). */
export function RemittanceAdviceFileCard({
  fileName,
  metaLine,
  customerQuery,
  onReplace,
  className,
}: RemittanceAdviceFileCardProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-[10px] border border-[#E5E7EB] bg-white px-5 py-4",
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="mb-1.5 text-[15px] font-semibold leading-[1.125rem] text-[#111827]">Remittance Advice</h2>
          <p className="mb-0 text-[13px] leading-4 text-[#6B7280]">
            Upload or paste the remittance document from the customer
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] px-3.5 py-[11px]">
          <div className="flex size-[34px] shrink-0 items-center justify-center rounded-lg bg-brand-subtle">
            <FileDocumentGlyph />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] leading-4 text-[#111827]">{fileName}</p>
            <p className="text-[11.5px] leading-[0.875rem] text-[#9CA3AF]">{metaLine}</p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-[4px] border border-[#D1D5DB] bg-white px-2.5 py-1.25 text-[13px] text-[#374151] hover:bg-[#F9FAFB]"
            onClick={() => inputRef.current?.click()}
          >
            Replace
          </button>
          <button
            type="button"
            className="shrink-0 rounded-[4px] border border-[#D1D5DB] bg-white px-2.5 py-1.25 text-[13px] text-[#374151] hover:bg-[#F9FAFB]"
            onClick={() => router.push(`/allocation/import?customer=${encodeURIComponent(customerQuery)}`)}
          >
            Re-parse Document
          </button>
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onReplace(f.name);
              e.target.value = "";
            }}
          />
        </div>
      </div>
    </div>
  );
}
