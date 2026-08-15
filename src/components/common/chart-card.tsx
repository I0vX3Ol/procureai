import { useId, type ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ChartSeries {
  /** Column heading in the text alternative. */
  label: string;
  /** Formatted value for each row, in the same order as `rows`. */
  values: string[];
}

interface ChartCardProps {
  title: string;
  description?: string;
  /** Row labels — typically the x-axis categories. */
  rows: string[];
  series: ChartSeries[];
  /** Chart height utility class, e.g. `h-64`. */
  heightClassName?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * Chart wrapper that pairs a visual chart with an equivalent data table.
 *
 * The table is visually hidden but present in the accessibility tree, so screen
 * reader and keyboard users get the same information the chart conveys
 * (WCAG 2.2 1.1.1 Non-text Content).
 */
export function ChartCard({
  title,
  description,
  rows,
  series,
  heightClassName = "h-64",
  action,
  className,
  children,
}: ChartCardProps) {
  const tableId = useId();

  return (
    <Card className={className}>
      <CardHeader className={cn(action && "flex-row items-start justify-between gap-4 space-y-0")}>
        <div className="min-w-0">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription className="mt-1.5">{description}</CardDescription>}
        </div>
        {action}
      </CardHeader>
      <CardContent>
        <div className={heightClassName} role="img" aria-describedby={tableId} aria-label={title}>
          {children}
        </div>

        <table id={tableId} className="sr-only">
          <caption>
            {title}
            {description ? `. ${description}` : ""}
          </caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              {series.map((item) => (
                <th key={item.label} scope="col">
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row}>
                <th scope="row">{row}</th>
                {series.map((item) => (
                  <td key={item.label}>{item.values[index] ?? "—"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
