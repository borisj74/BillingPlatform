"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Package,
  Users,
  Archive,
  Calculator,
  BarChart3,
  Terminal,
  Sparkles,
  Info,
  Trash2,
  Settings,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", href: "/home" },
  { icon: Package, label: "Products", href: "/products" },
  { icon: Users, label: "Accounts", href: "/accounts" },
  { icon: Archive, label: "Collection", href: "/collection" },
  { icon: Calculator, label: "Accounting", href: "/accounting" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: Terminal, label: "Process Console", href: "/console" },
];

const bottomItems = [
  { icon: Sparkles, label: "Copilot", href: "/copilot", gradient: true },
  { icon: Info, label: "Info", href: "/info" },
  { icon: Trash2, label: "Recycling Bin", href: "/bin" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

function isAccountsActive(pathname: string, href: string) {
  if (href === "/accounts") {
    return pathname === "/accounts" || pathname.startsWith("/allocation");
  }
  if (href === "/home") return pathname === "/home";
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

export function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: open ? 250 : 64 }}
      transition={{ duration: 0.22, ease: "easeInOut" }}
      className="flex h-full min-h-0 shrink-0 flex-col overflow-hidden border-r border-[#E5E7EB] bg-white"
    >
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-[#F3F4F6] px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand">
          <span className="text-[11px] font-bold leading-none text-white">BP</span>
        </div>
        <AnimatePresence>
          {open && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="whitespace-nowrap text-sm font-semibold text-[#111827]"
            >
              BillingPlatform
            </motion.span>
          )}
        </AnimatePresence>
        <button
          type="button"
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          onClick={() => setOpen(!open)}
          className="ml-auto shrink-0 text-[#9CA3AF] transition-colors hover:text-[#6B7280]"
        >
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }}>
            <ChevronRight size={16} />
          </motion.div>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2" aria-label="Primary">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = isAccountsActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`mx-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-brand-subtle font-medium text-brand"
                  : "text-[#4B5563] hover:bg-gray-100 hover:text-[#111827]"
              }`}
            >
              <Icon size={18} className="shrink-0" aria-hidden />
              <AnimatePresence>
                {open && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#F3F4F6] py-2">
        {bottomItems.map(({ icon: Icon, label, href, gradient }) => (
          <Link
            key={href}
            href={href}
            className="mx-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#4B5563] transition-colors hover:bg-gray-100 hover:text-[#111827]"
          >
            {gradient ? (
              <div
                className="h-[18px] w-[18px] shrink-0 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600"
                aria-hidden
              />
            ) : (
              <Icon size={18} className="shrink-0" aria-hidden />
            )}
            <AnimatePresence>
              {open && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        ))}

        <div className="mx-2 mt-1 flex items-center gap-3 px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
            SM
          </div>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="min-w-0"
              >
                <p className="text-sm font-semibold leading-none text-[#111827]">Sarah M.</p>
                <p className="mt-0.5 text-xs text-[#9CA3AF]">Billing Specialist</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
