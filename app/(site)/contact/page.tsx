import type { Metadata } from "next";
import { Mail, Phone, Globe, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { InstagramIcon, TikTokIcon } from "@/components/ui/BrandIcons";
import { CONTACT, whatsappUrl } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Torexia — message us on WhatsApp, email, or follow us on Instagram and TikTok. We're happy to help with sizing, styling and orders.",
};

const channels = [
  {
    label: "WhatsApp",
    value: CONTACT.phone,
    href: whatsappUrl("Hi Torexia! I'd like to ask about your collections."),
    icon: MessageCircle,
    external: true,
  },
  {
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    icon: Mail,
    external: false,
  },
  {
    label: "Call us",
    value: CONTACT.phone,
    href: `tel:${CONTACT.phone.replace(/[\s-]/g, "")}`,
    icon: Phone,
    external: false,
  },
  {
    label: "Instagram",
    value: CONTACT.instagram.handle,
    href: CONTACT.instagram.url,
    icon: InstagramIcon,
    external: true,
  },
  {
    label: "TikTok",
    value: CONTACT.tiktok.handle,
    href: CONTACT.tiktok.url,
    icon: TikTokIcon,
    external: true,
  },
  {
    label: "Website",
    value: CONTACT.website.label,
    href: CONTACT.website.url,
    icon: Globe,
    external: true,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact Us"
        subtitle="Questions about sizing, styling or your order? We'd love to hear from you — reach us on any channel below."
      />
      <Section tone="cream">
        <div className="mx-auto max-w-3xl">
          {/* Primary CTA — WhatsApp is fastest */}
          <Reveal className="flex flex-col items-center text-center">
            <p className="text-sm leading-loose text-charcoal-600">
              The quickest way to reach us is on WhatsApp — we usually reply
              within a few hours.
            </p>
            <ButtonLink
              href={whatsappUrl(
                "Hi Torexia! I'd like to ask about your collections.",
              )}
              variant="primary"
              className="mt-6 min-h-12 px-9"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </ButtonLink>
          </Reveal>

          {/* All channels */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {channels.map((c, i) => {
              const Icon = c.icon;
              return (
                <Reveal key={c.label} delay={i * 0.06}>
                  <a
                    href={c.href}
                    target={c.external ? "_blank" : undefined}
                    rel={c.external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 rounded-2xl border border-line bg-white/50 p-5 transition-colors hover:border-coffee hover:bg-white"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-200 text-coffee">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-medium uppercase tracking-[0.15em] text-charcoal-600">
                        {c.label}
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-charcoal">
                        {c.value}
                      </span>
                    </span>
                  </a>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="mt-12 text-center">
            <p className="text-xs uppercase tracking-[0.15em] text-charcoal-600">
              Based in Malaysia · Shipping nationwide
            </p>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
