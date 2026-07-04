import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  /** "dark" = charcoal text (light bg); "light" = cream text (dark bg) */
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        align === "center" ? "mx-auto text-center" : "text-left",
        "max-w-2xl",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "text-xs font-medium uppercase tracking-[0.28em]",
            tone === "light" ? "text-blush-300" : "text-blush",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "mt-3 font-heading text-3xl leading-tight sm:text-4xl",
          tone === "light" ? "text-cream" : "text-charcoal",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-sm leading-relaxed sm:text-base",
            tone === "light" ? "text-cream/70" : "text-charcoal-600",
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
