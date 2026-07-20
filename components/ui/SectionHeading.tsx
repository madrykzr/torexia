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
            "text-xs font-medium uppercase tracking-[0.15em]",
            tone === "light" ? "text-blush-300" : "text-blush",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "mt-5 font-heading text-4xl leading-[1.15] sm:text-5xl",
          // Every surface is light in this preset, so both tones read dark.
          tone === "light" ? "text-charcoal" : "text-charcoal",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 text-sm leading-loose sm:text-base",
            tone === "light" ? "text-charcoal-600" : "text-charcoal-600",
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
