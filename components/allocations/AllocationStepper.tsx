"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";

const steps = [
  { n: 1, label: "Remittance Details" },
  { n: 2, label: "Build Funding Pool" },
  { n: 3, label: "Apply to Invoices" },
  { n: 4, label: "Review & Confirm" },
] as const;

interface AllocationStepperProps {
  current: 1 | 2 | 3 | 4;
  className?: string;
  /** Paper 2UT-0: no “· Active”, muted completed/upcoming steps, softer connectors. */
  tone?: "default" | "manualFallback";
  /** Paper FP-0: active step shows “Step N” only (no “· Active”). */
  hideActiveSuffix?: boolean;
}

function StepCheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <polyline
        points="20 6 9 17 4 12"
        stroke="#6B7280"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Horizontal stepper — Paper 1HH-0 (default) or 2UT-0 (manualFallback). */
export function AllocationStepper({ current, className, tone = "default", hideActiveSuffix = false }: AllocationStepperProps) {
  const manual = tone === "manualFallback";

  return (
    <div
      className={cn(
        "mb-5 flex min-w-0 items-center overflow-x-auto rounded-[10px] border border-[#E5E7EB] bg-white px-6 py-[18px] antialiased",
        className,
      )}
      role="list"
      aria-label="Allocation steps"
    >
      {steps.map((step, index) => {
        const done = step.n < current;
        const active = step.n === current;
        const upcoming = step.n > current;

        return (
          <Fragment key={step.n}>
            {index > 0 && (
              <div
                className={cn(
                  "mx-4 h-0.5 min-w-[16px] grow basis-0",
                  current > index ? "bg-brand" : "bg-[#E5E7EB]",
                )}
                aria-hidden
              />
            )}
            <div
              className={cn(
                "flex shrink-0 items-center gap-2.5",
                manual && done && "opacity-[0.55]",
                manual && upcoming && "opacity-[0.45]",
              )}
              role="listitem"
              aria-current={active ? "step" : undefined}
            >
              <div
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full",
                  done && "bg-[#E5E7EB]",
                  active && "bg-brand",
                  upcoming && "border-2 border-[#D1D5DB] bg-transparent",
                )}
              >
                {done ? (
                  <StepCheckIcon />
                ) : (
                  <span
                    className={cn(
                      "text-xs font-bold leading-none",
                      active ? "text-white" : "text-[#9CA3AF]",
                    )}
                  >
                    {step.n}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div
                  className={cn(
                    "text-[11px] uppercase tracking-[0.05em]",
                    active && "font-semibold text-brand",
                    !active && "font-medium text-[#9CA3AF]",
                  )}
                >
                  {active && !manual && !hideActiveSuffix ? `Step ${step.n} · Active` : `Step ${step.n}`}
                </div>
                <div
                  className={cn(
                    "text-[13px] leading-4",
                    active && "font-semibold text-[#111827]",
                    done && "text-[#9CA3AF] line-through decoration-1",
                    upcoming && "text-[#9CA3AF]",
                  )}
                >
                  {step.label}
                </div>
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
