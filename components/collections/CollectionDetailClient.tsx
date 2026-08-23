"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";
import type { Collection, Colour, Size } from "@/lib/types";
import { effectivePrice, whatsappUrl } from "@/lib/constants";
import { useCart } from "@/lib/cart";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ColourSelector } from "@/components/shop/ColourSelector";
import { SizeSelector } from "@/components/shop/SizeSelector";
import { Accordion } from "@/components/shop/Accordion";
import { SizeChart } from "@/components/ui/SizeChart";
import { PriceTag } from "@/components/ui/PriceTag";

const CATEGORY_LABEL: Record<string, string> = {
  kaftan: "Kaftan",
  jubah: "Jubah",
  abaya: "Abaya",
};

export function CollectionDetailClient({
  collection,
}: {
  collection: Collection;
}) {
  const { add } = useCart();
  const [colour, setColour] = useState<Colour | null>(
    collection.colours[0] ?? null,
  );
  const [size, setSize] = useState<Size | null>(collection.sizes[0] ?? null);
  const [added, setAdded] = useState(false);

  const images = [collection.cover, ...collection.gallery].filter(Boolean);

  // Only block the purchase when an option exists but hasn't been chosen.
  const needsSize = collection.sizes.length > 0 && !size;
  const needsColour = collection.colours.length > 0 && !colour;
  const canAdd = !needsSize && !needsColour;

  const enquiry = `Hi Torexia! I'm interested in the ${collection.name} collection${
    colour ? ` (${colour.name}` : ""
  }${colour && size ? `, size ${size})` : colour ? ")" : ""}. Could you share more details?`;

  function handleAdd() {
    if (!canAdd) return;
    add({
      kind: "collection",
      slug: collection.slug,
      name: collection.name,
      image: collection.cover,
      price: effectivePrice(collection.price, collection.salePrice),
      size: size ?? null,
      colour: colour?.name ?? null,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <ProductGallery images={images} alt={collection.name} />

      <div className="lg:pt-4">
        {collection.category && (
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-blush">
            {CATEGORY_LABEL[collection.category] ?? collection.category}
          </p>
        )}
        <h1 className="mt-2 font-heading text-4xl text-charcoal sm:text-5xl">
          {collection.name}
        </h1>
        <div className="mt-3 text-xl">
          <PriceTag price={collection.price} salePrice={collection.salePrice} />
        </div>

        {/* Selectors */}
        <div className="mt-8 space-y-7">
          {collection.colours.length > 0 && colour && (
            <ColourSelector
              colours={collection.colours}
              selected={colour}
              onSelect={setColour}
            />
          )}
          {collection.sizes.length > 0 && size && (
            <SizeSelector
              sizes={collection.sizes}
              selected={size}
              onSelect={setSize}
            />
          )}
        </div>

        {/* CTAs — Add to Cart primary, WhatsApp enquiry below */}
        <div className="mt-9 flex flex-col gap-3">
          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-coffee text-sm font-medium tracking-wide text-white transition-colors hover:bg-coffee-600 disabled:cursor-not-allowed disabled:opacity-50"
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
            href={whatsappUrl(enquiry)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-coffee text-sm font-medium tracking-wide text-coffee transition-colors hover:bg-coffee hover:text-white"
          >
            Enquire via WhatsApp
          </a>
        </div>

        {collection.description && (
          <p className="mt-9 text-sm leading-loose text-charcoal-600">
            {collection.description}
          </p>
        )}

        {/* Accordions */}
        <div className="mt-8">
          {collection.sizeChart.length > 0 && (
            <Accordion title="Size Guide">
              <SizeChart
                rows={collection.sizeChart}
                col1Label={collection.sizeChartCol1Label}
                col2Label={collection.sizeChartCol2Label}
                note={collection.sizeChartNote}
              />
            </Accordion>
          )}

          <Accordion title="Fabric & Care">
            {collection.fabric && (
              <p className="mb-2">
                <span className="text-charcoal">Fabric:</span>{" "}
                {collection.fabric} — lightweight, breathable and soft against
                the skin.
              </p>
            )}
            <ul className="list-inside list-disc space-y-1">
              <li>Gentle machine wash, cold, with like colours</li>
              <li>Do not bleach</li>
              <li>Iron on low heat if needed</li>
              <li>Hang to dry, away from direct sunlight</li>
            </ul>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
