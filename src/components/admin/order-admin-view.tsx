"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCcw,
  Search,
  X,
} from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/coupon-utils";
import { orderApi } from "@/lib/order-api";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/order";

const pageSize = 8;

const statusStyles: Record<OrderStatus, string> = {
  paid: "text-emerald-300",
  created: "text-gold-300",
  failed: "text-red-300",
};

const statusLabels: Record<OrderStatus, string> = {
  paid: "Paid",
  created: "Awaiting payment",
  failed: "Failed",
};

function formatOrderDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function customerName(order: Order) {
  return `${order.customer.firstName} ${order.customer.lastName}`.trim();
}

export function OrderAdminView() {
  const { accessToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("paid");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<Order | null>(null);

  const closeDetails = useCallback(() => setViewing(null), []);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      setOrders(await orderApi.all(accessToken));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const paidOrders = useMemo(
    () => orders.filter((order) => order.status === "paid"),
    [orders],
  );

  const revenue = useMemo(
    () => paidOrders.reduce((total, order) => total + order.total, 0),
    [paidOrders],
  );

  const filtered = useMemo(
    () =>
      orders.filter((order) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query ||
          order.id.toLowerCase().includes(query) ||
          order.customer.email.toLowerCase().includes(query) ||
          customerName(order).toLowerCase().includes(query) ||
          order.customer.phone.includes(query) ||
          (order.razorpayPaymentId ?? "").toLowerCase().includes(query);
        const matchesStatus = status === "all" || order.status === status;
        return matchesSearch && matchesStatus;
      }),
    [orders, search, status],
  );

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice(
    (Math.min(page, pages) - 1) * pageSize,
    Math.min(page, pages) * pageSize,
  );

  return (
    <>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-luxury text-gold-300">
            Commerce
          </p>
          <h1 className="mt-3 font-display text-5xl text-ivory sm:text-6xl">
            Orders
          </h1>
          <p className="mt-4 text-base text-ivory/90">
            Every Razorpay payment, with the customer and delivery details.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-editorial text-ivory hover:text-gold-300"
        >
          <RotateCcw className="size-4" /> Refresh
        </button>
      </div>

      <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Paid orders" value={String(paidOrders.length)} />
        <Stat label="Revenue" value={formatCurrency(revenue)} />
        <Stat
          label="Awaiting payment"
          value={String(
            orders.filter((order) => order.status === "created").length,
          )}
        />
        <Stat
          label="Failed"
          value={String(
            orders.filter((order) => order.status === "failed").length,
          )}
        />
      </div>

      <div className="mt-6 grid gap-3 border border-white/20 bg-white/[0.05] p-4 md:grid-cols-[1fr_14rem]">
        <label className="relative">
          <span className="sr-only">Search orders</span>
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ivory/70" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search order id, name, email, phone or payment id"
            className="h-13 w-full border border-white/25 bg-black/40 py-3 pl-11 pr-4 text-sm text-ivory outline-none focus:border-gold-300"
          />
        </label>
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="border border-white/25 bg-black/40 px-4 py-3 text-sm text-ivory outline-none"
        >
          <option value="paid">Paid</option>
          <option value="created">Awaiting payment</option>
          <option value="failed">Failed</option>
          <option value="all">All statuses</option>
        </select>
      </div>

      {error && (
        <p className="mt-5 border border-red-400/40 bg-red-500/5 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      <div className="mt-5 overflow-x-auto border border-white/20">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="border-b border-white/20 bg-white/[0.065] text-[0.68rem] uppercase tracking-editorial text-ivory">
            <tr>
              {[
                "Placed",
                "Customer",
                "Items",
                "Coupon",
                "Total",
                "Payment id",
                "Status",
                "Actions",
              ].map((heading) => (
                <th key={heading} className="whitespace-nowrap p-4">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((order) => (
              <tr key={order.id}>
                <td className="whitespace-nowrap p-4 text-ivory">
                  {formatOrderDate(order.createdAt)}
                  <span className="mt-1 block text-[0.62rem] uppercase tracking-editorial text-ivory/70">
                    #{order.id.slice(-8)}
                  </span>
                </td>
                <td className="p-4 text-ivory">
                  {customerName(order)}
                  <span className="mt-1 block text-xs text-ivory/70">
                    {order.customer.email}
                  </span>
                </td>
                <td className="p-4 text-ivory/90">
                  {order.items.reduce((count, item) => count + item.quantity, 0)}
                  <span className="mt-1 block max-w-[16rem] truncate text-xs text-ivory/70">
                    {order.items.map((item) => item.name).join(", ")}
                  </span>
                </td>
                <td className="p-4 text-ivory/90">
                  {order.couponCode ?? "—"}
                  {order.discount > 0 && (
                    <span className="mt-1 block text-xs text-gold-300">
                      −{formatCurrency(order.discount)}
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap p-4 text-ivory">
                  {formatCurrency(order.total)}
                </td>
                <td className="p-4 text-xs text-ivory/80">
                  {order.razorpayPaymentId ?? "—"}
                </td>
                <td className="p-4">
                  <span
                    className={cn(
                      "whitespace-nowrap text-[0.68rem] uppercase tracking-editorial",
                      statusStyles[order.status],
                    )}
                  >
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    type="button"
                    title="View order"
                    aria-label={`View order ${order.id}`}
                    onClick={() => setViewing(order)}
                    className="border border-white/25 p-2.5 text-ivory hover:border-gold-300 hover:text-gold-300 [&_svg]:size-4"
                  >
                    <Eye />
                  </button>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td
                  colSpan={8}
                  className="p-12 text-center text-base text-ivory/75"
                >
                  {loading ? "Loading orders…" : "No orders match these filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-x border-b border-white/20 px-4 py-4 text-sm text-ivory/80 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing {rows.length} of {filtered.length} orders
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((value) => value - 1)}
            className="border border-white/25 p-2 disabled:opacity-30"
            aria-label="Previous page"
          >
            <ChevronLeft />
          </button>
          <span className="px-3">
            Page {Math.min(page, pages)} of {pages}
          </span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((value) => value + 1)}
            className="border border-white/25 p-2 disabled:opacity-30"
            aria-label="Next page"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {viewing && <OrderDetails order={viewing} onClose={closeDetails} />}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/20 bg-white/[0.06] p-6">
      <p className="text-[0.68rem] uppercase tracking-luxury text-ivory">
        {label}
      </p>
      <p className="mt-5 font-display text-4xl text-gold-300">{value}</p>
    </div>
  );
}

function OrderDetails({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const values = [
    ["Order id", order.id],
    ["Placed", formatOrderDate(order.createdAt)],
    ["Status", statusLabels[order.status]],
    ["Customer", customerName(order)],
    ["Email", order.customer.email],
    ["Phone", order.customer.phone],
    [
      "Delivery address",
      `${order.shippingAddress.address}, ${order.shippingAddress.city} ${order.shippingAddress.postalCode}`,
    ],
    ["Coupon", order.couponCode ?? "None"],
    ["Razorpay order", order.razorpayOrderId],
    ["Razorpay payment", order.razorpayPaymentId ?? "Not captured"],
  ];

  return (
    <div className="fixed inset-0 z-[160] flex items-end justify-center sm:items-center sm:p-4 lg:p-6">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
        className="relative z-10 flex max-h-[100dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-white/20 bg-[#151515] shadow-2xl sm:max-h-[92dvh] sm:max-w-3xl sm:rounded-2xl"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-white/20 px-5 py-4 sm:px-8 sm:py-6">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-luxury text-gold-300">
              Order details
            </p>
            <h2
              id="order-modal-title"
              className="mt-2 truncate font-display text-3xl text-ivory sm:text-4xl"
            >
              #{order.id.slice(-8)}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 border border-white/25 p-2.5 text-ivory transition hover:border-gold-300/40 hover:text-gold-300"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8">
          <dl className="grid border-l border-t border-white/15 sm:grid-cols-2">
            {values.map(([label, value]) => (
              <div key={label} className="border-b border-r border-white/15 p-4">
                <dt className="text-[0.65rem] uppercase tracking-editorial text-gold-300">
                  {label}
                </dt>
                <dd className="mt-2 break-words text-base text-ivory">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 divide-y divide-white/10 border-y border-white/15">
            {order.items.map((item) => (
              <div
                key={item.perfumeId}
                className="flex justify-between gap-4 py-3 text-sm text-ivory"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 text-sm text-ivory/85">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gold-300">
              <span>Discount</span>
              <span>−{formatCurrency(order.discount)}</span>
            </div>
            <div className="flex justify-between border-t border-white/15 pt-3 font-display text-xl text-ivory">
              <span>Total paid</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        <footer className="flex shrink-0 justify-end border-t border-white/20 px-5 py-4 sm:px-8">
          <Button onClick={onClose}>Close</Button>
        </footer>
      </div>
    </div>
  );
}
