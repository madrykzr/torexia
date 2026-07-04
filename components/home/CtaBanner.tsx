import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";

export function CtaBanner() {
  return (
    <Section tone="cream">
      <Reveal className="flex flex-col items-center gap-6 rounded-3xl bg-coffee px-6 py-14 text-center sm:px-12 sm:py-20">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-blush-300">
          Just Arrived
        </p>
        <h2 className="max-w-2xl font-heading text-3xl leading-tight text-cream sm:text-5xl">
          New Collection Available
        </h2>
        <p className="max-w-md text-sm text-cream/70 sm:text-base">
          Discover the latest daily abayas — crafted in six calming shades,
          ready to wear.
        </p>
        <ButtonLink href="/shop" variant="light" className="mt-2 min-h-12 px-9">
          Shop the Collection
        </ButtonLink>
      </Reveal>
    </Section>
  );
}
