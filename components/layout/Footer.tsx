import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, Globe } from "lucide-react";
import { NAV_LINKS, CONTACT, SITE } from "@/lib/constants";
import { InstagramIcon, TikTokIcon } from "@/components/ui/BrandIcons";

export function Footer() {
  return (
    <footer className="bg-cream text-charcoal">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:gap-8">
        <div className="lg:col-span-2">
          <Image
            src="/images/logo-full.svg"
            alt={`Torexia — ${SITE.tagline}`}
            width={220}
            height={54}
            className="h-12 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-charcoal-600">
            {SITE.description}
          </p>
          <p className="mt-4 max-w-xs font-heading text-base italic text-charcoal">
            {SITE.promise}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-blush-300">
            Explore
          </h3>
          <ul className="mt-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-charcoal-600 transition-colors hover:text-coffee"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-blush-300">
            Connect
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-charcoal-600">
            <li>
              <a
                href={CONTACT.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-coffee"
              >
                <InstagramIcon className="h-4 w-4" /> {CONTACT.instagram.handle}
              </a>
            </li>
            <li>
              <a
                href={CONTACT.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-coffee"
              >
                <TikTokIcon className="h-4 w-4" /> {CONTACT.tiktok.handle}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-coffee"
              >
                <Mail className="h-4 w-4" /> {CONTACT.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${CONTACT.phone.replace(/[\s-]/g, "")}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-coffee"
              >
                <Phone className="h-4 w-4" /> {CONTACT.phone}
              </a>
            </li>
            <li>
              <a
                href={CONTACT.website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-coffee"
              >
                <Globe className="h-4 w-4" /> {CONTACT.website.label}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
          <p className="text-xs tracking-wide text-charcoal-600">
            © Torexia 2026. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
