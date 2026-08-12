import type { SizeChartRow } from "@/lib/types";

/**
 * Brand-styled measurement table. Replaces the photographed size-chart image
 * so every collection reads the same, at any screen size.
 */
export function SizeChart({
  rows,
  col1Label = "S / M",
  col2Label = "L / XL",
  note,
}: {
  rows: SizeChartRow[];
  col1Label?: string;
  col2Label?: string;
  note?: string | null;
}) {
  if (rows.length === 0) return null;

  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-charcoal-600">
        Measurements in inches
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[20rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              <th className="py-3 pr-4 text-[10px] font-medium uppercase tracking-[0.15em] text-charcoal-600">
                Measurement
              </th>
              <th className="py-3 pr-4 text-right text-[10px] font-medium uppercase tracking-[0.15em] text-charcoal-600 sm:text-center">
                {col1Label}
              </th>
              <th className="py-3 text-right text-[10px] font-medium uppercase tracking-[0.15em] text-charcoal-600 sm:text-center">
                {col2Label}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-line/70">
                <td className="py-3.5 pr-4 text-sm text-charcoal">
                  {row.label}
                </td>
                <td className="py-3.5 pr-4 text-right font-heading text-base text-charcoal sm:text-center">
                  {row.col1}
                </td>
                <td className="py-3.5 text-right font-heading text-base text-charcoal sm:text-center">
                  {row.col2}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {note && (
        <p className="mt-4 text-xs uppercase tracking-[0.15em] text-charcoal-600">
          {note}
        </p>
      )}
    </div>
  );
}
