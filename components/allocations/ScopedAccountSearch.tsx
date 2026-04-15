"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { manualScopedAccounts, type ManualScopedAccount } from "@/lib/manual-funding-mock";
import { cn } from "@/lib/utils";

export interface ScopedAccountSearchProps {
  customerName: string;
  className?: string;
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 text-text-tertiary", className)}
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Combobox: scoped account search with dropdown list (manual funding CR-8028 pattern). */
export function ScopedAccountSearch({ customerName, className }: ScopedAccountSearchProps) {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return manualScopedAccounts;
    return manualScopedAccounts.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        `${customerName} ${a.name}`.toLowerCase().includes(q),
    );
  }, [query, customerName]);

  useEffect(() => {
    setHighlighted((h) => {
      if (filtered.length === 0) return 0;
      return Math.min(h, filtered.length - 1);
    });
  }, [filtered.length]);

  const handleSelect = useCallback((account: ManualScopedAccount) => {
    setQuery(`${customerName} · ${account.name}`);
    setOpen(false);
    toast.success(`Account selected: ${account.name}`, { description: account.code });
  }, [customerName]);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => (filtered.length === 0 ? 0 : (h + 1) % filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) =>
        filtered.length === 0 ? 0 : (h - 1 + filtered.length) % filtered.length,
      );
    } else if (e.key === "Enter" && filtered.length > 0) {
      e.preventDefault();
      handleSelect(filtered[highlighted] ?? filtered[0]);
    }
  }

  const placeholder = `Find in ${customerName} accounts…`;

  return (
    <div ref={containerRef} className={cn("relative min-w-0 flex-1", className)}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border border-[#D1D5DB] bg-white py-1.75 pl-2.5 pr-2",
          open && "ring-2 ring-brand/25 border-brand",
        )}
      >
        <SearchIcon />
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && filtered[highlighted] ? `${listId}-option-${filtered[highlighted].id}` : undefined
          }
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 border-0 bg-transparent text-[12.5px] text-text-primary outline-none placeholder:text-text-tertiary"
        />
      </div>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-md border border-[#E5E7EB] bg-white py-1 shadow-lg"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-[12.5px] text-text-tertiary">No accounts match</li>
          ) : (
            filtered.map((account, index) => {
              const active = index === highlighted;
              return (
                <li key={account.id} role="presentation">
                  <button
                    type="button"
                    role="option"
                    id={`${listId}-option-${account.id}`}
                    aria-selected={active}
                    className={cn(
                      "flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-[12.5px] hover:bg-[#F9FAFB]",
                      active && "bg-brand-subtle",
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setHighlighted(index)}
                    onClick={() => handleSelect(account)}
                  >
                    <span className="font-medium text-text-primary">
                      {customerName} · {account.name}
                    </span>
                    <span className="text-[11px] text-text-tertiary">{account.code}</span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
