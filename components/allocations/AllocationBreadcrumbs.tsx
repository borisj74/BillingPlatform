"use client";

import Link from "next/link";
import { Fragment, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

/** Last segment label matches Paper node 1HB-0 per allocation screen. */
export type AllocationBreadcrumbPage =
  | "remittance"
  | "funding"
  | "apply"
  | "review"
  | "error";

const PAGE_LABEL: Record<AllocationBreadcrumbPage, string> = {
  remittance: "Remittance Details",
  funding: "Funding Pool",
  apply: "Apply to Invoices",
  review: "Review & Confirm",
  error: "Import Error",
};

export interface AllocationBreadcrumbsProps {
  items: Crumb[];
  className?: string;
  /** Paper 2UT-0 — SLA pill after the last crumb. */
  slaBadge?: string;
  /** Paper FP-0 — `Payments / … / Funding Pool / Invoices` (ellipsis hides middle segments). */
  variant?: "default" | "applyFp" | "reviewFp";
}

const crumbLinkClass =
  "rounded-sm text-[#9CA3AF] transition-colors hover:text-[#6B7280] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const separator = (
  <span className="text-[#D1D5DB]" aria-hidden>
    /
  </span>
);

function EllipsisMenu({ items }: { items: Crumb[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    function handlePointer(e: MouseEvent | PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handlePointer);
      document.addEventListener("keydown", handleKey);
      return () => {
        document.removeEventListener("mousedown", handlePointer);
        document.removeEventListener("keydown", handleKey);
      };
    }
  }, [open]);

  if (items.length === 0) return null;

  return (
    <div className="relative inline-flex" ref={rootRef}>
      <button
        type="button"
        id={`${menuId}-trigger`}
        className={cn(
          crumbLinkClass,
          "inline-flex min-h-[1.25rem] min-w-[1.25rem] items-center justify-center px-0.5 font-semibold text-[#9CA3AF]",
          open && "text-[#6B7280]",
        )}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={open ? `${menuId}-menu` : undefined}
        aria-label="Open hidden breadcrumb levels"
        onClick={() => setOpen((o) => !o)}
      >
        …
      </button>
      {open ? (
        <div
          id={`${menuId}-menu`}
          role="menu"
          aria-labelledby={`${menuId}-trigger`}
          className="absolute left-0 top-full z-50 mt-1 min-w-[14rem] rounded-md border border-[#E5E7EB] bg-white py-1 shadow-[0_10px_40px_-10px_rgba(17,24,39,0.2)]"
        >
          {items.map((item, i) => (
            <div key={`${item.label}-${i}`} role="none">
              {item.href ? (
                <Link
                  role="menuitem"
                  href={item.href}
                  className="block px-3 py-2 text-[13px] leading-snug text-[#374151] hover:bg-[#F9FAFB] focus-visible:bg-[#F9FAFB] focus-visible:outline-none"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  role="menuitem"
                  className="block px-3 py-2 text-[13px] leading-snug text-[#9CA3AF]"
                  aria-disabled
                >
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

interface SlaBadgeProps {
  label: string;
}

function SlaBadge({ label }: SlaBadgeProps) {
  return (
    <div className="ml-1.5 flex items-center gap-1 rounded-[20px] border border-[#FDE68A] bg-[#FEF3C7] px-2.5 py-0.5">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path
          d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
          fill="#D97706"
        />
        <line x1="12" y1="9" x2="12" y2="13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="17" r="1" fill="#FFFFFF" />
      </svg>
      <span className="shrink-0 text-[11px] font-semibold text-[#D97706]">{label}</span>
    </div>
  );
}

function CrumbLinkOrText({ item, current }: { item: Crumb; current?: boolean }) {
  if (current) {
    return (
      <span className="font-medium text-[#374151]" aria-current="page">
        {item.label}
      </span>
    );
  }
  if (item.href) {
    return (
      <Link href={item.href} className={crumbLinkClass}>
        {item.label}
      </Link>
    );
  }
  return <span className="text-[#9CA3AF]">{item.label}</span>;
}

/**
 * Full hierarchy for analytics and IA. When there are more than four segments, the
 * UI shows four slots: first, second, ellipsis menu (hidden middle), last (current).
 */
export function allocationFlowCrumbs(
  customer: string,
  page: AllocationBreadcrumbPage,
): Crumb[] {
  const q = encodeURIComponent(customer);
  return [
    { label: "Accounts", href: "/accounts" },
    { label: "Payments", href: "/accounts" },
    { label: "Payment Allocations", href: "/accounts" },
    { label: `New Allocation — ${customer}`, href: `/allocation/import/parsed?format=pdf&customer=${q}` },
    { label: PAGE_LABEL[page] },
  ];
}

/** Paper IX3-0 — Import remittance screens (Payments → … → New Allocation); no Accounts prefix. */
export function allocationImportPaperCrumbs(customer: string): Crumb[] {
  const q = encodeURIComponent(customer);
  return [
    { label: "Payments", href: "/accounts" },
    { label: "Payment Allocations", href: "/accounts" },
    { label: `New Allocation — ${customer}`, href: `/allocation/import/parsed?format=pdf&customer=${q}` },
  ];
}

export function allocationApplyInvoicesCrumbs(customer: string): Crumb[] {
  const q = encodeURIComponent(customer);
  return [
    { label: "Accounts", href: "/accounts" },
    { label: "Payments", href: "/accounts" },
    { label: "Payment Allocations", href: "/accounts" },
    { label: `New Allocation — ${customer}`, href: `/allocation/import/parsed?format=pdf&customer=${q}` },
    { label: "Funding Pool", href: "/allocation/funding" },
    { label: "Invoices" },
  ];
}

/** Paper FP-0 — Apply to Invoices (no Accounts prefix; ellipsis before Funding Pool). */
export function allocationApplyPaperCrumbs(customer: string): Crumb[] {
  const q = encodeURIComponent(customer);
  return [
    { label: "Payments", href: "/accounts" },
    { label: "Payment Allocations", href: "/accounts" },
    { label: `New Allocation — ${customer}`, href: `/allocation/import/parsed?format=pdf&customer=${q}` },
    { label: "Funding Pool", href: "/allocation/funding" },
    { label: "Invoices" },
  ];
}

export function allocationReviewConfirmCrumbs(customer: string): Crumb[] {
  const q = encodeURIComponent(customer);
  return [
    { label: "Accounts", href: "/accounts" },
    { label: "Payments", href: "/accounts" },
    { label: "Payment Allocations", href: "/accounts" },
    { label: `New Allocation — ${customer}`, href: `/allocation/import/parsed?format=pdf&customer=${q}` },
    { label: "Funding Pool", href: "/allocation/funding" },
    { label: "Invoices", href: "/allocation/apply" },
    { label: "Confirmation" },
  ];
}

/** Paper JEY-0 — Review & Confirm: `Payments / … / Invoices / Confirmation` (no Accounts). */
export function allocationReviewPaperCrumbs(customer: string): Crumb[] {
  const q = encodeURIComponent(customer);
  return [
    { label: "Payments", href: "/accounts" },
    { label: "Payment Allocations", href: "/accounts" },
    { label: `New Allocation — ${customer}`, href: `/allocation/import/parsed?format=pdf&customer=${q}` },
    { label: "Funding Pool", href: "/allocation/funding" },
    { label: "Invoices", href: "/allocation/apply" },
    { label: "Confirmation" },
  ];
}

/** Paper 9Y-0 — Build Funding Pool (no Accounts prefix; matches import flow IA). */
export function allocationFundingPaperCrumbs(customer: string): Crumb[] {
  const q = encodeURIComponent(customer);
  return [
    { label: "Payments", href: "/accounts" },
    { label: "Payment Allocations", href: "/accounts" },
    { label: `New Allocation — ${customer}`, href: `/allocation/import/parsed?format=pdf&customer=${q}` },
    { label: "Funding Pool" },
  ];
}

/** Hub at /accounts — three segments; all visible (no ellipsis). */
export function hubPaymentAllocationsCrumbs(): Crumb[] {
  return [
    { label: "Accounts", href: "/accounts" },
    { label: "Payments", href: "/accounts" },
    { label: "Payment Allocations" },
  ];
}

export function AllocationBreadcrumbs({
  items,
  className,
  slaBadge,
  variant = "default",
}: AllocationBreadcrumbsProps) {
  if (items.length === 0) return null;

  const applyFp = variant === "applyFp" && items.length === 5;
  /** Payments / … / Invoices / Confirmation */
  const reviewFp = variant === "reviewFp" && items.length === 6;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("mb-3.5 flex flex-wrap items-center gap-1.5 text-[13px] leading-4", className)}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {applyFp ? (
          <>
            <li className="flex items-center gap-1.5">
              <CrumbLinkOrText item={items[0]} />
            </li>
            {separator}
            <li className="flex items-center gap-1.5">
              <EllipsisMenu items={items.slice(1, -2)} />
            </li>
            {separator}
            <li className="flex items-center gap-1.5">
              <CrumbLinkOrText item={items[3]} />
            </li>
            {separator}
            <li className="flex items-center gap-1.5">
              <CrumbLinkOrText item={items[4]} current />
            </li>
          </>
        ) : reviewFp ? (
          <>
            <li className="flex items-center gap-1.5">
              <CrumbLinkOrText item={items[0]} />
            </li>
            {separator}
            <li className="flex items-center gap-1.5">
              <EllipsisMenu items={items.slice(1, -2)} />
            </li>
            {separator}
            <li className="flex items-center gap-1.5">
              <CrumbLinkOrText item={items[4]} />
            </li>
            {separator}
            <li className="flex items-center gap-1.5">
              <CrumbLinkOrText item={items[5]} current />
            </li>
          </>
        ) : items.length <= 4 ? (
          items.map((item, i) => (
            <Fragment key={`${item.label}-${i}`}>
              {i > 0 ? separator : null}
              <li className="flex items-center gap-1.5">
                <CrumbLinkOrText item={item} current={i === items.length - 1} />
              </li>
            </Fragment>
          ))
        ) : (
          <>
            <li className="flex items-center gap-1.5">
              <CrumbLinkOrText item={items[0]} />
            </li>
            {separator}
            <li className="flex items-center gap-1.5">
              <CrumbLinkOrText item={items[1]} />
            </li>
            {separator}
            <li className="flex items-center gap-1.5">
              <EllipsisMenu items={items.slice(2, -1)} />
            </li>
            {separator}
            <li className="flex items-center gap-1.5">
              <CrumbLinkOrText item={items[items.length - 1]} current />
            </li>
          </>
        )}
      </ol>
      {slaBadge ? <SlaBadge label={slaBadge} /> : null}
    </nav>
  );
}
