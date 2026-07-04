import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Accordion } from "@/components/shop/Accordion";

const faqs = [
  {
    q: "What fabric is used?",
    a: "Cotton Nida — lightweight and breathable, perfect for all-day wear.",
  },
  {
    q: "Do you have plus size?",
    a: "Yes, we carry sizes S to XL as well as dedicated plus size collections.",
  },
  {
    q: "How long is delivery?",
    a: "3–5 working days within Malaysia.",
  },
  {
    q: "Can I return or exchange?",
    a: "Yes — within 7 days of receiving your order.",
  },
];

export function Faq() {
  return (
    <Section tone="cream">
      <SectionHeading
        eyebrow="FAQ"
        title="Frequently asked questions"
      />
      <Reveal className="mx-auto mt-10 max-w-2xl">
        {faqs.map((f, i) => (
          <Accordion key={f.q} title={f.q} defaultOpen={i === 0}>
            {f.a}
          </Accordion>
        ))}
      </Reveal>
    </Section>
  );
}
