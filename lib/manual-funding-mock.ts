/** Static copy for Paper artboard 2UT-0 — manual funding fallback (Global Retail Inc.). */

export const MANUAL_SCENARIO_CUSTOMER = "Global Retail Inc.";

export interface ManualHighConfidenceCredit {
  id: string;
  number: string;
  line: string;
  /** Paper row shows this % in the purple confidence pill (may differ from model score). */
  confidenceDisplay: number;
  amount: number;
}

/** Paper order: CR-8036, CR-8042, CR-8039, CR-8031 */
export const manualHighConfidenceCredits: ManualHighConfidenceCredit[] = [
  {
    id: "hc3",
    number: "CR-8036",
    line: "Global Retail Inc. · Texas Southwest · Issued Feb 8",
    confidenceDisplay: 98,
    amount: 5800,
  },
  {
    id: "hc1",
    number: "CR-8042",
    line: "Global Retail Inc. · West Coast HQ · Issued Feb 10",
    confidenceDisplay: 95,
    amount: 8400,
  },
  {
    id: "hc2",
    number: "CR-8039",
    line: "Global Retail Inc. · East Coast Hub · Issued Feb 12",
    confidenceDisplay: 81,
    amount: 6200,
  },
  {
    id: "hc4",
    number: "CR-8031",
    line: "Global Retail Inc. · Florida Branch · Issued Feb 15",
    confidenceDisplay: 75,
    amount: 4100,
  },
];

export const MANUAL_REVIEW_TOTAL = 7;
export const MANUAL_HIGH_CONFIDENCE_COUNT = manualHighConfidenceCredits.length;

/** Paper 2UT-0 — check payment in sidebar (not Acme wire). */
export const manualScenarioCheckPayment = {
  primary: "Check · WR-20260228-GRI",
  secondary: "Payment · Feb 28",
  amount: 112_000,
};

/** Paper sidebar subtotals / pool total. */
export const MANUAL_SIDEBAR_CREDITS_CONFIRMED = 24_500;
export const MANUAL_POTENTIAL_ADDITIONAL = 23_200;
export const MANUAL_POOL_TOTAL = 136_500;

export const POTENTIAL_ADDITIONAL = MANUAL_POTENTIAL_ADDITIONAL;

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
