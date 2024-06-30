import * as React from "react";
import { cn } from "@/lib/utils";

const StatsCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      (className =
        "flex flex-col rounded-lg bg-primary-foreground px-4 py-8 text-center"),
      className
    )}
    {...props}
  />
));

StatsCard.displayName = "StatsCard";

const StatsCardTitle = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <dt
    ref={ref}
    className={cn(
      "order-last text-lg font-medium text-secondary-foreground",
      className
    )}
    {...props}
  />
));

StatsCardTitle.displayName = "StatsCardTitle";

const StatsText = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <dd
    ref={ref}
    className={cn(
      "text-4xl font-extrabold text-primary md:text-5xl",
      className
    )}
    {...props}
  />
));

StatsText.displayName = "StatsText";

export { StatsCard, StatsText, StatsCardTitle };
