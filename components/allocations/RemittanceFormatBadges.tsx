"use client";

import { cn } from "@/lib/utils";
import type { RemittanceFormatId } from "@/lib/remittance-format";
import { REMITTANCE_FORMAT_OPTIONS } from "@/lib/remittance-format";

export interface RemittanceFormatBadgesProps {
  /** Which format is highlighted as the current source; `null` = none emphasized. */
  activeId: RemittanceFormatId | null;
  /** Accessible description of the badge group (e.g. tray purpose). */
  "aria-label": string;
  className?: string;
}

/**
 * Paper J43-0 — format tray: informational badges only (not controls).
 * Tray `#F6F7FE`; active: `#F0F6FF` + `#3B82F6` border; inactive: white + `#E5E1F0`.
 */
export function RemittanceFormatBadges({ activeId, "aria-label": ariaLabel, className }: RemittanceFormatBadgesProps) {
  const currentLabel = activeId
    ? (REMITTANCE_FORMAT_OPTIONS.find((o) => o.id === activeId)?.label ?? activeId)
    : "not set";

  return (
    <div
      className={cn("mb-5 flex flex-wrap gap-2 rounded-md bg-[#F6F7FE] px-1.5 py-1", className)}
      role="group"
      aria-label={`${ariaLabel} Current format: ${currentLabel}.`}
    >
      {REMITTANCE_FORMAT_OPTIONS.map((opt) => {
        const active = activeId === opt.id;
        return (
          <span
            key={opt.id}
            className={cn(
              "inline-flex select-none rounded-lg border px-2 py-1.5 text-xs leading-4",
              active
                ? "border-[#3B82F6] bg-[#F0F6FF] font-normal text-[#3B82F6]"
                : "border-[#E5E1F0] bg-white text-[#6B7280]",
            )}
            aria-current={active ? "true" : undefined}
          >
            {opt.label}
          </span>
        );
      })}
    </div>
  );
}
