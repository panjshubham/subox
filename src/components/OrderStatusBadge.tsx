/**
 * OrderStatusBadge
 * Shows a coloured badge for an order status.
 * Active/in-progress statuses (PENDING, PROCESSING, SHIPPED) get a slow
 * Tailwind animate-pulse ring. DELIVERED is always static — order is done.
 */

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | string;

const STATUS_CONFIG: Record<
  string,
  { label: string; base: string; ring: string; pulse: boolean }
> = {
  PENDING: {
    label: "Pending",
    base: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    ring: "ring-yellow-400",
    pulse: true,
  },
  PROCESSING: {
    label: "Processing",
    base: "bg-orange-100 text-orange-700 border border-orange-300",
    ring: "ring-orange-400",
    pulse: true,
  },
  SHIPPED: {
    label: "Shipped",
    base: "bg-blue-100 text-blue-700 border border-blue-300",
    ring: "ring-blue-400",
    pulse: true,
  },
  DELIVERED: {
    label: "Delivered",
    base: "bg-green-100 text-green-700 border border-green-200",
    ring: "ring-green-400",
    pulse: false, // order is complete — no pulse
  },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    base: "bg-slate-100 text-slate-700 border border-slate-200",
    ring: "ring-slate-400",
    pulse: false,
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1 rounded-none
        text-[10px] font-black uppercase tracking-[0.2em]
        ${cfg.base}
        ${cfg.pulse ? `ring-2 ring-offset-1 ${cfg.ring} animate-pulse` : ""}
      `}
    >
      {/* Live dot for active statuses */}
      {cfg.pulse && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            status === "SHIPPED"
              ? "bg-blue-500"
              : status === "PROCESSING"
              ? "bg-orange-500"
              : "bg-yellow-500"
          }`}
        />
      )}
      {cfg.label}
    </span>
  );
}
