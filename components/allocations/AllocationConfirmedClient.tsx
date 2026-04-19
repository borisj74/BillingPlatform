"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { NavArrowLeft, NavArrowRight } from "@/components/ui/NavArrowIcons";

/** Paper GIF-0 — Screen 6 success / allocation confirmed */
export function AllocationConfirmedClient() {
  const searchParams = useSearchParams();
  const confirmationRef = searchParams.get("confirmation") ?? "PA-20481";

  return (
    <div className="-mx-4 flex min-h-[calc(100dvh-10rem)] flex-col items-center justify-center bg-white px-4 py-12 antialiased md:-mx-8">
      <div className="flex w-full max-w-[440px] shrink-0 flex-col items-center gap-4 rounded-xl border border-solid border-[#E5E7EB] bg-white px-10 pb-9 pt-10 shadow-[0_4px_24px_-4px_rgba(17,24,39,0.08)]">
        <div className="mb-1 flex shrink-0 items-center justify-center">
          <div
            className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7]"
            aria-hidden
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16A34A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
        </div>
        <h1 className="text-center text-2xl font-semibold leading-8 tracking-[-0.02em] text-text-primary">
          Allocation confirmed
        </h1>
        <p className="max-w-[90%] text-center text-[15px] leading-[22px] text-[#6B7280]">
          Payment allocations were saved. Invoices and credits are now updated for the selected account.
        </p>
        <p className="text-center text-[13px] font-medium uppercase leading-[18px] tracking-[0.04em] text-[#9CA3AF]">
          CONFIRMATION · {confirmationRef}
        </p>
        <div className="mt-2 flex w-full shrink-0 flex-wrap items-center justify-center gap-3">
          <Link
            href="/accounts"
            className="flex min-h-11 min-w-0 shrink-0 items-center justify-center gap-2 rounded-sm bg-[#4F46E5] px-[13px] py-[13px] text-sm font-medium leading-[18px] text-white hover:bg-[#4338CA]"
          >
            <span>View allocations</span>
            <NavArrowRight variant="onPrimary" />
          </Link>
          <Link
            href="/home"
            className="flex min-h-11 w-[130px] shrink-0 items-center justify-center gap-2 rounded-sm border border-solid border-[#4F46E5] bg-white px-[13px] py-[13px] text-center text-[13px] font-medium leading-4 text-[#4F46E5] hover:bg-brand-subtle"
          >
            <NavArrowLeft />
            <span>Done</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
