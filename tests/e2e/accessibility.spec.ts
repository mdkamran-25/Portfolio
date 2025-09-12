import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * E2E Accessibility Tests
 *
 * Comprehensive accessibility testing using axe-core
 * Tests WCAG compliance and accessibility best practices
 */

test.describe("Accessibility Compliance", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test("should pass accessibility audit on home page", async ({ page }) => {
    await page.goto("/");

    // Wait for page to fully load
    await page.waitForLoadState("networkidle");

    // Run accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include("main")
      .exclude(".skip-accessibility") // Exclude any elements with this class
      .analyze();

    // Check for violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should pass accessibility audit on projects page", async ({ page }) => {
    await page.goto("/projects");

    await page.waitForLoadState("networkidle");

    const accessibilityScanResults = await new AxeBuilder({ page }).include("main").analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should pass accessibility audit on contact page", async ({ page }) => {
    await page.goto("/contact");

    await page.waitForLoadState("networkidle");

    const accessibilityScanResults = await new AxeBuilder({ page }).include("main").analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/");

    // Check that h1 exists and is unique
    const h1Elements = await page.locator("h1").count();
    expect(h1Elements).toBe(1);

    // Check that headings follow proper hierarchy
    const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();
    const headingLevels = await Promise.all(
      headings.map(async (heading) => {
        const tagName = await heading.evaluate((el) => el.tagName.toLowerCase());
        return parseInt(tagName.charAt(1));
      })
    );

    // Verify heading hierarchy (no skipping levels)
    for (let i = 1; i < headingLevels.length; i++) {
      const currentLevel = headingLevels[i];
      const previousLevel = headingLevels[i - 1];

      // Current level should not be more than 1 level deeper than previous
      if (currentLevel && previousLevel) {
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
      }
    }
  });

  test("should have proper color contrast", async ({ page }) => {
    await page.goto("/");

    await page.waitForLoadState("networkidle");

    // Run accessibility scan focused on color contrast
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    // Filter for color contrast violations
    const colorContrastViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.id === "color-contrast"
    );

    expect(colorContrastViolations).toEqual([]);
  });

  test("should be keyboard navigable", async ({ page }) => {
    await page.goto("/");

    // Test keyboard navigation through interactive elements
    await page.keyboard.press("Tab");

    // Check that focus is visible
    const focusedElement = await page.locator(":focus").first();
    await expect(focusedElement).toBeVisible();

    // Continue tabbing through several elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      const currentFocused = await page.locator(":focus").first();

      // Each focused element should be visible
      if ((await currentFocused.count()) > 0) {
        await expect(currentFocused).toBeVisible();
      }
    }
  });

  test("should have proper ARIA labels and roles", async ({ page }) => {
    await page.goto("/");

    await page.waitForLoadState("networkidle");

    // Run accessibility scan focused on ARIA
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "best-practice"])
      .analyze();

    // Filter for ARIA-related violations
    const ariaViolations = accessibilityScanResults.violations.filter(
      (violation) =>
        violation.id.includes("aria") ||
        violation.id.includes("label") ||
        violation.id.includes("role")
    );

    expect(ariaViolations).toEqual([]);
  });

  test("should work with screen readers", async ({ page }) => {
    await page.goto("/");

    // Test that all images have alt text
    const images = await page.locator("img").all();

    for (const image of images) {
      const alt = await image.getAttribute("alt");
      expect(alt).toBeTruthy();
      expect(alt?.trim().length).toBeGreaterThan(0);
    }

    // Test that buttons have accessible names
    const buttons = await page.locator("button").all();

    for (const button of buttons) {
      const accessibleName =
        (await button.getAttribute("aria-label")) ||
        (await button.textContent()) ||
        (await button.getAttribute("title"));
      expect(accessibleName?.trim().length).toBeGreaterThan(0);
    }
  });

  test("should handle focus management in modals", async ({ page }) => {
    await page.goto("/projects");

    // Open a payment modal
    const supportButton = page.locator("text=Support Project").first();
    await supportButton.click();

    // Wait for modal to open
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

    // Check that focus is trapped in modal
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Focus should be within the modal
    const isInModal = (await modal.locator(":focus").count()) > 0;
    expect(isInModal).toBe(true);
  });

  test("should support different viewport sizes", async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 1024, height: 768 }, // Tablet
      { width: 375, height: 667 }, // Mobile
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto("/");

      await page.waitForLoadState("networkidle");

      // Run accessibility scan for each viewport
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      const criticalViolations = accessibilityScanResults.violations.filter(
        (violation) => violation.impact === "critical" || violation.impact === "serious"
      );

      expect(criticalViolations).toEqual([]);
    }
  });

  test("should handle reduced motion preferences", async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: "reduce" });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check that animations respect reduced motion
    const animatedElements = await page.locator('[class*="animate"], [class*="transition"]').all();

    for (const element of animatedElements) {
      const computedStyle = await element.evaluate((el) => {
        return window.getComputedStyle(el);
      });

      // With reduced motion, animations should be disabled or very short
      const animationDuration = computedStyle.animationDuration;
      const transitionDuration = computedStyle.transitionDuration;

      // These should be 0s or very short for reduced motion
      if (animationDuration && animationDuration !== "0s") {
        expect(parseFloat(animationDuration)).toBeLessThan(0.1);
      }

      if (transitionDuration && transitionDuration !== "0s") {
        expect(parseFloat(transitionDuration)).toBeLessThan(0.1);
      }
    }
  });

  test("should provide clear error messages", async ({ page }) => {
    await page.goto("/contact");

    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check for accessible error messages
    const errorMessages = await page
      .locator('[role="alert"], .error-message, [aria-invalid="true"]')
      .all();

    for (const errorMessage of errorMessages) {
      await expect(errorMessage).toBeVisible();

      const text = await errorMessage.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });
});
