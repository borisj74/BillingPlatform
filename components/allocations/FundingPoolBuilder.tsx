"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { AllocationBreadcrumbs } from "@/components/allocations/AllocationBreadcrumbs";
import { AllocationStepper } from "@/components/allocations/AllocationStepper";
import { credits as allCredits, paymentDetails } from "@/lib/mock-data";
import { getFundingPoolTotal, useAllocation } from "@/lib/allocation-store";
import { formatUsd } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

function PoolRow({
  id,
  label,
  sub,
  amount,
}: {
  id: string;
  label: string;
  sub: string;
  amount: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-[#E5E7EB] bg-white px-3 py-3 shadow-sm",
        isDragging && "z-10 opacity-90 ring-2 ring-brand/30",
      )}
    >
      <button
        type="button"
        className="touch-none text-[#9CA3AF] hover:text-[#6B7280]"
        aria-label={`Reorder ${label}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-[#111827]">{label}</div>
        <div className="text-xs text-[#6B7280]">{sub}</div>
      </div>
      <div className="text-sm font-semibold tabular-nums text-[#111827]">{formatUsd(amount)}</div>
    </div>
  );
}

interface FundingPoolBuilderProps {
  variant?: "default" | "manual";
}

export function FundingPoolBuilder({ variant = "default" }: FundingPoolBuilderProps) {
  const { state, dispatch } = useAllocation();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const creditMap = useMemo(() => Object.fromEntries(allCredits.map((c) => [c.id, c])), []);

  const poolRows = state.fundingPoolOrder.map((id) => {
    if (id === "payment") {
      return {
        id,
        label: "Payment",
        sub: `${paymentDetails.method} · ${paymentDetails.reference}`,
        amount: paymentDetails.amount,
      };
    }
    const c = creditMap[id];
    return {
      id,
      label: c ? `Credit ${c.number}` : id,
      sub: c ? c.account : "",
      amount: c?.amount ?? 0,
    };
  });

  const total = getFundingPoolTotal(state);

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const order = state.fundingPoolOrder;
    const oldIndex = order.indexOf(String(active.id));
    const newIndex = order.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    dispatch({ type: "REORDER_POOL", payload: arrayMove(order, oldIndex, newIndex) });
  }

  return (
    <div className="mx-auto max-w-[1158px]">
      <AllocationBreadcrumbs
        items={[
          { label: "Payments" },
          { label: "Payment Allocations" },
          { label: `New Allocation — ${state.customer}` },
        ]}
      />
      <AllocationStepper current={2} />

      {variant === "manual" && (
        <div className="mb-4 flex flex-wrap items-start gap-3 rounded-[10px] border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#111827]">
              AI found 4 of 11 credits with high confidence · 7 require manual review
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">
              Prototype banner: use checkboxes below to include credits in the pool. Drag to set apply order.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-5">
            <h2 className="text-sm font-semibold text-[#111827]">Funding pool order</h2>
            <p className="mt-1 text-xs text-[#6B7280]">Drag to reorder. First items consume against invoices first.</p>
            <div className="mt-4">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={state.fundingPoolOrder} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-col gap-2">
                    {poolRows.map((row) => (
                      <PoolRow key={row.id} id={row.id} label={row.label} sub={row.sub} amount={row.amount} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>

          <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-5">
            <h2 className="text-sm font-semibold text-[#111827]">Include in pool</h2>
            <div className="mt-3 space-y-3">
              <label className="flex cursor-pointer items-center gap-3 text-sm text-[#374151]">
                <Checkbox
                  checked={state.paymentSelected}
                  onCheckedChange={() => {
                    dispatch({ type: "TOGGLE_PAYMENT" });
                  }}
                />
                Include wire payment ({formatUsd(paymentDetails.amount)})
              </label>
              {allCredits.map((c) => (
                <label key={c.id} className="flex cursor-pointer items-center gap-3 text-sm text-[#374151]">
                  <Checkbox
                    checked={state.selectedCreditIds.includes(c.id)}
                    onCheckedChange={() => {
                      dispatch({ type: "TOGGLE_CREDIT", payload: c.id });
                    }}
                  />
                  <span className="min-w-0">
                    <span className="font-medium">{c.number}</span> · {c.account}{" "}
                    <span className="text-[#6B7280]">({formatUsd(c.amount)})</span>
                  </span>
                </label>
              ))}
              <button
                type="button"
                className="text-xs font-medium text-brand hover:underline"
                onClick={() => dispatch({ type: "SELECT_ALL_CREDITS" })}
              >
                Select all credits + payment
              </button>
            </div>
          </div>
        </div>

        <div className="h-fit rounded-[10px] border border-[#E5E7EB] bg-white p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Pool total</div>
          <div className="mt-2 text-2xl font-bold tabular-nums text-[#111827]">{formatUsd(total)}</div>
          <p className="mt-2 text-xs text-[#6B7280]">Must cover invoice allocations on the next step.</p>
          <Link
            href="/allocation/apply"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-6 flex w-full justify-center bg-brand text-white hover:bg-brand/90",
            )}
          >
            Continue to invoices
          </Link>
          <Link
            href="/accounts"
            className={cn(
              buttonVariants({ variant: "ghost", size: "default" }),
              "mt-2 flex w-full justify-center text-[#6B7280]",
          )}
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
