"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BillingLogoMark } from "@/components/layout/paper-sidebar/BillingLogoMark";
import { CopilotMark } from "@/components/layout/paper-sidebar/CopilotMark";
import {
  IconAccounts,
  IconAccounting,
  IconChevronDown,
  IconChevronUp,
  IconCollapseChevron,
  IconCollection,
  IconHome,
  IconInfo,
  IconProcessConsole,
  IconProducts,
  IconRecyclingBin,
  IconReports,
  IconSettings,
} from "@/components/layout/paper-sidebar/NavGlyphIcons";

const PAYMENTS_BADGE = 8;

const subNav: { label: string; href: string; badge?: number }[] = [
  { label: "Contract", href: "/accounts/contract" },
  { label: "Account Products", href: "/accounts/account-products" },
  { label: "Account Packages", href: "/accounts/account-packages" },
  { label: "Payments", href: "/accounts", badge: PAYMENTS_BADGE },
  { label: "Orgs", href: "/accounts/orgs" },
  { label: "Contacts", href: "/accounts/contacts" },
];

function paymentsActive(pathname: string) {
  return pathname === "/accounts" || pathname.startsWith("/allocation");
}

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [accountsOpen, setAccountsOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  /** Paper 1-0 vs 5A5-0: `?nav=closed` matches slim rail; default open rail is 5A5-0. */
  useEffect(() => {
    if (pathname !== "/accounts") return;
    const n = searchParams.get("nav");
    if (n === "closed") setCollapsed(true);
    else setCollapsed(false);
  }, [pathname, searchParams]);

  const payActive = paymentsActive(pathname);

  return (
    <aside
      className={cn(
        "relative flex h-full min-h-0 shrink-0 flex-col justify-between self-stretch bg-[#FAF9F9] pt-4",
        collapsed ? "w-16" : "w-[250px]",
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col items-center px-3">
          <div className="flex w-full flex-col gap-0.5">
            <div className="flex w-full shrink-0 items-center justify-start gap-3 rounded-md p-2">
              <BillingLogoMark />
              {!collapsed && (
                <span className="w-[97px] text-sm font-bold leading-snug tracking-[-0.02em] text-[#111827]">
                  BillingPlatform
                </span>
              )}
            </div>

            <Link
              href="/home"
              className={cn(
                "flex items-center gap-2 rounded-md p-2 text-sm font-medium text-[#616161] hover:bg-black/[0.03]",
                pathname === "/home" && "bg-[#EEF2FF] text-brand [&_svg]:text-brand",
              )}
            >
              <IconHome />
              {!collapsed && <span className="min-w-0 flex-1">Home</span>}
            </Link>

            <Link
              href="/products"
              className={cn(
                "flex items-center gap-2 rounded-md p-2 text-sm font-medium text-[#616161] hover:bg-black/[0.03]",
                pathname.startsWith("/products") && "bg-[#EEF2FF] text-brand [&_svg]:text-brand",
              )}
            >
              <IconProducts />
              {!collapsed && <span className="min-w-0 flex-1">Products</span>}
            </Link>

            {!collapsed && (
              <button
                type="button"
                onClick={() => setAccountsOpen((o) => !o)}
                className="flex shrink-0 items-center gap-2 self-stretch rounded-md bg-[#EEF2FF] p-2 text-sm font-medium text-brand"
                aria-expanded={accountsOpen}
              >
                <IconAccounts />
                <span className="min-w-0 flex-1 text-left">Accounts</span>
                {accountsOpen ? <IconChevronUp /> : <IconChevronDown />}
              </button>
            )}
            {collapsed && (
              <Link
                href="/accounts"
                className={cn(
                  "flex items-center justify-center rounded-md p-2",
                  payActive ? "bg-[#EEF2FF] text-brand" : "text-[#616161]",
                )}
                aria-label="Accounts"
              >
                <IconAccounts />
              </Link>
            )}

            {!collapsed && accountsOpen && (
              <div className="flex flex-col gap-0.5">
                {subNav.map((item) => {
                  const active =
                    item.href === "/accounts" ? payActive : pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md py-2 pl-[33px] pr-2 text-sm font-medium text-[#616161] hover:bg-black/[0.03]",
                        item.href === "/accounts" && active && "bg-white",
                        active && "font-medium text-brand",
                      )}
                    >
                      <span className="min-w-0 flex-1 text-left">{item.label}</span>
                      {item.badge != null && (
                        <span className="ml-auto inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#4F46E5]/90 text-[10px] font-bold leading-none tabular-nums text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}

            <Link
              href="/collection"
              className={cn(
                "flex items-center gap-2 rounded-md p-2 text-sm font-medium text-[#6B7280] hover:bg-black/[0.03]",
                pathname.startsWith("/collection") && "bg-[#EEF2FF] text-brand [&_svg]:text-brand",
              )}
            >
              <IconCollection />
              {!collapsed && <span className="min-w-0 flex-1">Collection</span>}
            </Link>
            <Link
              href="/accounting"
              className={cn(
                "flex items-center gap-2 rounded-md p-2 text-sm font-medium text-[#6B7280] hover:bg-black/[0.03]",
                pathname.startsWith("/accounting") && "bg-[#EEF2FF] text-brand [&_svg]:text-brand",
              )}
            >
              <IconAccounting />
              {!collapsed && <span className="min-w-0 flex-1">Accounting</span>}
            </Link>
            <Link
              href="/reports"
              className={cn(
                "flex items-center gap-2 rounded-md p-2 text-sm font-medium text-[#6B7280] hover:bg-black/[0.03]",
                pathname.startsWith("/reports") && "bg-[#EEF2FF] text-brand [&_svg]:text-brand",
              )}
            >
              <IconReports />
              {!collapsed && <span className="min-w-0 flex-1">Reports</span>}
            </Link>
            <Link
              href="/console"
              className={cn(
                "flex items-center gap-2 rounded-md p-2 text-sm font-medium text-[#6B7280] hover:bg-black/[0.03]",
                pathname.startsWith("/console") && "bg-[#EEF2FF] text-brand [&_svg]:text-brand",
              )}
            >
              <IconProcessConsole />
              {!collapsed && <span className="min-w-0 flex-1">Process Console</span>}
            </Link>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-3 px-3 pb-4">
        <div className="flex w-full flex-col gap-0.5">
          <Link
            href="/copilot"
            className="flex items-center gap-2 rounded-md p-2 text-sm font-medium text-[#6B7280] hover:bg-black/[0.03]"
          >
            <CopilotMark />
            {!collapsed && <span className="min-w-0 flex-1">Copilot</span>}
          </Link>
          <Link
            href="/info"
            className="flex items-center gap-2 rounded-md p-2 text-sm font-medium text-[#6B7280] hover:bg-black/[0.03]"
          >
            <IconInfo />
            {!collapsed && <span className="min-w-0 flex-1">Info</span>}
          </Link>
          <Link
            href="/bin"
            className="flex items-center gap-2 rounded-md p-2 text-sm font-medium text-[#6B7280] hover:bg-black/[0.03]"
          >
            <IconRecyclingBin />
            {!collapsed && <span className="min-w-0 flex-1">Recycling Bin</span>}
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-2 rounded-md p-2 text-sm font-medium text-[#6B7280] hover:bg-black/[0.03]"
          >
            <IconSettings />
            {!collapsed && <span className="min-w-0 flex-1">Settings</span>}
          </Link>

          <div
            className={cn(
              "flex max-w-full items-center gap-2.5 p-2",
              collapsed ? "w-full justify-center" : "w-[223px]",
            )}
          >
            <div className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-brand">
              <span className="text-[11px] font-bold leading-snug text-white">SM</span>
              <Image
                src="https://app.paper.design/file-assets/01KP17A7CKK79Y04F1CNW8YPJX/7AVZT8KQK3D1PK5SSWY530QW0N.svg"
                alt=""
                width={14}
                height={14}
                unoptimized
                className="absolute -bottom-0.5 -right-0.75 size-3.5"
              />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-[13px] font-semibold leading-snug text-[#111827]">Sarah M.</div>
                <div className="text-[11px] leading-snug text-[#9CA3AF]">Billing Specialist</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-2 top-2 z-10 flex size-4 items-center justify-center rounded-full border border-white bg-[#F9F9F9] text-[#616161] shadow-sm"
      >
        <span className={cn("flex transition-transform", collapsed && "rotate-180")}>
          <IconCollapseChevron />
        </span>
      </button>
    </aside>
  );
}
