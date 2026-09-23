"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/constants";

type ConfirmResponse = {
  status: "pending" | "paid" | "failed" | "cancelled";
  order: {
    items: Array<{ name: string; qty: number; price: number }>;
    subtotal: number;
    total: number;
    customerName: string;
  };
};

export function CheckoutSuccessClient() {
  const reference = useSearchParams().get("ref");
  const { clear } = useCart();
  const [result, setResult] = useState<{
    data: ConfirmResponse | null;
    error: string | null;
  } | null>(null);

  useEffect(() => {
    if (!reference) return;
    let cancelled = false;
    fetch(`/api/checkout/confirm?ref=${encodeURIComponent(reference)}`)
      .then((res) => res.json())
      .then((data: ConfirmResponse | { error: string }) => {
        if (cancelled) return;
        if ("error" in data) {
          setResult({ data: null, error: data.error });
        } else {
          setResult({ data, error: null });
          if (data.status === "paid") clear();
        }
      })
      .catch(() => {
        if (!cancelled) setResult({ data: null, error: "Couldn't confirm your order." });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  if (!reference) {
    return (
      <div className="py-16 text-center">
        <p className="text-charcoal-600">Missing order reference.</p>
        <Link
          href="/collections"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full border border-coffee px-8 text-sm font-medium tracking-wide text-coffee transition-colors hover:bg-coffee hover:text-white"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  if (!result) {
    return <p className="py-16 text-center text-charcoal-600">Confirming your payment…</p>;
  }

  if (result.error || !result.data) {
    return (
      <div className="py-16 text-center">
        <p className="text-charcoal-600">{result.error ?? "Order not found."}</p>
        <Link
          href="/collections"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full border border-coffee px-8 text-sm font-medium tracking-wide text-coffee transition-colors hover:bg-coffee hover:text-white"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const { status, order } = result.data;

  if (status === "paid") {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <h2 className="font-heading text-3xl text-charcoal">Thank you, {order.customerName}!</h2>
        <p className="mt-3 text-charcoal-600">
          Your payment was successful. We&apos;ll be in touch to arrange shipping.
        </p>
        <ul className="mx-auto mt-8 max-w-sm space-y-2 text-left text-sm">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between">
              <span className="text-charcoal-600">
                {item.name} × {item.qty}
              </span>
              <span className="text-charcoal">{formatPrice(item.price * item.qty)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-heading text-xl text-coffee">{formatPrice(order.total)}</p>
        <Link
          href="/collections"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-coffee px-8 text-sm font-medium tracking-wide text-coffee transition-colors hover:bg-coffee hover:text-white"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg py-10 text-center">
      <h2 className="font-heading text-3xl text-charcoal">Payment not completed</h2>
      <p className="mt-3 text-charcoal-600">
        Your order hasn&apos;t been paid for yet — please try again.
      </p>
      <Link
        href="/checkout"
        className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-coffee px-8 text-sm font-medium tracking-wide text-coffee transition-colors hover:bg-coffee hover:text-white"
      >
        Try again
      </Link>
    </div>
  );
}
