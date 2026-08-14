import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { RentCard } from "@/components/rent/RentCard";
import { getAllRentalProducts } from "@/lib/sanity-content";

export const metadata: Metadata = {
  title: "Rent",
  description:
    "Rent premium Torexia abayas and kaftans for weddings, events and special occasions — elegant modest wear without the commitment. Book via WhatsApp.",
};

export default async function RentPage() {
  const products = await getAllRentalProducts();

  return (
    <>
      <PageHeader
        eyebrow="Rental"
        title="Premium Abaya Rental — Look Elegant for Every Occasion"
        subtitle="Rent a statement piece for your special day. Reserve your size and colour, then book instantly via WhatsApp."
      />
      <Section tone="cream">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 lg:grid-cols-3">
            {products.map((p, i) => (
              <RentCard key={p.id} product={p} priority={i < 3} />
            ))}
          </div>
        ) : (
          <p className="py-10 text-center text-charcoal-600">
            Rental pieces are coming soon — check back shortly.
          </p>
        )}
      </Section>
    </>
  );
}
