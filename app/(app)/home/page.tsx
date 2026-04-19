import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { NavArrowRight } from "@/components/ui/NavArrowIcons";
import { cn } from "@/lib/utils";

type FlowLink = {
  href: string;
  label: string;
  paper: string;
  note: string;
};

const SECTIONS: { id: string; title: string; subtitle?: string; items: FlowLink[] }[] = [
  {
    id: "hub",
    title: "A · Allocation hub",
    items: [
      {
        href: "/accounts",
        label: "Screen 1 — Allocation Hub",
        paper: "1-0",
        note: "KPIs, AI banner, pending remittances table (default closed nav).",
      },
      {
        href: "/accounts",
        label: "Screen 1 — Open nav",
        paper: "5A5-0",
        note: "Expand the sidebar (chevron) to match the 250px open rail.",
      },
    ],
  },
  {
    id: "import",
    title: "B · New allocation — Import remittance",
    subtitle: "Browse PDF upload first → parsed review → EDI 820 is the third format in the tray.",
    items: [
      {
        href: "/allocation/import?format=pdf&customer=Acme%20Corp",
        label: "S2a — Import · Browse / upload (PDF)",
        paper: "MVG-1 · IUS-0",
        note: "Format tray + upload zone + preview (first screen from Browse Allocation).",
      },
      {
        href: "/allocation/import/parsed?format=pdf&customer=Acme%20Corp",
        label: "S2b — Import · Parsed (PDF success)",
        paper: "58-0 · IUS-0",
        note: "OCR + extracted fields after Continue (second screen).",
      },
      {
        href: "/allocation/import?format=edi&customer=Acme%20Corp",
        label: "S2c — Import · EDI 820 source",
        paper: "J43-0",
        note: "Third format in the tray: raw X12 + extracted payment details on the import route.",
      },
      {
        href: "/allocation/import/parsed?format=edi&customer=Acme%20Corp",
        label: "S2 — Import · Parsed (EDI success)",
        paper: "58-0",
        note: "Parse success banner + split review (EDI 820 path).",
      },
      {
        href: "/allocation/import/error?customer=Acme%20Corp",
        label: "Screen 2B — Parse error",
        paper: "3N9-0",
        note: "Manual fix / retry path when extraction fails.",
      },
    ],
  },
  {
    id: "funding",
    title: "C · Funding pool → Apply → Review → Confirm",
    items: [
      {
        href: "/allocation/funding",
        label: "Screen 3 — Build funding pool",
        paper: "9Y-0",
        note: "Drag/drop pool, payment + credits.",
      },
      {
        href: "/allocation/funding/manual",
        label: "Screen 3b — Manual fallback (SLA)",
        paper: "2UT-0",
        note: "Global Retail · AI scan + manual review credits.",
      },
      {
        href: "/allocation/apply",
        label: "Screen 4 — Apply to invoices",
        paper: "FP-0",
        note: "Invoice grid + applied totals + sidebar.",
      },
      {
        href: "/allocation/review",
        label: "Screen 5 — Review & confirm",
        paper: "JEY-0",
        note: "Final checklist before commit.",
      },
      {
        href: "/allocation/confirm",
        label: "Screen 6 — Success",
        paper: "GIF-0",
        note: "Confirmation card · PA reference.",
      },
    ],
  },
  {
    id: "edge",
    title: "D · Edge cases",
    subtitle: "Paper row header K44-0 — variance, overpayment, AI suggestions.",
    items: [
      {
        href: "/allocation/variance",
        label: "Screen 7 — Variance blocked",
        paper: "K49-0",
        note: "Commit blocked when remittance total ≠ funding pool.",
      },
      {
        href: "/allocation/overpayment",
        label: "Screen 8 — Overpayment",
        paper: "K4A-0",
        note: "Pool exceeds invoices; credit remainder messaging.",
      },
      {
        href: "/allocation/suggestions",
        label: "Screen 9 — AI smart suggestions",
        paper: "K4B-0",
        note: "Insights grid + apply-all (step 2 context).",
      },
    ],
  },
];

export default function HomePage() {
  return (
    <div className="w-full py-8 md:py-10">
      <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">
          Billing Platform prototype
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#111827]">Paper flow map</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
          Screens follow the artboard order in{" "}
          <a
            href="https://app.paper.design/file/01KP17A7CKK79Y04F1CNW8YPJX/1-0"
            className="font-medium text-brand underline-offset-2 hover:underline"
          >
            Paper — Page 1
          </a>
          . Open any step below; edge cases branch from apply/review without blocking the happy path.
        </p>

        <Link
          href="/allocation/import?format=pdf&customer=Acme%20Corp"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "mt-6 inline-flex items-center gap-2 bg-brand text-white hover:bg-brand/90",
          )}
        >
          <span>Browse allocation (Acme)</span>
          <NavArrowRight variant="onPrimary" />
        </Link>
      </div>

      <div className="mt-8 space-y-10">
        {SECTIONS.map((section) => (
          <section key={section.id} aria-labelledby={`section-${section.id}`}>
            <h2 id={`section-${section.id}`} className="text-sm font-semibold text-[#111827]">
              {section.title}
            </h2>
            {section.subtitle ? (
              <p className="mt-1 text-xs leading-relaxed text-[#6B7280]">{section.subtitle}</p>
            ) : null}
            <ul className="mt-4 space-y-3">
              {section.items.map((item) => (
                <li key={item.href + item.paper}>
                  <Link
                    href={item.href}
                    className="flex flex-col gap-1 rounded-lg border border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3 transition-colors hover:border-[#D1D5DB] hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="text-sm font-medium text-[#111827]">{item.label}</span>
                          <span className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">
                            Paper · {item.paper}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-[#6B7280]">{item.note}</p>
                      </div>
                      <span className="mt-0.5 inline-flex shrink-0 text-[#9CA3AF]" aria-hidden>
                        <NavArrowRight />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
