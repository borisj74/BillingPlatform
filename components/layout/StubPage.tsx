import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StubPage({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-md rounded-[10px] border border-[#E5E7EB] bg-white p-8 text-center">
      <h1 className="text-lg font-semibold text-[#111827]">{title}</h1>
      <p className="mt-2 text-sm text-[#6B7280]">
        Placeholder screen — not part of the payment allocation prototype.
      </p>
      <Link
        href="/accounts"
        className={cn(buttonVariants({ variant: "default" }), "mt-6 inline-flex bg-brand text-white hover:bg-brand/90")}
      >
        Payment Allocations
      </Link>
    </div>
  );
}
