import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { InstagramIcon, TikTokIcon } from "@/components/ui/BrandIcons";
import { WhyTorexia } from "@/components/home/WhyTorexia";
import { CONTACT } from "@/lib/constants";
import { whatsappUrl } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who is Torexia? A Malaysian modest fashion brand crafting daily abayas designed for comfort, confidence and effortless everyday elegance.",
};

const vision =
  "To become a trusted modest fashion brand from Malaysia, inspiring Muslim women with elegant, comfortable and thoughtfully designed collections.";

const mission = [
  "Design modest fashion that balances elegance and functionality",
  "Deliver premium quality with exceptional craftsmanship",
  "Create versatile collections for every stage of a Muslimah's lifestyle",
  "Build a brand rooted in trust, authenticity and lasting value",
];

const coreValues = ["Quality", "Comfort", "Modesty", "Elegance", "Trust"];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[62svh] items-end overflow-hidden">
        <Image
          src="/images/about.jpg"
          alt="Torexia model wearing a Soft Pink abaya"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[60%_top]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/85 to-cream/40" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-14 pt-36 sm:px-8 sm:pb-20">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-blush-300">
            Our Story
          </p>
          <h1 className="mt-4 font-heading text-4xl leading-tight text-charcoal sm:text-6xl">
            Who is Torexia?
          </h1>
        </div>
      </section>

      {/* Brand story */}
      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal className="max-w-xl space-y-5 text-charcoal-600">
            <p className="text-base leading-relaxed">
              Torexia is a Malaysian modest fashion brand dedicated to creating
              timeless, elegant and practical apparel for the modern Muslimah.
              Our journey began with daily abayas — designed for comfort, modesty
              and effortless elegance.
            </p>
            <p className="text-base leading-relaxed">
              Every piece is thoughtfully designed with quality craftsmanship,
              comfortable fabrics and refined details, empowering women to feel
              confident whether at work, travelling, attending events, or in
              their daily lives.
            </p>
            <p className="text-base leading-relaxed">
              At Torexia, we believe modest fashion should be beautiful,
              practical and meaningful.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-cream-200">
            <Image
              src="/images/products/sand/03.jpg"
              alt="Torexia Sand abaya detail"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </Section>

      {/* Why Torexia — moved here from the homepage */}
      <WhyTorexia tone="alt" />

      {/* Brand Foundations */}
      <Section tone="blush">
        <SectionHeading
          eyebrow="Brand Foundations"
          title="What we stand for"
          description="The vision, mission and values that guide everything we make."
        />

        <div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-2 lg:gap-16">
          {/* Vision */}
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-blush-300">
              Our Vision
            </p>
            <p className="mt-4 font-heading text-2xl leading-snug text-charcoal sm:text-3xl">
              {vision}
            </p>
          </Reveal>

          {/* Mission */}
          <Reveal delay={0.1}>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-blush-300">
              Our Mission
            </p>
            <ul className="mt-5 space-y-4">
              {mission.map((m) => (
                <li key={m} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coffee/10 text-coffee">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
                  </span>
                  <span className="text-sm leading-relaxed text-charcoal-600">
                    {m}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Core Values */}
        <Reveal delay={0.15} className="mt-14 border-t border-line pt-10">
          <p className="text-center text-xs font-medium uppercase tracking-[0.15em] text-blush-300">
            Core Values
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {coreValues.map((v) => (
              <span
                key={v}
                className="rounded-full border border-line px-5 py-2 font-heading text-base text-charcoal"
              >
                {v}
              </span>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Collaboration */}
      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal delay={0.1} className="relative order-last aspect-[4/5] overflow-hidden rounded-3xl bg-cream-200 lg:order-first">
            <Image
              src="/images/products/soft-pink/05.jpg"
              alt="Torexia Soft Pink abaya"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </Reveal>
          <div>
            <SectionHeading
              align="left"
              eyebrow="Collaborate"
              title="Let's create together"
              description="We love partnering with creators, stylists and modest-fashion voices who share our love for everyday elegance. If that sounds like you, we'd love to talk."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink
                href={whatsappUrl(
                  "Hi Torexia! I'd love to explore a collaboration.",
                )}
                variant="primary"
              >
                Collaborate via WhatsApp
              </ButtonLink>
              <ButtonLink href={`mailto:${CONTACT.email}`} variant="outline">
                Email Us
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section tone="blush">
        <SectionHeading
          eyebrow="Say Hello"
          title="Get in touch"
          description="Questions, styling help or just want to chat? We're always happy to hear from you."
        />
        <Reveal className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-4 text-center text-charcoal">
          <a
            href={`mailto:${CONTACT.email}`}
            className="text-lg transition-colors hover:text-coffee"
          >
            {CONTACT.email}
          </a>
          <a
            href={`tel:${CONTACT.phone.replace(/[\s-]/g, "")}`}
            className="text-lg transition-colors hover:text-coffee"
          >
            {CONTACT.phone}
          </a>
          <a
            href={CONTACT.website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg transition-colors hover:text-coffee"
          >
            {CONTACT.website.label}
          </a>
          <div className="mt-3 flex items-center gap-5">
            <a
              href={CONTACT.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-coffee text-charcoal transition-transform hover:scale-105"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href={CONTACT.tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-coffee text-charcoal transition-transform hover:scale-105"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
