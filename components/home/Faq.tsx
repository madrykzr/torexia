import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Accordion } from "@/components/shop/Accordion";
import type { HomeFaq } from "@/lib/sanity-content";

// The questions come from Studio → Site Settings. No questions = no section.
export function Faq({ faqs }: { faqs: HomeFaq[] }) {
  if (faqs.length === 0) return null;

  return (
    <Section tone="cream">
      <SectionHeading
        eyebrow="FAQ"
        title="Frequently asked questions"
      />
      <Reveal className="mx-auto mt-10 max-w-2xl">
        {faqs.map((f, i) => (
          <Accordion key={f.question} title={f.question} defaultOpen={i === 0}>
            {f.answer}
          </Accordion>
        ))}
      </Reveal>
    </Section>
  );
}
