import { formatPrice } from "@/lib/constants";
import { cn } from "@/lib/cn";

/**
 * Price display with optional discount. When `salePrice` is set and lower than
 * `price`, the original shows with a line through it and the sale price beside
 * it. `tone="light"` is for use over dark imagery (e.g. product cards).
 */
export function PriceTag({
  price,
  salePrice,
  tone = "default",
  className,
}: {
  price: number | null;
  salePrice?: number | null;
  tone?: "default" | "light";
  className?: string;
}) {
  if (price == null) {
    return (
      <span className={cn(tone === "light" ? "text-white" : "text-coffee", className)}>
        Price on enquiry
      </span>
    );
  }

  const onSale = salePrice != null && salePrice < price;

  if (!onSale) {
    return (
      <span className={cn(tone === "light" ? "text-white" : "text-coffee", className)}>
        {formatPrice(price)}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span
        className={cn(
          "line-through decoration-1",
          tone === "light" ? "text-white/60" : "text-charcoal-500",
        )}
      >
        {formatPrice(price)}
      </span>
      <span className={tone === "light" ? "text-white" : "text-coffee"}>
        {formatPrice(salePrice)}
      </span>
    </span>
  );
}
