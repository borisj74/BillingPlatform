import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-lg rounded-[10px] border border-[#E5E7EB] bg-white p-8 text-center">
      <h1 className="text-xl font-semibold text-[#111827]">Home</h1>
      <p className="mt-2 text-sm text-[#6B7280]">Open Payment Allocations to use the prototype flow.</p>
      <Link
        href="/accounts"
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          "mt-6 inline-flex bg-brand text-white hover:bg-brand/90",
        )}
      >
        Go to Payment Allocations
      </Link>
    </div>
  );
}
