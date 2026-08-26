import type { SizeChartRow } from "@/lib/types";

/**
 * Brand-styled measurement table. Replaces the photographed size-chart image
 * so every collection reads the same, at any screen size. Supports any
 * number of size columns (e.g. 2 for M/L, 4 for S/M/L/XL).
 */
export function SizeChart({
  columns,
  rows,
  note,
}: {
  columns: string[];
  rows: SizeChartRow[];
  note?: string | null;
}) {
  if (rows.length === 0 || columns.length === 0) return null;

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
              {columns.map((col, i) => (
                <th
                  key={`${col}-${i}`}
                  className="py-3 pr-4 text-right text-[10px] font-medium uppercase tracking-[0.15em] text-charcoal-600 last:pr-0 sm:text-center"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-line/70">
                <td className="py-3.5 pr-4 text-sm text-charcoal">
                  {row.label}
                </td>
                {columns.map((_, i) => (
                  <td
                    key={i}
                    className="py-3.5 pr-4 text-right font-heading text-base text-charcoal last:pr-0 sm:text-center"
                  >
                    {row.values[i] ?? ""}
                  </td>
                ))}
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
