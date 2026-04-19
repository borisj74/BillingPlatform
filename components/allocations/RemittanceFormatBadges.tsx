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
  /** When set, each pill is a control that calls this with the chosen format. */
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
  const interactive = Boolean(onSelect);

  return (
    <div
      className={cn("mb-5 flex flex-wrap gap-2 rounded-md bg-[#F6F7FE] px-1.5 py-1", className)}
      role={interactive ? "radiogroup" : "list"}
      aria-label={ariaLabel}
    >
      {REMITTANCE_FORMAT_OPTIONS.map((opt) => {
        const active = activeId === opt.id;
        const pillClass = cn(
          "inline-flex min-h-9 min-w-0 items-center justify-center rounded-lg border px-2 py-1.5 text-xs leading-4 transition-colors",
          active
            ? "border-[#3B82F6] bg-[#F0F6FF] font-normal text-[#3B82F6]"
            : "border-[#E5E1F0] bg-white text-[#6B7280]",
          interactive &&
            "cursor-pointer hover:border-[#93C5FD] hover:bg-[#EFF6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/35",
        );

        if (interactive && onSelect) {
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={0}
              onClick={() => onSelect(opt.id)}
              className={pillClass}
            >
              {opt.label}
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
