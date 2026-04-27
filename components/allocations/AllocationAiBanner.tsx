"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CopilotMark } from "@/components/layout/paper-sidebar/CopilotMark";

const DISMISS_STORAGE_KEY = "allocation-hub-ai-banner-dismissed" as const;

/** S1 / AI Banner — Paper node 7DV-0 (Allocation Hub). */
export function AllocationAiBanner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_STORAGE_KEY) === "1") {
        setVisible(false);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISS_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="mb-5 flex w-full items-center gap-3.5 rounded-[10px] border border-[#E6E7EB] bg-[#FBFBFB] p-4 antialiased">
      <div className="flex shrink-0 items-center justify-center rounded-md p-1">
        <CopilotMark />
      </div>
      <div className="min-w-0 grow basis-[0%]">
        <p className="text-[13.5px] font-semibold leading-[1.125rem] text-[#111827]">
          AI found 3 high-confidence matches ready for auto-allocation
        </p>
        <p className="mt-0.5 text-xs leading-4 text-[#6B7280]">
          Acme Corp ($48k), TechNova ($22.5k), Meridian Health ($31.7k) — 94% avg confidence. Review and apply in one click.
        </p>
      </div>
      <Link
        href="/allocation/suggestions"
        className="shrink-0 rounded-[7px] bg-[#4F46E5] px-3.5 py-1.75 text-[12.5px] font-semibold leading-4 text-white hover:bg-[#4338CA]"
      >
        Auto-apply all
      </Link>
      <button
        type="button"
        onClick={dismiss}
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
