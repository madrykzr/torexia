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
    <section className="bg-cream-200 text-charcoal">
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-32 text-center sm:px-8 sm:pb-28 sm:pt-40">
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-blush-300">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-5 font-heading text-5xl leading-[1.1] sm:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-6 max-w-xl text-sm leading-loose text-charcoal-600 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
