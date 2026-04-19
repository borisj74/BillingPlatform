"use client";

import { cn } from "@/lib/utils";
import type { RemittanceFormatId } from "@/lib/remittance-format";
import { REMITTANCE_FORMAT_OPTIONS } from "@/lib/remittance-format";

export interface RemittanceFormatBadgesProps {
  /** Which format is highlighted; `null` = all inactive. */
  activeId: RemittanceFormatId | null;
  /** Accessible name for the badge group. */
  "aria-label": string;
  className?: string;
  /** Paper J43-0 — when set, pills act as format toggles. */
  onSelect?: (id: RemittanceFormatId) => void;
}

/**
 * Paper J43-0 — tray `#F6F7FE`; active EDI: `#F0F6FF` + `#3B82F6` border; inactive: white + `#E5E1F0`.
 */
export function RemittanceFormatBadges({
  activeId,
  "aria-label": ariaLabel,
  className,
  onSelect,
}: RemittanceFormatBadgesProps) {
  return (
    <div
      className={cn("mb-5 flex flex-wrap gap-2 rounded-md bg-[#F6F7FE] px-1.5 py-1", className)}
      role="list"
      aria-label={ariaLabel}
    >
      {REMITTANCE_FORMAT_OPTIONS.map((opt) => {
        const active = activeId === opt.id;
        const pillClass = cn(
          "inline-flex rounded-lg border px-2 py-1.5 text-xs leading-4",
          active
            ? "border-[#3B82F6] bg-[#F0F6FF] font-normal text-[#3B82F6]"
            : "border-[#E5E1F0] bg-white text-[#6B7280]",
        );

        if (onSelect) {
          return (
            <button
              key={opt.id}
              type="button"
              role="listitem"
              aria-current={active ? "true" : undefined}
              onClick={() => onSelect(opt.id)}
              className="inline-flex rounded-lg border-0 bg-transparent p-0"
            >
              <span className={pillClass}>{opt.label}</span>
            </button>
          );
        }

        return (
          <span key={opt.id} role="listitem" aria-current={active ? "true" : undefined} className={pillClass}>
            {opt.label}
          </span>
        );
      })}
    </div>
  );
}
