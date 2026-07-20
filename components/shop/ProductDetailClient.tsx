"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import type { Product, Size, Colour } from "@/lib/types";
import { formatPrice, whatsappUrl } from "@/lib/constants";
import { ProductGallery } from "./ProductGallery";
import { ColourSelector } from "./ColourSelector";
import { SizeSelector } from "./SizeSelector";
import { Accordion } from "./Accordion";
import { InstagramIcon } from "@/components/ui/BrandIcons";

const SIZE_GUIDE: { size: Size; chest: number; length: number; sleeve: number }[] =
  [
    { size: "S", chest: 100, length: 135, sleeve: 56 },
    { size: "M", chest: 106, length: 137, sleeve: 57 },
    { size: "L", chest: 112, length: 140, sleeve: 58 },
    { size: "XL", chest: 118, length: 142, sleeve: 59 },
  ];

export function ProductDetailClient({ product }: { product: Product }) {
  const [colour, setColour] = useState<Colour>(product.colours[0]);
  const [size, setSize] = useState<Size>("M");

  const message = `Hi Torexia! I'm interested in the ${product.name} (${colour.name}, size ${size}). Is it available?`;

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <ProductGallery images={product.images} alt={product.name} />

      <div className="lg:pt-4">
        <h1 className="font-heading text-3xl text-charcoal sm:text-4xl">
          {product.name}
        </h1>
        <p className="mt-3 text-xl text-coffee">{formatPrice(product.price)}</p>

        <div className="mt-8 space-y-7">
          <ColourSelector
            colours={product.colours}
            selected={colour}
            onSelect={setColour}
          />
          <SizeSelector sizes={product.sizes} selected={size} onSelect={setSize} />
        </div>

        {/* CTAs */}
        <div className="mt-9 flex flex-col gap-3">
          <div className="group relative">
            <button
              disabled
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-coffee/40 text-sm font-medium tracking-wide text-cream/90"
            >
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </button>
            <span
              role="tooltip"
              className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-charcoal px-4 py-2 text-xs text-cream opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            >
              Coming Soon — Available in Phase 2
            </span>
          </div>

          <a
            href={whatsappUrl(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-coffee text-sm font-medium tracking-wide text-coffee transition-colors hover:bg-coffee hover:text-cream"
          >
            Enquire via WhatsApp
          </a>
        </div>

        {/* Description */}
        <p className="mt-9 text-sm leading-relaxed text-charcoal-600">
          {product.description}
        </p>

        {/* Accordions */}
        <div className="mt-8">
          <Accordion title="Size Guide">
            <p className="mb-4">
              Measurements are approximate, in centimetres. For an oversized,
              relaxed fit, size down or up as you prefer.
            </p>
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line text-charcoal">
                  <th className="py-2 pr-3 font-medium">Size</th>
                  <th className="py-2 pr-3 font-medium">Chest</th>
                  <th className="py-2 pr-3 font-medium">Length</th>
                  <th className="py-2 font-medium">Sleeve</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_GUIDE.map((r) => (
                  <tr key={r.size} className="border-b border-line">
                    <td className="py-2 pr-3 font-medium text-charcoal">
                      {r.size}
                    </td>
                    <td className="py-2 pr-3">{r.chest} cm</td>
                    <td className="py-2 pr-3">{r.length} cm</td>
                    <td className="py-2">{r.sleeve} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Accordion>

          <Accordion title="Fabric & Care">
            <p className="mb-2">
              <span className="text-charcoal">Fabric:</span> {product.fabric} —
              lightweight, breathable and soft against the skin.
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>Gentle machine wash, cold, with like colours</li>
              <li>Do not bleach</li>
              <li>Iron on low heat if needed</li>
              <li>Hang to dry, away from direct sunlight</li>
            </ul>
          </Accordion>

          <Accordion title="Styling & Enquiries">
            <p>
              Need styling advice or have a question about fit? Message us on
              WhatsApp, or follow{" "}
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
