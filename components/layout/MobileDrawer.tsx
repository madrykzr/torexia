"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { NAV_LINKS, CONTACT, whatsappUrl } from "@/lib/constants";
import { InstagramIcon, TikTokIcon } from "@/components/ui/BrandIcons";
import { EASE } from "@/lib/motion";

export function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 flex w-[82%] max-w-sm flex-col bg-cream px-7 py-6 shadow-2xl md:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: EASE }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex items-center justify-between">
              <Image
                src="/images/logo.svg"
                alt="Torexia"
                width={150}
                height={27}
                className="h-6 w-auto"
              />
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-cream-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="mt-10 flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block border-b border-line py-4 font-heading text-2xl text-charcoal transition-colors hover:text-blush"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto">
              <a
                href={whatsappUrl("Hi Torexia! I'd like to know more about your abayas.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 w-full items-center justify-center rounded-full bg-coffee text-sm font-medium tracking-wide text-cream"
              >
                Enquire via WhatsApp
              </a>
              <div className="mt-6 flex items-center gap-5 text-charcoal-600">
                <a
                  href={CONTACT.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="transition-colors hover:text-blush"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
                <a
                  href={CONTACT.tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="transition-colors hover:text-blush"
                >
                  <TikTokIcon className="h-5 w-5" />
                </a>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-sm transition-colors hover:text-blush"
                >
                  {CONTACT.email}
                </a>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
