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

  return (
    <div className="flex h-[60px] shrink-0 items-center bg-white px-6">
      <div className="relative mx-auto w-full max-w-[280px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" aria-hidden />
        <input
          type="search"
          placeholder="Search invoices, customers…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-lg border border-[#00000033] bg-[#F3F4F6]/44 py-1.5 pl-9 pr-4 text-[13px] text-[#111827] placeholder:text-[#9CA3AF] focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
          aria-label="Search invoices and customers"
        />
      </div>
    </div>
  );
}
