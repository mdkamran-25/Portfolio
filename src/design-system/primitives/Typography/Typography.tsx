import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "text-4xl font-bold leading-tight tracking-tight md:text-5xl",
      h2: "text-3xl font-semibold leading-tight tracking-tight md:text-4xl",
      h3: "text-2xl font-semibold leading-tight tracking-tight md:text-3xl",
      h4: "text-xl font-semibold leading-tight tracking-tight md:text-2xl",
      h5: "text-lg font-medium leading-snug tracking-tight",
      h6: "text-base font-medium leading-snug tracking-tight",
      body: "text-base leading-relaxed",
      bodyLarge: "text-lg leading-relaxed",
      bodySmall: "text-sm leading-relaxed",
      caption: "text-xs leading-normal",
      code: "font-mono text-sm bg-muted px-1.5 py-0.5 rounded border",
      lead: "text-xl leading-relaxed",
      muted: "text-sm",
      subtle: "text-xs uppercase tracking-wide font-medium",
      blockquote: "border-l-4 border-muted pl-4 italic",
    },
    color: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive",
      success: "text-green-600 dark:text-green-400",
      warning: "text-yellow-600 dark:text-yellow-400",
      info: "text-blue-600 dark:text-blue-400",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    transform: {
      none: "",
      uppercase: "uppercase",
      lowercase: "lowercase",
      capitalize: "capitalize",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "default",
    align: "left",
    transform: "none",
  },
  compoundVariants: [
    {
      variant: ["caption", "lead", "muted", "subtle", "blockquote"],
      color: "default",
      class: "text-muted-foreground",
    },
  ],
});

// Map of variants to their default HTML elements
const variantElementMap: Record<string, ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  body: "p",
  bodyLarge: "p",
  bodySmall: "p",
  caption: "span",
  code: "code",
  lead: "p",
  muted: "p",
  subtle: "span",
  blockquote: "blockquote",
};

export interface TypographyProps extends VariantProps<typeof typographyVariants> {
  /**
   * The HTML element or React component to render
   * If not provided, will use semantic default based on variant
   */
  as?: ElementType;
  /**
   * The content to render
   */
  children: ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Maximum number of lines before truncating with ellipsis
   */
  truncate?: number;
  /**
   * Whether the text should be selectable
   */
  noSelect?: boolean;
  /**
   * Additional props passed to the underlying element
   */
  [key: string]: any;
}

/**
 * Typography component for consistent text styling across the application.
 *
 * Features:
 * - Semantic HTML element mapping based on variant
 * - Responsive font sizes with mobile-first approach
 * - Color variants aligned with design tokens
 * - Text alignment and transformation options
 * - Line clamping for text truncation
 * - Accessibility-focused with proper semantic markup
 *
 * @example
 * ```tsx
 * <Typography variant="h1">Main Heading</Typography>
 * <Typography variant="body" color="muted">Body text</Typography>
 * <Typography variant="code">console.log('hello')</Typography>
 * <Typography as="span" variant="caption" truncate={2}>Long text...</Typography>
 * ```
 */
export const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      variant = "body",
      color = "default",
      align = "left",
      transform = "none",
      as,
      children,
      className,
      truncate,
      noSelect = false,
      ...props
    },
    ref
  ) => {
    // Determine the component to render
    const Component = as || variantElementMap[variant] || "p";

    // Build truncation classes
    const truncateClasses = truncate ? `line-clamp-${truncate} overflow-hidden` : "";

    // Build final className
    const classes = cn(
      typographyVariants({ variant, color, align, transform }),
      truncateClasses,
      noSelect && "select-none",
      className
    );

    return (
      <Component ref={ref} className={classes} {...props}>
        {children}
      </Component>
    );
  }
);

Typography.displayName = "Typography";

// Export individual heading components for convenience
export const Heading = forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, "variant"> & {
    level: 1 | 2 | 3 | 4 | 5 | 6;
  }
>(({ level, ...props }, ref) => {
  const variant = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  return <Typography ref={ref} variant={variant} {...props} />;
});

Heading.displayName = "Heading";

// Export specialized text components
export const Text = forwardRef<
  HTMLParagraphElement,
  Omit<TypographyProps, "variant"> & {
    size?: "sm" | "base" | "lg";
  }
>(({ size = "base", ...props }, ref) => {
  const getVariant = (textSize: "sm" | "base" | "lg") => {
    switch (textSize) {
      case "sm":
        return "bodySmall" as const;
      case "lg":
        return "bodyLarge" as const;
      default:
        return "body" as const;
    }
  };

  const variant = getVariant(size);
  return <Typography ref={ref} variant={variant} {...props} />;
});

Text.displayName = "Text";

export const Code = forwardRef<HTMLElement, Omit<TypographyProps, "variant">>((props, ref) => (
  <Typography ref={ref} variant="code" {...props} />
));

Code.displayName = "Code";

export const Caption = forwardRef<HTMLSpanElement, Omit<TypographyProps, "variant">>(
  (props, ref) => <Typography ref={ref} variant="caption" {...props} />
);

Caption.displayName = "Caption";

export const Lead = forwardRef<HTMLParagraphElement, Omit<TypographyProps, "variant">>(
  (props, ref) => <Typography ref={ref} variant="lead" {...props} />
);

Lead.displayName = "Lead";

export const Muted = forwardRef<HTMLParagraphElement, Omit<TypographyProps, "variant">>(
  (props, ref) => <Typography ref={ref} variant="muted" {...props} />
);

Muted.displayName = "Muted";

export const Blockquote = forwardRef<HTMLQuoteElement, Omit<TypographyProps, "variant">>(
  (props, ref) => <Typography ref={ref} variant="blockquote" {...props} />
);

Blockquote.displayName = "Blockquote";

// Export variant types for external use
export type TypographyVariant = VariantProps<typeof typographyVariants>["variant"];
export type TypographyColor = VariantProps<typeof typographyVariants>["color"];
export type TypographyAlign = VariantProps<typeof typographyVariants>["align"];
export type TypographyTransform = VariantProps<typeof typographyVariants>["transform"];
