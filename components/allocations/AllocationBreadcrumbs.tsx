import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

interface AllocationBreadcrumbsProps {
  items: Crumb[];
  className?: string;
}

export function AllocationBreadcrumbs({ items, className }: AllocationBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("mb-1.5 flex flex-wrap items-center gap-1.5 text-[13px]", className)}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-[#D1D5DB]">/</span>}
            {isLast ? (
              <span className="font-medium text-[#374151]">{item.label}</span>
            ) : (
              <span className="text-[#9CA3AF]">{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
