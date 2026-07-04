import { Feather, Sparkles, Scissors } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const features = [
  {
    icon: Feather,
    title: "Lightweight Comfort",
    text: "Soft cotton nida that breathes with you — made for long, easy everyday wear.",
  },
  {
    icon: Sparkles,
    title: "Modest Everyday Elegance",
    text: "Quietly refined silhouettes and detailing that feel elevated, never fussy.",
  },
  {
    icon: Scissors,
    title: "Thoughtfully Designed",
    text: "Considered fit, flared sleeves and delicate lace — designed down to the last stitch.",
  },
];

export function WhyTorexia() {
  return (
    <Section tone="dark">
      <SectionHeading
        tone="light"
        eyebrow="Why Torexia"
        title="Everyday pieces, thoughtfully made"
      />

      <div className="mt-12 grid gap-10 sm:mt-16 sm:grid-cols-3 sm:gap-8">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.1} className="text-center sm:text-left">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blush/20 text-blush-300 sm:mx-0">
              <f.icon className="h-6 w-6" strokeWidth={1.6} />
            </div>
            <h3 className="mt-6 font-heading text-xl text-cream">{f.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-cream/70">{f.text}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
