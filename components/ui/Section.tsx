import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "cream" | "alt" | "dark" | "blush";

const toneClasses: Record<Tone, string> = {
  cream: "bg-cream text-charcoal",
  /** Alternating warm cream — slightly deeper than the page base */
  alt: "bg-cream-200 text-charcoal",
  dark: "bg-espresso text-cream",
  blush: "bg-blush-100 text-charcoal",
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
