"use client";

import { cn } from "@/lib/utils";

const steps = [
  { n: 1, label: "Import remittance" },
  { n: 2, label: "Build funding pool" },
  { n: 3, label: "Apply to invoices" },
  { n: 4, label: "Review & confirm" },
] as const;

interface AllocationStepperProps {
  current: 1 | 2 | 3 | 4;
  className?: string;
}

export function AllocationStepper({ current, className }: AllocationStepperProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-wrap items-center gap-0 border-b border-[#E5E7EB] pb-6",
        className,
      )}
      role="list"
      aria-label="Allocation steps"
    >
      {steps.map((step, index) => {
        const active = step.n === current;
        const done = step.n < current;
        return (
          <span key={step.n} className="flex items-center gap-0" role="listitem">
            {index > 0 && (
              <div
                className="mx-2 h-px w-[141px] shrink-0 bg-[#E5E7EB] max-md:hidden"
                aria-hidden
              />
            )}
            <div
              className={cn(
                "flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-2 sm:text-left",
                active && "rounded-md",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold",
                  done && "bg-[#EEF2FF] text-brand",
                  active && "bg-brand text-white",
                  !done && !active && "bg-[#F3F4F6] text-[#9CA3AF]",
                )}
              >
                {done ? "✓" : step.n}
              </span>
              <span
                className={cn(
                  "max-w-[154px] text-[13px] font-medium leading-tight",
                  active && "text-[#111827]",
                  !active && !done && "text-[#9CA3AF]",
                  done && "text-[#6B7280]",
                )}
              >
                {step.label}
              </span>
            </div>
          </span>
        );
      })}
    </div>
  );
}
