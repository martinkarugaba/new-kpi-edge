"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, columns = {}, ...props }, ref) => {
    const { xs = 1, sm = 2, md = 3, lg = 4, xl = 5, "2xl": xxl = 6 } = columns;

    // Map column numbers to corresponding Tailwind class names
    const getColClassName = (cols: number) => {
      const colMap: Record<number, string> = {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
        5: "grid-cols-5",
        6: "grid-cols-6",
        7: "grid-cols-7",
        8: "grid-cols-8",
        9: "grid-cols-9",
        10: "grid-cols-10",
        11: "grid-cols-11",
        12: "grid-cols-12",
      };
      return colMap[cols] || "grid-cols-1";
    };

    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          getColClassName(xs),
          sm > 0 && `sm:${getColClassName(sm)}`,
          md > 0 && `md:${getColClassName(md)}`,
          lg > 0 && `lg:${getColClassName(lg)}`,
          xl > 0 && `xl:${getColClassName(xl)}`,
          xxl > 0 && `2xl:${getColClassName(xxl)}`,
          className
        )}
        {...props}
      />
    );
  }
);

Grid.displayName = "Grid";
