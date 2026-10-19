import { Star } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import type { HomeReview } from "@/lib/sanity-content";

function Stars() {
  return (
    <div className="flex gap-0.5 text-blush" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" strokeWidth={0} />
      ))}
    </div>
  );
}

// The reviews come from Studio → Site Settings. No reviews = no section.
export function CustomerReviews({ reviews }: { reviews: HomeReview[] }) {
  if (reviews.length === 0) return null;

  return (
    <Section tone="alt">
      <SectionHeading
        eyebrow="Reviews"
        title="Loved by our community"
        description="What our customers say about wearing Torexia."
      />

      <div className="mt-12 grid gap-6 sm:mt-16 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <Reveal key={r.name} delay={i * 0.1}>
            <figure className="flex h-full flex-col rounded-2xl border border-line bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
              <Stars />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-charcoal-600">
                “{r.text}”
              </blockquote>
              <figcaption className="mt-6">
                <p className="font-heading text-base text-charcoal">{r.name}</p>
                {r.location && (
                  <p className="text-xs tracking-wide text-charcoal-600">
                    {r.location}
                  </p>
                )}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
