import { Suspense } from "react";
import { Toaster } from "sonner";
import { AllocationProvider } from "@/lib/allocation-store";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AllocationProvider>
      <div className="flex h-full min-h-0 w-full flex-1 overflow-hidden bg-[#FAF9F9]">
        <Suspense fallback={<aside className="h-full w-[250px] shrink-0 bg-[#FAF9F9]" aria-hidden />}>
          <Sidebar />
        </Suspense>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">
          <TopBar />
          <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 pb-6 pt-5 md:pt-6">
            <div className="mx-auto w-full max-w-[1344px]">{children}</div>
          </main>
        </div>
        <Toaster richColors position="top-center" />
      </div>
    </AllocationProvider>
  );
}
