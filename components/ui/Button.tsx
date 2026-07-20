import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "light" | "outline" | "outlineLight" | "blush";

// Elegant, not chunky: airier padding, lighter weight, restrained tracking.
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-8 text-sm font-normal tracking-[0.06em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coffee";

// House style: a thin burgundy outline that fills on hover. Every variant is
// an outline so no button ever reads as a heavy block of colour.
const variants: Record<Variant, string> = {
  primary: "border border-coffee text-coffee hover:bg-coffee hover:text-white",
  light: "border border-coffee text-coffee hover:bg-coffee hover:text-white",
  outline: "border border-coffee text-coffee hover:bg-coffee hover:text-white",
  outlineLight: "border border-coffee text-coffee hover:bg-coffee hover:text-white",
  blush: "border border-coffee text-coffee hover:bg-coffee hover:text-white",
};

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: CommonProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className,
  children,
  href,
  ...rest
}: CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "href"> & {
    href: string;
  }) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </Link>
  );
}
