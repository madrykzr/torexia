import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "light" | "outline" | "outlineLight" | "blush";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-7 text-sm font-medium tracking-wide transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush";

const variants: Record<Variant, string> = {
  primary: "bg-coffee text-cream hover:bg-coffee-700",
  light: "bg-cream text-coffee hover:bg-cream-200",
  outline: "border border-coffee/30 text-coffee hover:bg-coffee hover:text-cream",
  outlineLight: "border border-cream/40 text-cream hover:bg-cream hover:text-coffee",
  blush: "bg-blush text-white hover:bg-blush/90",
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
