import { Suspense } from "react";
import { AllocationConfirmedClient } from "@/components/allocations/AllocationConfirmedClient";

export default function AllocationConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="-mx-4 min-h-[calc(100dvh-10rem)] bg-white py-12 md:-mx-8" aria-hidden />
      }
    >
      <AllocationConfirmedClient />
    </Suspense>
  );
}
