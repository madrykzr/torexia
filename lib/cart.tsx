"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  /** slug + size + colour — variants stack as separate lines */
  key: string;
  kind: "collection" | "product";
  slug: string;
  name: string;
  image: string;
  /** null when the piece is "price on enquiry" */
  price: number | null;
  size: string | null;
  colour: string | null;
  qty: number;
};

export type NewCartItem = Omit<CartItem, "key" | "qty"> & { qty?: number };

type CartContextValue = {
  items: CartItem[];
  /** false until localStorage has been read (avoids hydration mismatch) */
  ready: boolean;
  add: (item: NewCartItem) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  count: number;
  /** Total of priced items only; "on enquiry" lines are excluded */
  subtotal: number;
  hasEnquiryOnly: boolean;
  /** Cart drawer visibility — add() opens it automatically. */
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const STORAGE_KEY = "torexia.cart.v1";

const CartContext = createContext<CartContextValue | null>(null);

function itemKey(item: NewCartItem): string {
  return [item.kind, item.slug, item.size ?? "-", item.colour ?? "-"].join("__");
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Load once on mount — server render and first client render both start empty.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed as CartItem[]);
      }
    } catch {
      // Ignore unreadable/corrupt storage — start with an empty cart.
    }
    setReady(true);
  }, []);

  // Persist after every change (but not before the initial read).
  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full or blocked — the cart still works for this session.
    }
  }, [items, ready]);

  const add = useCallback((item: NewCartItem) => {
    const key = itemKey(item);
    const qty = Math.max(1, item.qty ?? 1);
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...prev, { ...item, key, qty }];
    });
    setIsOpen(true);
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce(
      (sum, i) => sum + (i.price ?? 0) * i.qty,
      0,
    );
    return {
      items,
      ready,
      add,
      remove,
      setQty,
      clear,
      count,
      subtotal,
      hasEnquiryOnly: items.some((i) => i.price == null),
      isOpen,
      open,
      close,
    };
  }, [items, ready, add, remove, setQty, clear, isOpen, open, close]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

/**
 * Itemised WhatsApp order message. Checkout is isolated here so a Phase-2
 * payment gateway can replace it without touching cart state.
 */
export function cartOrderMessage(items: CartItem[], subtotal: number): string {
  const lines = items.map((i) => {
    const bits = [i.size && `Size: ${i.size}`, i.colour && `Colour: ${i.colour}`]
      .filter(Boolean)
      .join(", ");
    const price = i.price != null ? `RM${i.price * i.qty}` : "Price on enquiry";
    return `• ${i.name}${bits ? ` (${bits})` : ""} × ${i.qty} — ${price}`;
  });
  const total = subtotal > 0 ? `\n\nSubtotal: RM${subtotal}` : "";
  return `Hi Torexia! I'd like to place an order:\n\n${lines.join(
    "\n",
  )}${total}\n\nCould you confirm availability and payment details?`;
}
