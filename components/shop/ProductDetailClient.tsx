"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";
import type { Product, Size, Colour, SizeChartRow } from "@/lib/types";
import { formatPrice, whatsappUrl } from "@/lib/constants";
import { useCart } from "@/lib/cart";
import { ProductGallery } from "./ProductGallery";
import { ColourSelector } from "./ColourSelector";
import { SizeSelector } from "./SizeSelector";
import { Accordion } from "./Accordion";
import { SizeChart } from "@/components/ui/SizeChart";
import { InstagramIcon } from "@/components/ui/BrandIcons";

// Abaya measurements, in inches (converted from the cm spec).
const SIZE_GUIDE: SizeChartRow[] = [
  { label: "Dada", col1: '39" – 42"', col2: '44" – 46"' },
  { label: "Labuh Baju", col1: '53" – 54"', col2: '55" – 56"' },
  { label: "Panjang Lengan", col1: '22" – 22½"', col2: '23" – 23½"' },
];

export function ProductDetailClient({ product }: { product: Product }) {
  const { add } = useCart();
  const [colour, setColour] = useState<Colour>(product.colours[0]);
  const [size, setSize] = useState<Size>("M");
  const [added, setAdded] = useState(false);

  const message = `Hi Torexia! I'm interested in the ${product.name} (${colour.name}, size ${size}). Is it available?`;

  function handleAdd() {
    add({
      kind: "product",
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? "/images/og.jpg",
      price: product.price,
      size,
      colour: colour?.name ?? null,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

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

        {/* CTAs — Add to Cart primary, WhatsApp enquiry below */}
        <div className="mt-9 flex flex-col gap-3">
          <button
            onClick={handleAdd}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-coffee text-sm font-medium tracking-wide text-white transition-colors hover:bg-coffee-600"
          >
            {added ? (
              <>
                <Check className="h-4 w-4" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" /> Add to Cart
              </>
            )}
          </button>

          {added && (
            <Link
              href="/cart"
              className="text-center text-xs font-medium uppercase tracking-[0.15em] text-blush transition-colors hover:text-coffee"
            >
              View cart →
            </Link>
          )}

          <a
            href={whatsappUrl(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-coffee text-sm font-medium tracking-wide text-coffee transition-colors hover:bg-coffee hover:text-white"
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
            <SizeChart rows={SIZE_GUIDE} col1Label="S / M" col2Label="L / XL" />
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
