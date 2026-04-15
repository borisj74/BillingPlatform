import Link from "next/link";
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
}

const crumbLinkClass =
  "rounded-sm text-[#9CA3AF] transition-colors hover:text-[#6B7280] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

/** Paper 1HB-0: Payments / … / New Allocation — {customer} / {current page}. */
export function allocationFlowCrumbs(
  customer: string,
  page: AllocationBreadcrumbPage,
): Crumb[] {
  return [
    { label: "Payments", href: "/accounts" },
    { label: "…" },
    { label: `New Allocation — ${customer}`, href: "/allocation/import" },
    { label: PAGE_LABEL[page] },
  ];
}

/** Paper FP-0: Payments / … / Funding Pool / Invoices (current). */
export function allocationApplyInvoicesCrumbs(): Crumb[] {
  return [
    { label: "Payments", href: "/accounts" },
    { label: "…" },
    { label: "Funding Pool", href: "/allocation/funding" },
    { label: "Invoices" },
  ];
}

/** Paper MU-0: Payments / … / Invoices / Confirmation (current). */
export function allocationReviewConfirmCrumbs(): Crumb[] {
  return [
    { label: "Payments", href: "/accounts" },
    { label: "…" },
    { label: "Invoices", href: "/allocation/apply" },
    { label: "Confirmation" },
  ];
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

export function AllocationBreadcrumbs({ items, className, slaBadge }: AllocationBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("mb-3.5 flex flex-wrap items-center gap-1.5 text-[13px] leading-4", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && (
                <span className="text-[#D1D5DB]" aria-hidden>
                  /
                </span>
              )}
              {isLast ? (
                <span className="font-medium text-[#374151]" aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link href={item.href} className={crumbLinkClass}>
                  {item.label}
                </Link>
              ) : (
                <span className={cn("text-[#9CA3AF]", item.label === "…" && "select-none")}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
      {slaBadge ? <SlaBadge label={slaBadge} /> : null}
    </nav>
  );
}
