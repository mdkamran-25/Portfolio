/**
 * Focus Management Utilities
 *
 * Provides comprehensive focus management following WCAG 2.1 AA guidelines
 * for modals, dialogs, and interactive components.
 */

import { useCallback, useEffect, useRef } from "react";

/**
 * Focus trap utility for modals and dialogs
 * Manages focus within a container and restores focus when closed
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const focusableSelectors = [
    "button:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
    "select:not([disabled])",
    "a[href]",
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
    "details[open] summary",
  ].join(", ");

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    return Array.from(containerRef.current.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }, [focusableSelectors]);

  const focusFirstElement = useCallback(() => {
    const focusableElements = getFocusableElements();
    const firstElement = focusableElements[0];
    if (firstElement) {
      firstElement.focus();
    }
  }, [getFocusableElements]);

  const focusLastElement = useCallback(() => {
    const focusableElements = getFocusableElements();
    const lastElement = focusableElements[focusableElements.length - 1];
    if (lastElement) {
      lastElement.focus();
    }
  }, [getFocusableElements]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isActive || !containerRef.current) return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.key === "Tab") {
        if (event.shiftKey) {
          // Shift + Tab: moving backwards
          if (document.activeElement === firstElement && lastElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: moving forwards
          if (document.activeElement === lastElement && firstElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }

      if (event.key === "Escape") {
        event.preventDefault();
        // Allow parent components to handle escape
        const escapeEvent = new Event("focustrap:escape", { bubbles: true });
        containerRef.current?.dispatchEvent(escapeEvent);
      }
    },
    [isActive, getFocusableElements]
  );

  useEffect(() => {
    if (isActive) {
      // Store the currently focused element
      previousActiveElementRef.current = document.activeElement as HTMLElement;

      // Focus the first element in the trap
      setTimeout(() => {
        focusFirstElement();
      }, 0);

      // Add event listener
      document.addEventListener("keydown", handleKeyDown);
    } else {
      // Restore focus to the previously focused element
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
        previousActiveElementRef.current = null;
      }
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, handleKeyDown, focusFirstElement]);

  return {
    containerRef,
    focusFirstElement,
    focusLastElement,
  };
}

/**
 * Skip link utility for keyboard navigation
 * Provides "skip to main content" functionality
 */
export function useSkipLink() {
  const skipToMain = useCallback(() => {
    const mainElement = document.querySelector('main, [role="main"], #main-content');
    if (mainElement) {
      (mainElement as HTMLElement).focus();
      // Scroll to ensure visibility
      mainElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return { skipToMain };
}

/**
 * Announcement utility for screen readers
 * Provides live region announcements
 */
export function useAnnouncer() {
  const announcerRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    if (!announcerRef.current) {
      // Create announcer if it doesn't exist
      const announcer = document.createElement("div");
      announcer.setAttribute("aria-live", priority);
      announcer.setAttribute("aria-atomic", "true");
      announcer.className = "sr-only";
      announcer.id = "a11y-announcer";
      document.body.appendChild(announcer);
      announcerRef.current = announcer;
    }

    // Clear previous message and announce new one
    announcerRef.current.textContent = "";
    setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = message;
      }
    }, 100);
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup announcer on unmount
      if (announcerRef.current && announcerRef.current.parentNode) {
        announcerRef.current.parentNode.removeChild(announcerRef.current);
      }
    };
  }, []);

  return { announce };
}

/**
 * Auto-focus utility for form elements
 * Focuses the first invalid field or the first input
 */
export function useAutoFocus(shouldFocus: boolean = true) {
  const containerRef = useRef<HTMLElement>(null);

  const focusFirstInvalid = useCallback(() => {
    if (!containerRef.current) return false;

    const invalidElement = containerRef.current.querySelector(
      "input:invalid, textarea:invalid, select:invalid"
    ) as HTMLElement;

    if (invalidElement) {
      invalidElement.focus();
      return true;
    }

    return false;
  }, []);

  const focusFirstInput = useCallback(() => {
    if (!containerRef.current) return false;

    const firstInput = containerRef.current.querySelector(
      "input:not([disabled]), textarea:not([disabled]), select:not([disabled])"
    ) as HTMLElement;

    if (firstInput) {
      firstInput.focus();
      return true;
    }

    return false;
  }, []);

  useEffect(() => {
    if (shouldFocus) {
      setTimeout(() => {
        // Try to focus the first invalid field, then the first input
        if (!focusFirstInvalid()) {
          focusFirstInput();
        }
      }, 100);
    }
  }, [shouldFocus, focusFirstInvalid, focusFirstInput]);

  return {
    containerRef,
    focusFirstInvalid,
    focusFirstInput,
  };
}
