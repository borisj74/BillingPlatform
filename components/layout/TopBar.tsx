"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export interface TopBarProps {
  searchValue?: string;
  onSearchChange?: (v: string) => void;
}

export function TopBar({ searchValue: controlled, onSearchChange }: TopBarProps) {
  const [internal, setInternal] = useState("");
  const value = controlled !== undefined ? controlled : internal;
  const setValue = onSearchChange ?? setInternal;

  /** Paper DOG-0 / DOH-0 — S2 / Top Bar + search field */
  return (
    <header
      className="flex h-[60px] shrink-0 items-center justify-center gap-3 bg-white pt-4 pb-2"
      role="banner"
    >
      <div className="flex h-9 w-[280px] shrink-0 items-center gap-2 rounded-lg border border-[#00000033] bg-[#F3F4F66e] px-3">
        <Search size={14} className="shrink-0 text-[#9CA3AF]" aria-hidden />
        <input
          type="search"
          placeholder="Search invoices, customers…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="min-w-0 flex-1 border-0 bg-transparent py-0 text-[13px] leading-4 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-0"
          aria-label="Search invoices and customers"
        />
      </div>
    </header>
  );
}
