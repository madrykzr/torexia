import {
  Sparkles,
  Award,
  Scissors,
  Layers,
  Feather,
  Sun,
  Users,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const features = [
  { icon: Sparkles, title: "Exclusive & timeless designs" },
  { icon: Award, title: "Quality fabrics & craftsmanship" },
  { icon: Scissors, title: "Local tailoring, made with care" },
  {
    icon: Layers,
    title:
      "Practical designs with functional details — pockets, nursing friendly, comfort fit",
  },
  { icon: Feather, title: "Lightweight, breathable & flowy materials" },
  {
    icon: Sun,
    title: "Easy to wear for daily life, work, travel & special occasions",
  },
  { icon: Users, title: "Trusted by our community" },
];

export function WhyTorexia() {
  return (
    <Section tone="dark">
      <SectionHeading
        tone="light"
        eyebrow="Why Torexia"
        title="Why choose Torexia"
      />

      <div className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Reveal
            key={f.title}
            delay={i * 0.06}
            className="flex items-start gap-4 rounded-2xl border border-cream/10 bg-cream/5 p-5"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blush/20 text-blush-300">
              <f.icon className="h-5 w-5" strokeWidth={1.6} />
            </div>
            <p className="pt-1.5 text-sm leading-relaxed text-cream/90">
              {f.title}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
