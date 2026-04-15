import { Suspense } from "react";
import { ImportRemittanceClient } from "@/components/allocations/ImportRemittanceClient";

export default function ImportRemittancePage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-[#6B7280]">Loading…</div>}>
      <ImportRemittanceClient />
    </Suspense>
  );
}
