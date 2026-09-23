"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import type { Collection, CollectionItem, Size } from "@/lib/types";
import { effectivePrice, whatsappUrl } from "@/lib/constants";
import { useCart } from "@/lib/cart";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { SizeSelector } from "@/components/shop/SizeSelector";
import { Accordion } from "@/components/shop/Accordion";
import { SizeChart } from "@/components/ui/SizeChart";
import { PriceTag } from "@/components/ui/PriceTag";

export function CollectionItemDetailClient({
  collection,
  item,
}: {
  collection: Collection;
  item: CollectionItem;
}) {
  const { add } = useCart();
  const [size, setSize] = useState<Size | null>(item.sizes[0] ?? null);
  const [added, setAdded] = useState(false);

  // Item shows its own price/sale when set; otherwise inherits both from the
  // parent collection.
  const basePrice = item.price ?? collection.price;
  const salePrice =
    item.salePrice ?? (item.price == null ? collection.salePrice : null);
  const needsSize = item.sizes.length > 0 && !size;

  // The item's own size guide when it has rows; otherwise the collection's.
  const hasOwnSizeChart = item.sizeChart.length > 0;
  const sizeChartRows = hasOwnSizeChart ? item.sizeChart : collection.sizeChart;
  const sizeChartColumns = hasOwnSizeChart
    ? item.sizeChartColumns
    : collection.sizeChartColumns;
  const sizeChartNote = hasOwnSizeChart
    ? item.sizeChartNote
    : collection.sizeChartNote;

  const enquiry = `Hi Torexia! I'm interested in the ${item.name} (${item.colour.name}${
    size ? `, size ${size}` : ""
  }). Could you share more details?`;

  function handleAdd() {
    if (needsSize) return;
    add({
      kind: "product",
      slug: item.slug,
      name: item.name,
      image: item.images[0] ?? collection.cover,
      price: effectivePrice(basePrice, salePrice),
      size: size ?? null,
      colour: item.colour.name,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <ProductGallery
        images={item.images.length ? item.images : [collection.cover]}
        alt={item.name}
      />

      <div className="lg:pt-4">
        <h1 className="font-heading text-3xl text-charcoal sm:text-4xl">
          {item.name}
        </h1>
        <div className="mt-3 text-xl">
          <PriceTag price={basePrice} salePrice={salePrice} />
        </div>

        <div className="mt-8 space-y-7">
          {/* Single colourway — static label, not an interactive selector. */}
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-charcoal-600">
              Colour
            </span>
            <div className="mt-3 flex items-center gap-2.5">
              <span
                className="h-8 w-8 rounded-full ring-1 ring-line"
                style={{ backgroundColor: item.colour.hex }}
              />
              <span className="text-sm text-charcoal">{item.colour.name}</span>
            </div>
          </div>

          {item.sizes.length > 0 && size && (
            <SizeSelector sizes={item.sizes} selected={size} onSelect={setSize} />
          )}
        </div>

        {/* CTAs — Add to Cart primary, WhatsApp enquiry below */}
        <div className="mt-9 flex flex-col gap-3">
          <button
            onClick={handleAdd}
            disabled={needsSize}
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

          <a
            href={whatsappUrl(enquiry)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-coffee text-sm font-medium tracking-wide text-coffee transition-colors hover:bg-coffee hover:text-white"
          >
            Enquire via WhatsApp
          </a>
        </div>

        {item.description && (
          <p className="mt-9 text-sm leading-loose text-charcoal-600">
            {item.description}
          </p>
        )}

        {/* Accordions */}
        <div className="mt-8">
          {sizeChartRows.length > 0 && (
            <Accordion title="Size Guide">
              <SizeChart
                columns={sizeChartColumns}
                rows={sizeChartRows}
                note={sizeChartNote}
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
