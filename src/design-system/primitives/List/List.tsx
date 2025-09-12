"use client";

import React from "react";

import { cn } from "@/lib/utils";

interface AccessibleListProps extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement> {
  as?: "ul" | "ol";
  children: React.ReactNode;
  label?: string;
  description?: string;
}

/**
 * Accessible List Primitive
 *
 * Provides semantic list structure with proper ARIA labeling
 * for improved screen reader navigation and accessibility.
 *
 * Follows WCAG 2.1 AA guidelines for:
 * - Semantic structure
 * - ARIA labeling
 * - Keyboard navigation support
 */
export const AccessibleList = React.forwardRef<
  HTMLUListElement | HTMLOListElement,
  AccessibleListProps
>(({ as: Element = "ul", children, label, description, className, ...props }, ref) => {
  const listId = React.useId();
  const descriptionId = description ? `${listId}-description` : undefined;

  return (
    <>
      {description && (
        <p id={descriptionId} className="sr-only">
          {description}
        </p>
      )}
      <Element
        ref={ref as any} // Type assertion needed for polymorphic component
        className={cn(
          // Reset default list styles
          "m-0 list-none p-0",
          // Ensure proper spacing and layout
          "space-y-0",
          className
        )}
        role={Element === "ul" ? "list" : "list"}
        aria-label={label}
        aria-describedby={descriptionId}
        {...props}
      >
        {children}
      </Element>
    </>
  );
});

AccessibleList.displayName = "AccessibleList";

interface AccessibleListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  index?: number;
  total?: number;
}

/**
 * Accessible List Item Primitive
 *
 * Provides semantic list item structure with position information
 * for screen readers.
 */
export const AccessibleListItem = React.forwardRef<HTMLLIElement, AccessibleListItemProps>(
  ({ children, index, total, className, ...props }, ref) => {
    const positionLabel =
      index !== undefined && total !== undefined ? `Item ${index + 1} of ${total}` : undefined;

    return (
      <li
        ref={ref}
        className={cn(
          // Ensure proper list item styling
          "list-item",
          className
        )}
        aria-label={positionLabel}
        {...props}
      >
        {children}
      </li>
    );
  }
);

AccessibleListItem.displayName = "AccessibleListItem";

export { AccessibleList as List, AccessibleListItem as ListItem };
