"use client";

/**
 * Navigation arrows — paths match `public/assets/icons/arrow left.svg` and
 * `arrow right.svg` (stroke uses `currentColor` for themed buttons).
 */
import { cn } from "@/lib/utils";

export type NavArrowVariant = "default" | "onPrimary" | "muted";

const variantClass: Record<NavArrowVariant, string> = {
  /** Inherits `color` from the parent link/button (e.g. outline `text-[#4F46E5]`). */
  default: "text-inherit",
  /** Solid primary buttons with white label text */
  onPrimary: "text-white",
  /** Disabled / low-emphasis actions */
  muted: "text-inherit opacity-40",
};

function ArrowLeftGlyph({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("block", className)}
      aria-hidden
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ArrowRightGlyph({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("block", className)}
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function NavArrowLeft({
  variant = "default",
  className,
}: {
  variant?: NavArrowVariant;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex shrink-0", variantClass[variant], className)} aria-hidden>
      <ArrowLeftGlyph />
    </span>
  );
}

export function NavArrowRight({
  variant = "default",
  className,
}: {
  variant?: NavArrowVariant;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex shrink-0", variantClass[variant], className)} aria-hidden>
      <ArrowRightGlyph />
    </span>
  );
}
