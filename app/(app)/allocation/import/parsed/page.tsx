import { Suspense } from "react";
import { ImportParsedClient } from "@/components/allocations/ImportParsedClient";

export default function ImportParsedPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-[#6B7280]">Loading…</div>}>
      <ImportParsedClient />
    </Suspense>
  );
}
