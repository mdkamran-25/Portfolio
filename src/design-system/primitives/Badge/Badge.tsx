import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import React from "react";

import { getTechColor } from "@/design-system/tokens/tech-colors";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium leading-none transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-neutral-900",
  {
    variants: {
      variant: {
        default: "bg-neutral-600/20 text-neutral-300 border border-neutral-600/30",
        primary: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
        success: "bg-green-500/20 text-green-300 border border-green-500/30",
        warning: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
        error: "bg-red-500/20 text-red-300 border border-red-500/30",
        tech: "", // Dynamic based on tech name
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  techName?: string; // For tech variant
  asChild?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, children, techName, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "span";

    // Handle tech variant with dynamic coloring
    const finalClassName = React.useMemo(() => {
      if (variant === "tech" && techName) {
        return clsx(
          "inline-flex items-center rounded-full font-medium leading-none transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-neutral-900",
          size === "sm" && "px-2 py-0.5 text-xs",
          size === "md" && "px-3 py-1 text-xs",
          size === "lg" && "px-4 py-1.5 text-sm",
          getTechColor(techName),
          className
        );
      }

      return clsx(badgeVariants({ variant, size }), className);
    }, [variant, size, techName, className]);

    return (
      <Comp className={finalClassName} ref={ref} role="badge" {...props}>
        {children}
      </Comp>
    );
  }
);

Badge.displayName = "Badge";
