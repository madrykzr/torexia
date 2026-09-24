export type ShippingSettings = {
  /** RM for West Malaysia; null/undefined = free */
  feeWest: number | null;
  /** RM for East Malaysia (Sabah, Sarawak, Labuan); null/undefined = free */
  feeEast: number | null;
  /** Orders with a subtotal at or above this get free shipping; null = never */
  freeAbove: number | null;
};

export const NO_SHIPPING_FEE: ShippingSettings = {
  feeWest: null,
  feeEast: null,
  freeAbove: null,
};

const EAST_MALAYSIA = ["Sabah", "Sarawak", "W.P. Labuan"];

/**
 * Shipping fee in RM for a delivery state and cart subtotal. Rates that the
 * client hasn't filled in yet count as free, so nothing changes until they
 * set prices in Site Settings.
 */
export function shippingFee(
  state: string,
  subtotal: number,
  settings: ShippingSettings | null | undefined,
): number {
  if (!settings) return 0;
  if (settings.freeAbove != null && subtotal >= settings.freeAbove) return 0;
  const fee = EAST_MALAYSIA.includes(state) ? settings.feeEast : settings.feeWest;
  return fee != null && fee > 0 ? fee : 0;
}
