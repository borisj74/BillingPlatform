/** Static copy for Paper node 2UT-0 — manual funding fallback (Global Retail scenario). */

export interface ManualHighConfidenceCredit {
  id: string;
  number: string;
  line: string;
  ai: number;
  amount: number;
}

export const manualHighConfidenceCredits: ManualHighConfidenceCredit[] = [
  {
    id: "hc1",
    number: "CR-8042",
    line: "Global Retail Inc. · West Coast HQ · Issued Feb 10",
    ai: 84,
    amount: 8400,
  },
  {
    id: "hc2",
    number: "CR-8039",
    line: "Global Retail Inc. · East Coast Hub · Issued Feb 12",
    ai: 81,
    amount: 6200,
  },
  {
    id: "hc3",
    number: "CR-8036",
    line: "Global Retail Inc. · Texas Southwest · Issued Feb 8",
    ai: 78,
    amount: 5800,
  },
  {
    id: "hc4",
    number: "CR-8031",
    line: "Global Retail Inc. · Florida Branch · Issued Feb 15",
    ai: 75,
    amount: 4100,
  },
];

export const MANUAL_REVIEW_TOTAL = 7;
export const MANUAL_HIGH_CONFIDENCE_COUNT = manualHighConfidenceCredits.length;

/** Accounts shown in “Find in {customer} accounts…” (subset of the scoped directory). */
export interface ManualScopedAccount {
  id: string;
  name: string;
  code: string;
}

export const manualScopedAccounts: ManualScopedAccount[] = [
  { id: "sa1", name: "Pacific Northwest Division", code: "ACC-PNW-1042" },
  { id: "sa2", name: "West Coast HQ", code: "ACC-WCH-2201" },
  { id: "sa3", name: "East Coast Hub", code: "ACC-ECH-1188" },
  { id: "sa4", name: "Texas Southwest", code: "ACC-TXS-3304" },
  { id: "sa5", name: "Florida Branch", code: "ACC-FLB-2091" },
  { id: "sa6", name: "Midwest Central", code: "ACC-MWC-4410" },
  { id: "sa7", name: "Northern Illinois", code: "ACC-NIL-5522" },
  { id: "sa8", name: "Gulf Coast Division", code: "ACC-GCD-6613" },
  { id: "sa9", name: "Mountain West", code: "ACC-MTW-7724" },
  { id: "sa10", name: "Southeast Region", code: "ACC-SER-8835" },
  { id: "sa11", name: "HQ Operations", code: "ACC-HQO-9946" },
  { id: "sa12", name: "Retail Hub", code: "ACC-RTL-1057" },
];
