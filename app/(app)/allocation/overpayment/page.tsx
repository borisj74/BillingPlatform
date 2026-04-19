import { Suspense } from "react";
import { OverpaymentClient } from "@/components/allocations/OverpaymentClient";

export default function OverpaymentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-[#6B7280]">Loading…</div>}>
      <OverpaymentClient />
    </Suspense>
  );
}
