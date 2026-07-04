import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "cream" | "dark" | "blush";

const toneClasses: Record<Tone, string> = {
  cream: "bg-cream text-charcoal",
  dark: "bg-coffee text-cream",
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
      className={cn(toneClasses[tone], spacing && "py-16 sm:py-24", className)}
    >
      {container ? (
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}
