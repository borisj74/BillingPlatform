export type RemittanceStatus = "Pending" | "Overdue" | "Completed";

export interface Remittance {
  id: string;
  customer: string;
  paymentType: string;
  date: string;
  accounts: number;
  paymentAmt: number;
  creditsReq: number;
  received: string;
  status: RemittanceStatus;
  aiMatch: number | null;
}

export const remittances: Remittance[] = [
  { id: "r1", customer: "Acme Corp", paymentType: "Wire", date: "Mar 1", accounts: 40, paymentAmt: 48000, creditsReq: 5, received: "2h ago", status: "Pending", aiMatch: 96 },
  { id: "r2", customer: "TechNova Ltd", paymentType: "ACH", date: "Mar 1", accounts: 12, paymentAmt: 22500, creditsReq: 2, received: "5h ago", status: "Pending", aiMatch: 94 },
  { id: "r3", customer: "Global Retail Inc.", paymentType: "Check", date: "Feb 28", accounts: 40, paymentAmt: 112000, creditsReq: 11, received: "1d ago", status: "Overdue", aiMatch: null },
  { id: "r4", customer: "Meridian Health", paymentType: "Wire", date: "Mar 1", accounts: 8, paymentAmt: 31750, creditsReq: 0, received: "None", status: "Pending", aiMatch: 91 },
  { id: "r5", customer: "Summit Partners", paymentType: "ACH", date: "Feb 28", accounts: 6, paymentAmt: 18200, creditsReq: 3, received: "3h ago", status: "Completed", aiMatch: null },
  { id: "r6", customer: "Horizon Foods", paymentType: "Wire", date: "Mar 2", accounts: 24, paymentAmt: 35200, creditsReq: 4, received: "30m ago", status: "Pending", aiMatch: 95 },
  { id: "r7", customer: "Northwind Logistics", paymentType: "ACH", date: "Feb 27", accounts: 18, paymentAmt: 67900, creditsReq: 1, received: "6h ago", status: "Pending", aiMatch: 92 },
  { id: "r8", customer: "Brightline Dental", paymentType: "Wire", date: "Feb 28", accounts: 9, paymentAmt: 14300, creditsReq: 2, received: "4h ago", status: "Pending", aiMatch: 89 },
  { id: "r9", customer: "Pacific Utilities", paymentType: "ACH", date: "Mar 2", accounts: 14, paymentAmt: 28900, creditsReq: 2, received: "1h ago", status: "Pending", aiMatch: 93 },
  { id: "r10", customer: "Sterling Wholesale", paymentType: "Wire", date: "Mar 2", accounts: 22, paymentAmt: 41200, creditsReq: 3, received: "45m ago", status: "Pending", aiMatch: 90 },
];

export interface Credit {
  id: string;
  number: string;
  account: string;
  issued: string;
  aiConfidence: number;
  amount: number;
}

export const credits: Credit[] = [
  { id: "c1", number: "CR-4821", account: "Acme Corp · Main Account", issued: "Issued Feb 12", aiConfidence: 98, amount: 8200 },
  { id: "c2", number: "CR-4819", account: "Acme Corp · West Region", issued: "Issued Feb 14", aiConfidence: 96, amount: 3750 },
  { id: "c3", number: "CR-4817", account: "Acme Corp · East Region", issued: "Issued Feb 18", aiConfidence: 72, amount: 5100 },
  { id: "c4", number: "CR-4812", account: "Acme Corp · South Branch", issued: "Issued Feb 20", aiConfidence: 65, amount: 2650 },
  { id: "c5", number: "CR-4805", account: "Acme Corp · HQ Operations", issued: "Issued Feb 22", aiConfidence: 58, amount: 1800 },
];

export interface Invoice {
  id: string;
  number: string;
  account: string;
  due: string;
  amount: number;
  source: string[];
}

export const invoices: Invoice[] = [
  { id: "i1", number: "INV-2026-0142", account: "Main Account", due: "Mar 15", amount: 12400, source: ["PYMT"] },
  { id: "i2", number: "INV-2026-0137", account: "West Region", due: "Mar 12", amount: 8750, source: ["CR-4819", "PYMT"] },
  { id: "i3", number: "INV-2026-0129", account: "East Region", due: "Mar 20", amount: 15200, source: ["CR-4821", "PYMT"] },
  { id: "i4", number: "INV-2026-0118", account: "South Branch", due: "Mar 18", amount: 6900, source: ["PYMT"] },
  { id: "i5", number: "INV-2026-0105", account: "HQ Operations", due: "Apr 1", amount: 4750, source: ["PYMT"] },
  { id: "i6", number: "INV-2026-0098", account: "North Division", due: "Mar 28", amount: 9200, source: ["PYMT"] },
  { id: "i7", number: "INV-2026-0071", account: "Retail Hub", due: "Apr 5", amount: 3100, source: ["PYMT"] },
  { id: "i8", number: "INV-2026-0371", account: "Field Office", due: "Apr 12", amount: 5400, source: ["PYMT"] },
];

export const paymentDetails = {
  amount: 48000,
  method: "Wire Transfer",
  date: "March 1, 2026",
  reference: "WR-20260301-4821",
};
