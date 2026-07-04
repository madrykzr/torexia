import type { ReactNode } from "react";

/**
 * Coffee-toned banner used at the top of inner pages. Includes top padding to
 * clear the fixed navbar.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
}) {
  return (
    <section className="bg-coffee text-cream">
      <div className="mx-auto max-w-6xl px-5 pb-14 pt-28 text-center sm:px-8 sm:pb-20 sm:pt-36">
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-blush-300">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-4 font-heading text-4xl leading-tight sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream/70 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
