"use client";

import React, { createContext, useContext, useReducer } from "react";
import { credits as allCredits, invoices as allInvoices } from "./mock-data";

export interface FundingPoolItem {
  id: string;
  label: string;
  type: "payment" | "credit";
  amount: number;
  creditNumber?: string;
}

export interface AllocationState {
  step: 1 | 2 | 3 | 4;
  customer: string;
  remittanceFileName: string | null;
  parseState: "idle" | "parsed" | "error";
  selectedCreditIds: string[];
  paymentSelected: boolean;
  fundingPoolOrder: string[];
  appliedAmounts: Record<string, number>;
  internalNote: string;
}

const initialState: AllocationState = {
  step: 1,
  customer: "Acme Corp",
  remittanceFileName: null,
  parseState: "idle",
  selectedCreditIds: ["c1", "c2"],
  paymentSelected: true,
  fundingPoolOrder: ["payment", "c1", "c2"],
  /** Paper FP-0 — $48,000 applied vs $59,950 pool ($11,950 remaining). */
  appliedAmounts: {
    i1: 9060,
    i2: 6390,
    i3: 11110,
    i4: 5040,
    i5: 3469,
    i6: 6719,
    i7: 2264,
    i8: 3948,
  },
  internalNote: "",
};

type Action =
  | { type: "SET_CUSTOMER"; payload: string }
  | { type: "SET_PARSE_STATE"; payload: "idle" | "parsed" | "error" }
  | { type: "SET_FILE"; payload: string }
  | { type: "TOGGLE_CREDIT"; payload: string }
  | { type: "TOGGLE_PAYMENT" }
  | { type: "SELECT_ALL_CREDITS" }
  | { type: "REORDER_POOL"; payload: string[] }
  | { type: "SET_APPLIED"; payload: { id: string; amount: number } }
  | { type: "AUTO_FILL" }
  /** Distribute remaining pool balance across invoices in list order until exhausted. */
  | { type: "ALLOCATE_REMAINDER" }
  | { type: "SET_NOTE"; payload: string }
  | { type: "RESET" };

function reducer(state: AllocationState, action: Action): AllocationState {
  switch (action.type) {
    case "SET_CUSTOMER":
      return { ...state, customer: action.payload };
    case "SET_PARSE_STATE":
      return { ...state, parseState: action.payload };
    case "SET_FILE":
      return { ...state, remittanceFileName: action.payload, parseState: "idle" };
    case "TOGGLE_CREDIT": {
      const id = action.payload;
      const removing = state.selectedCreditIds.includes(id);
      const selectedCreditIds = removing
        ? state.selectedCreditIds.filter((c) => c !== id)
        : [...state.selectedCreditIds, id];
      let fundingPoolOrder = [...state.fundingPoolOrder];
      if (removing) {
        fundingPoolOrder = fundingPoolOrder.filter((x) => x !== id);
      } else if (!fundingPoolOrder.includes(id)) {
        fundingPoolOrder = [...fundingPoolOrder, id];
      }
      return { ...state, selectedCreditIds, fundingPoolOrder };
    }
    case "TOGGLE_PAYMENT": {
      const on = !state.paymentSelected;
      let fundingPoolOrder = [...state.fundingPoolOrder];
      if (on) {
        if (!fundingPoolOrder.includes("payment")) {
          fundingPoolOrder = ["payment", ...fundingPoolOrder.filter((x) => x !== "payment")];
        }
      } else {
        fundingPoolOrder = fundingPoolOrder.filter((x) => x !== "payment");
      }
      return { ...state, paymentSelected: on, fundingPoolOrder };
    }
    case "SELECT_ALL_CREDITS":
      return {
        ...state,
        selectedCreditIds: allCredits.map((c) => c.id),
        paymentSelected: true,
        fundingPoolOrder: ["payment", ...allCredits.map((c) => c.id)],
      };
    case "REORDER_POOL":
      return { ...state, fundingPoolOrder: action.payload };
    case "SET_APPLIED":
      return {
        ...state,
        appliedAmounts: { ...state.appliedAmounts, [action.payload.id]: action.payload.amount },
      };
    case "AUTO_FILL": {
      const amounts: Record<string, number> = {};
      allInvoices.forEach((inv) => { amounts[inv.id] = inv.amount; });
      return { ...state, appliedAmounts: amounts };
    }
    case "ALLOCATE_REMAINDER": {
      const creditTotal = allCredits
        .filter((c) => state.selectedCreditIds.includes(c.id))
        .reduce((sum, c) => sum + c.amount, 0);
      const paymentTotal = state.paymentSelected ? 48000 : 0;
      const poolTotal = creditTotal + paymentTotal;
      const applied = Object.values(state.appliedAmounts).reduce((sum, v) => sum + v, 0);
      let remaining = poolTotal - applied;
      if (remaining <= 0) return state;
      const next = { ...state.appliedAmounts };
      for (const inv of allInvoices) {
        const cur = next[inv.id] ?? 0;
        const gap = inv.amount - cur;
        if (gap <= 0) continue;
        const add = Math.min(gap, remaining);
        next[inv.id] = cur + add;
        remaining -= add;
        if (remaining <= 0) break;
      }
      return { ...state, appliedAmounts: next };
    }
    case "SET_NOTE":
      return { ...state, internalNote: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const AllocationContext = createContext<{
  state: AllocationState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AllocationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AllocationContext.Provider value={{ state, dispatch }}>
      {children}
    </AllocationContext.Provider>
  );
}

export function useAllocation() {
  const ctx = useContext(AllocationContext);
  if (!ctx) throw new Error("useAllocation must be used within AllocationProvider");
  return ctx;
}

// Derived selectors
export function getFundingPoolTotal(state: AllocationState): number {
  const creditTotal = allCredits
    .filter((c) => state.selectedCreditIds.includes(c.id))
    .reduce((sum, c) => sum + c.amount, 0);
  const paymentTotal = state.paymentSelected ? 48000 : 0;
  return creditTotal + paymentTotal;
}

export function getTotalApplied(state: AllocationState): number {
  return Object.values(state.appliedAmounts).reduce((sum, v) => sum + v, 0);
}
