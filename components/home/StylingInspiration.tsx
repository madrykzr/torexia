import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { CONTACT } from "@/lib/constants";

// Placeholder editorial grid — swap for curated lookbook shots later.
const shots = [
  "/images/products/coffee/04.jpg",
  "/images/products/soft-pink/03.jpg",
  "/images/products/sage-green/03.jpg",
  "/images/products/sky-blue/03.jpg",
  "/images/products/sand/04.jpg",
  "/images/products/black/03.jpg",
];

export function StylingInspiration() {
  return (
    <Section tone="dark">
      <SectionHeading
        tone="light"
        eyebrow="Lookbook"
        title="Styling inspiration"
        description="Everyday looks and ways to wear your Torexia pieces."
      />

      <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {shots.map((src, i) => (
          <Reveal
            key={src}
            delay={i * 0.05}
            className="relative aspect-[3/4] overflow-hidden rounded-xl bg-coffee-700"
          >
            <Image
              src={src}
              alt="Torexia styling inspiration"
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
              className="object-cover transition-transform duration-700 ease-[var(--ease-soft)] hover:scale-105"
            />
          </Reveal>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <ButtonLink
          href={CONTACT.instagram.url}
          variant="outlineLight"
          className="min-h-12"
        >
          Follow {CONTACT.instagram.handle}
        </ButtonLink>
      </div>
    </Section>
  );
}
