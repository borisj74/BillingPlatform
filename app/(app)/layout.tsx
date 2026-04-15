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
      <div className="flex min-h-screen w-full flex-1 bg-[#F9FAFB]">
        <Sidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="min-h-0 flex-1 overflow-auto px-4 pb-2 pt-4 md:px-6">
            {children}
          </main>
        </div>
        <Toaster richColors position="top-center" />
      </div>
    </AllocationProvider>
  );
}
