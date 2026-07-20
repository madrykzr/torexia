import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { COLOUR_LIST } from "@/data/products";

export function ColourShowcase() {
  return (
    <Section tone="cream">
      <SectionHeading
        eyebrow="Our Palette"
        title="Six shades for everyday"
        description="From warm coffee to soft pastels — a calm, wearable palette designed to work with everything you already own."
      />

      <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-x-4 gap-y-8 sm:mt-16 sm:grid-cols-6">
        {COLOUR_LIST.map((colour, i) => (
          <Reveal
            key={colour.slug}
            delay={i * 0.06}
            className="flex flex-col items-center gap-3"
          >
            <div
              className="relative h-20 w-20 overflow-hidden rounded-full shadow-sm ring-1 ring-line sm:h-24 sm:w-24"
              style={{ backgroundColor: colour.hex }}
            >
              <Image
                src={`/images/products/${colour.slug}/01.jpg`}
                alt={`${colour.name} abaya`}
                fill
                sizes="96px"
                className="object-cover object-[center_58%]"
              />
            </div>
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-charcoal-600">
              {colour.name}
            </span>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
