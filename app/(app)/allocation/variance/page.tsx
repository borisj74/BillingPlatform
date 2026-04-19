import { Suspense } from "react";
import { VarianceBlockedClient } from "@/components/allocations/VarianceBlockedClient";

export default function VarianceBlockedPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-[#6B7280]">Loading…</div>}>
      <VarianceBlockedClient />
    </Suspense>
  );
}
