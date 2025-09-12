/**
 * Skip Link Component
 *
 * Provides "Skip to main content" functionality for keyboard users
 * following WCAG 2.1 AA guidelines for navigation bypass.
 */

"use client";

import { cn } from "@/lib/utils";
import { useSkipLink } from "@/shared/hooks/useFocusManagement";

interface SkipLinkProps {
  className?: string;
  href?: string;
  children?: React.ReactNode;
}

export function SkipLink({
  className,
  href = "#main-content",
  children = "Skip to main content",
}: SkipLinkProps) {
  const { skipToMain } = useSkipLink();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    skipToMain();
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        // Hidden by default, visible on focus
        "sr-only focus:not-sr-only",
        // Positioning and styling when focused
        "focus:absolute focus:left-4 focus:top-4 focus:z-50",
        "focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white",
        "focus:rounded focus:text-sm focus:font-medium",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        // Smooth transitions
        "transition-all duration-150",
        className
      )}
    >
      {children}
    </a>
  );
}

/**
 * Skip Links Container
 *
 * Contains multiple skip links for comprehensive navigation
 */
interface SkipLinksProps {
  className?: string;
  links?: Array<{
    href: string;
    label: string;
    target?: string;
  }>;
}

export function SkipLinks({
  className,
  links = [
    { href: "#main-content", label: "Skip to main content" },
    { href: "#navigation", label: "Skip to navigation" },
    { href: "#footer", label: "Skip to footer" },
  ],
}: SkipLinksProps) {
  const handleSkipTo = (targetId: string) => {
    const target = document.querySelector(targetId);
    if (target) {
      // Make target focusable if it's not already
      const originalTabIndex = target.getAttribute("tabindex");
      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
      }

      (target as HTMLElement).focus();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // Restore original tabindex after focus
      if (originalTabIndex === null) {
        target.removeAttribute("tabindex");
      } else {
        target.setAttribute("tabindex", originalTabIndex);
      }
    }
  };

  return (
    <nav
      className={cn("skip-links", className)}
      aria-label="Skip navigation links"
      role="navigation"
    >
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          onClick={(e) => {
            e.preventDefault();
            handleSkipTo(link.href);
          }}
          className={cn(
            // Hidden by default, visible on focus
            "sr-only focus:not-sr-only",
            // Positioning and styling when focused
            "focus:absolute focus:z-50",
            "focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white",
            "focus:rounded focus:text-sm focus:font-medium",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            // Stack skip links vertically
            "focus:block",
            // Smooth transitions
            "transition-all duration-150"
          )}
          style={{
            // Position each link below the previous one when focused
            top: `${16 + index * 48}px`,
            left: "16px",
          }}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
