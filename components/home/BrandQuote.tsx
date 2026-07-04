import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function BrandQuote() {
  return (
    <Section tone="dark" className="relative overflow-hidden">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="font-heading text-2xl leading-snug text-cream sm:text-4xl sm:leading-snug">
          “Modest fashion isn&apos;t about covering up. It&apos;s about feeling
          beautiful, comfortable and confident — on an ordinary everyday.”
        </p>
        <p className="mt-8 text-xs font-medium uppercase tracking-[0.3em] text-blush-300">
          The Torexia Promise
        </p>
      </Reveal>
    </Section>
  );
}
