import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "cream" | "white" | "alt" | "blush" | "dark";

const toneClasses: Record<Tone, string> = {
  /** Soft warm white — the page base */
  cream: "bg-cream text-charcoal",
  /** Clean white — product-led sections */
  white: "bg-white text-charcoal",
  /** Soft peach */
  alt: "bg-cream-200 text-charcoal",
  /** Soft blush pink */
  blush: "bg-blush-100 text-charcoal",
  /** Legacy alias — there are no dark sections in this preset */
  dark: "bg-blush-100 text-charcoal",
};

export function Section({
  children,
  tone = "cream",
  id,
  className,
  container = true,
  spacing = true,
}: {
  children: ReactNode;
  tone?: Tone;
  id?: string;
  className?: string;
  container?: boolean;
  spacing?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(toneClasses[tone], spacing && "py-20 sm:py-32", className)}
    >
      {container ? (
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}
