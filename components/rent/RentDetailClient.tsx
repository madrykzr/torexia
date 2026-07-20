"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { RentalProduct, Size, Colour } from "@/lib/types";
import { rentalMessage, whatsappUrl } from "@/lib/constants";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ColourSelector } from "@/components/shop/ColourSelector";
import { SizeSelector } from "@/components/shop/SizeSelector";
import { Accordion } from "@/components/shop/Accordion";
import { InstagramIcon } from "@/components/ui/BrandIcons";

export function RentDetailClient({ product }: { product: RentalProduct }) {
  const [colour, setColour] = useState<Colour | null>(
    product.colours[0] ?? null,
  );
  const [size, setSize] = useState<Size>(product.sizes[0] ?? "M");
  const [days, setDays] = useState(1);
  const [date, setDate] = useState("");
  const [today] = useState(() => new Date().toISOString().slice(0, 10));

  const message = rentalMessage({
    name: product.name,
    size,
    colour: colour?.name,
    days,
    date,
  });

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <ProductGallery images={product.images} alt={product.name} />

      <div className="lg:pt-4">
        <h1 className="font-heading text-3xl text-charcoal sm:text-4xl">
          {product.name}
        </h1>
        <p className="mt-3 text-xl text-coffee">
          RM{product.rentalPricePerDay}
          <span className="text-base text-charcoal-600">/day</span>
        </p>
        <p className="mt-1 text-sm text-charcoal-600">
          Refundable deposit: RM{product.deposit}
        </p>

        <div className="mt-8 space-y-7">
          {product.colours.length > 0 && colour && (
            <ColourSelector
              colours={product.colours}
              selected={colour}
              onSelect={setColour}
            />
          )}

          {product.sizes.length > 0 && (
            <SizeSelector
              sizes={product.sizes}
              selected={size}
              onSelect={setSize}
            />
          )}

          {/* Number of days */}
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-charcoal-600">
              Number of days
            </span>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDays((d) => Math.max(1, d - 1))}
                aria-label="Decrease days"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-charcoal transition-colors hover:border-coffee disabled:opacity-40"
                disabled={days <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                min={1}
                value={days}
                onChange={(e) =>
                  setDays(Math.max(1, Math.floor(Number(e.target.value) || 1)))
                }
                aria-label="Number of rental days"
                className="h-11 w-20 rounded-full border border-line bg-transparent text-center text-sm text-charcoal focus:border-coffee focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setDays((d) => d + 1)}
                aria-label="Increase days"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-charcoal transition-colors hover:border-coffee"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Date needed */}
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-charcoal-600">
              Date needed
            </span>
            <div className="mt-3">
              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                aria-label="Date needed"
                className="h-11 rounded-full border border-line bg-transparent px-4 text-sm text-charcoal focus:border-coffee focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Estimated total */}
        <p className="mt-7 text-sm text-charcoal-600">
          Estimated rental:{" "}
          <span className="text-charcoal">
            RM{product.rentalPricePerDay * days}
          </span>{" "}
          for {days} {days === 1 ? "day" : "days"} + RM{product.deposit}{" "}
          refundable deposit
        </p>

        {/* Book CTA — WhatsApp only, no purchase */}
        <div className="mt-6">
          <a
            href={whatsappUrl(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-coffee text-sm font-medium tracking-wide text-coffee transition-colors hover:bg-coffee hover:text-white"
          >
            Book via WhatsApp
          </a>
        </div>

        {/* Description */}
        {product.description && (
          <p className="mt-9 text-sm leading-relaxed text-charcoal-600">
            {product.description}
          </p>
        )}

        {/* Accordions */}
        <div className="mt-8">
          <Accordion title="Rental Terms" defaultOpen>
            <ul className="list-inside list-disc space-y-1.5">
              <li>
                A refundable deposit of RM{product.deposit} is required to confirm
                your booking.
              </li>
              <li>
                Return the piece in its original condition within the agreed
                rental period.
              </li>
              <li>
                A cleaning fee applies — every piece is professionally cleaned
                after each rental.
              </li>
              <li>
                Late returns are charged at the daily rental rate for each extra
                day.
              </li>
              <li>
                Your deposit is refunded in full once the item is returned
                undamaged.
              </li>
            </ul>
          </Accordion>

          <Accordion title="Fabric & Care">
            <p className="mb-2">
              <span className="text-charcoal">Fabric:</span> {product.fabric} —
              lightweight, breathable and soft against the skin.
            </p>
            <p>
              Please avoid perfumes and cosmetics directly on the fabric. Any
              cleaning is handled by us between rentals.
            </p>
          </Accordion>

          <Accordion title="Booking & Enquiries">
            <p>
              Have a question about availability or fit? Message us on WhatsApp,
              or follow{" "}
              <a
                href="https://www.instagram.com/torexiaofficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-coffee underline-offset-2 hover:underline"
              >
                <InstagramIcon className="h-3.5 w-3.5" /> @torexiaofficial
              </a>{" "}
              for daily inspiration.
            </p>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
