import { Suspense } from "react";
import { AiSuggestionsClient } from "@/components/allocations/AiSuggestionsClient";

export default function AiSuggestionsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-[#6B7280]">Loading…</div>}>
      <AiSuggestionsClient />
    </Suspense>
  );
}
