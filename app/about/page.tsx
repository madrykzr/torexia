import type { Metadata } from "next";
import Image from "next/image";
import { Heart, Sparkles, Leaf, Scissors } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { InstagramIcon, TikTokIcon } from "@/components/ui/BrandIcons";
import { CONTACT } from "@/lib/constants";
import { whatsappUrl } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who is Torexia? A Malaysian modest fashion brand crafting daily abayas designed for comfort, confidence and effortless everyday elegance.",
};

const values = [
  {
    icon: Heart,
    title: "Comfort First",
    text: "If it isn't comfortable enough to wear all day, it never leaves our studio.",
  },
  {
    icon: Sparkles,
    title: "Modest by Design",
    text: "Elegant coverage that feels intentional and quietly beautiful.",
  },
  {
    icon: Leaf,
    title: "Made for Real Life",
    text: "Designed for busy, everyday women — not just special occasions.",
  },
  {
    icon: Scissors,
    title: "Considered Craft",
    text: "Thoughtful fits, fine fabrics and details finished with care.",
  },
];

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
        <div className="absolute inset-0 bg-gradient-to-t from-coffee/85 via-coffee/30 to-coffee/40" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-14 pt-28 sm:px-8 sm:pb-20">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-blush-300">
            Our Story
          </p>
          <h1 className="mt-4 font-heading text-4xl leading-tight text-cream sm:text-6xl">
            Who is Torexia?
          </h1>
        </div>
      </section>

      {/* Brand story */}
      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal className="max-w-xl space-y-5 text-charcoal-600">
            <p className="text-base leading-relaxed">
              Torexia began with a simple frustration: modest wear that asked you
              to choose between looking put-together and actually feeling
              comfortable. We didn&apos;t think that was a fair trade.
            </p>
            <p className="text-base leading-relaxed">
              So we set out to make the daily abaya we always wanted — cut from
              soft cotton nida, finished with delicate lace, and designed to move
              gracefully from morning errands to evening gatherings.
            </p>
            <p className="text-base leading-relaxed">
              Today, Torexia is a Malaysian modest fashion brand built around one
              belief: everyday elegance should feel effortless. Every piece we
              make is designed for real women, living real, full days.
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

      {/* Mission & Values */}
      <Section tone="dark">
        <SectionHeading
          tone="light"
          eyebrow="Mission & Values"
          title="What we stand for"
          description="A few principles that shape every Torexia piece."
        />
        <div className="mt-12 grid gap-8 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08}>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blush/20 text-blush-300">
                <v.icon className="h-5 w-5" strokeWidth={1.6} />
              </div>
              <h3 className="mt-5 font-heading text-lg text-cream">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/70">
                {v.text}
              </p>
            </Reveal>
          ))}
        </div>
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
          <div className="mt-3 flex items-center gap-5">
            <a
              href={CONTACT.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-coffee text-cream transition-transform hover:scale-105"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href={CONTACT.tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-coffee text-cream transition-transform hover:scale-105"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
