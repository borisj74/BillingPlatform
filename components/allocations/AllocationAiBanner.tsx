"use client";

import { toast } from "sonner";
import { CopilotMark } from "@/components/layout/paper-sidebar/CopilotMark";

/** S1 / AI Banner — Paper node 8K9-0 */
export function AllocationAiBanner() {
  return (
    <div className="mb-5 flex w-full flex-wrap items-center gap-3.5 rounded-[10px] border border-[#E6E7EB] bg-[#FBFBFB] p-4 antialiased">
      <div className="flex shrink-0 items-center justify-center rounded-md p-1">
        <CopilotMark />
      </div>
      <div className="min-w-0 flex-1 basis-[min(100%,20rem)]">
        <p className="text-[13.5px] font-semibold leading-snug text-[#111827]">
          AI found 3 high-confidence matches ready for auto-allocation
        </p>
        <p className="mt-0.5 text-xs leading-4 text-[#6B7280]">
          Acme Corp ($48k), TechNova ($22.5k), Meridian Health ($31.7k) — 94% avg confidence. Review and apply in one
          click.
        </p>
      </div>
      <button
        type="button"
        className="shrink-0 rounded-[4px] bg-[#4F46E5] px-3.5 py-1.75 text-[12.5px] font-semibold leading-4 text-white hover:bg-[#4338CA]"
        onClick={() => toast.success("Auto-applied allocations (prototype)")}
      >
        Auto-apply all
      </button>
      <button
        type="button"
        className="shrink-0 text-[#616161] hover:text-[#111827]"
        aria-label="Dismiss banner"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
}
