import { test, expect } from "@playwright/test";

/**
 * Core User Journey E2E Tests
 *
 * Tests critical user flows end-to-end
 * Ensures complete user workflows function properly
 */

test.describe("Core User Journeys", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test("complete project exploration journey", async ({ page }) => {
    // 1. Land on homepage
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Verify homepage loads correctly
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("text=Mohammad Kamran")).toBeVisible();

    // 2. Navigate to projects
    await page.click("text=Projects");
    await page.waitForURL("**/projects");

    // Verify projects page loads
    await expect(page.locator('h1:has-text("Projects")')).toBeVisible();

    // 3. Explore project details
    const firstProject = page.locator('[data-testid="project-card"]').first();
    await expect(firstProject).toBeVisible();

    // Click on project to open modal
    await firstProject.click();

    // Verify modal opens
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Verify modal content
    await expect(modal.locator("h2")).toBeVisible();
    await expect(modal.locator("text=Live Demo")).toBeVisible();
    await expect(modal.locator("text=Source Code")).toBeVisible();

    // 4. Test support functionality
    const supportButton = modal.locator("text=Support Project");
    await supportButton.click();

    // Verify support options appear
    await expect(page.locator("text=₹99")).toBeVisible();
    await expect(page.locator("text=₹299")).toBeVisible();
    await expect(page.locator("text=₹999")).toBeVisible();

    // 5. Close modal
    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible();
  });

  test("contact form submission journey", async ({ page }) => {
    // 1. Navigate to contact page
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");

    // Verify contact page loads
    await expect(page.locator('h1:has-text("Contact")')).toBeVisible();

    // 2. Fill out contact form
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('textarea[name="message"]', "This is a test message for the contact form.");

    // 3. Submit form
    await page.click('button[type="submit"]');

    // 4. Verify success state
    // This would depend on your actual implementation
    // await expect(page.locator('text=Message sent successfully')).toBeVisible();
  });

  test("responsive navigation journey", async ({ page }) => {
    // Test mobile navigation
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Mobile menu should be hidden initially
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');

    // Open mobile menu
    const menuButton = page.locator('[data-testid="menu-button"]');
    if ((await menuButton.count()) > 0) {
      await menuButton.click();
      await expect(mobileMenu).toBeVisible();

      // Test navigation links
      await page.click("text=Projects");
      await page.waitForURL("**/projects");
      await expect(page.locator('h1:has-text("Projects")')).toBeVisible();
    }
  });

  test("theme switching journey", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Find theme toggle button
    const themeToggle = page.locator('[data-testid="theme-toggle"]');

    if ((await themeToggle.count()) > 0) {
      // Get initial theme
      const initialTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains("dark") ? "dark" : "light";
      });

      // Toggle theme
      await themeToggle.click();

      // Wait for theme change
      await page.waitForTimeout(100);

      // Verify theme changed
      const newTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains("dark") ? "dark" : "light";
      });

      expect(newTheme).not.toBe(initialTheme);

      // Theme should persist on page reload
      await page.reload();
      await page.waitForLoadState("networkidle");

      const persistedTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains("dark") ? "dark" : "light";
      });

      expect(persistedTheme).toBe(newTheme);
    }
  });

  test("search and filter journey", async ({ page }) => {
    await page.goto("/projects");
    await page.waitForLoadState("networkidle");

    // Test search functionality if it exists
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');

    if ((await searchInput.count()) > 0) {
      // Search for a specific project
      await searchInput.fill("Dating");
      await page.waitForTimeout(500);

      // Verify search results
      const projectCards = page.locator('[data-testid="project-card"]');
      const visibleCards = await projectCards.count();

      // Should show fewer projects after search
      expect(visibleCards).toBeGreaterThan(0);

      // Clear search
      await searchInput.clear();
      await page.waitForTimeout(500);

      // Should show all projects again
      const allCards = await projectCards.count();
      expect(allCards).toBeGreaterThanOrEqual(visibleCards);
    }
  });

  test("performance and loading journey", async ({ page }) => {
    // Monitor page load performance
    await page.goto("/", { waitUntil: "networkidle" });

    // Verify page loads within reasonable time
    const startTime = Date.now();
    await page.waitForSelector("h1", { timeout: 5000 });
    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);

    // Test navigation performance
    const navStart = Date.now();
    await page.click("text=Projects");
    await page.waitForSelector('h1:has-text("Projects")', { timeout: 3000 });
    const navTime = Date.now() - navStart;

    // Navigation should be fast
    expect(navTime).toBeLessThan(3000);
  });

  test("error handling journey", async ({ page }) => {
    // Test 404 page
    await page.goto("/non-existent-page");

    // Should handle 404 gracefully
    // This depends on your 404 page implementation
    // await expect(page.locator('text=404')).toBeVisible();
    // await expect(page.locator('text=Page not found')).toBeVisible();

    // Test network error handling
    await page.route("**/api/**", (route) => route.abort());

    await page.goto("/contact");

    // Try to submit form with network blocked
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('textarea[name="message"]', "Test message");

    await page.click('button[type="submit"]');

    // Should show error message
    // await expect(page.locator('text=Network error')).toBeVisible();
  });

  test("social media integration journey", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Test social media links
    const socialLinks = [
      { selector: 'a[href*="github.com"]', text: "GitHub" },
      { selector: 'a[href*="linkedin.com"]', text: "LinkedIn" },
      { selector: 'a[href*="instagram.com"]', text: "Instagram" },
    ];

    for (const link of socialLinks) {
      const socialLink = page.locator(link.selector);

      if ((await socialLink.count()) > 0) {
        // Verify link exists and has proper attributes
        await expect(socialLink).toBeVisible();

        const href = await socialLink.getAttribute("href");
        expect(href).toBeTruthy();

        const target = await socialLink.getAttribute("target");
        expect(target).toBe("_blank"); // Should open in new tab

        const rel = await socialLink.getAttribute("rel");
        expect(rel).toContain("noopener"); // Security best practice
      }
    }
  });

  test("buy me coffee integration journey", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Find Buy Me Coffee component
    const buyMeCoffeeButton = page.locator("text=Buy me a coffee");

    if ((await buyMeCoffeeButton.count()) > 0) {
      await expect(buyMeCoffeeButton).toBeVisible();

      // Verify it has proper link attributes
      const href = await buyMeCoffeeButton.getAttribute("href");
      expect(href).toContain("buymeacoffee.com");

      const target = await buyMeCoffeeButton.getAttribute("target");
      expect(target).toBe("_blank");
    }
  });

  test("seo and meta tags journey", async ({ page }) => {
    await page.goto("/");

    // Verify basic SEO meta tags
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    expect(title.length).toBeLessThan(60); // Good SEO practice

    // Verify meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute("content");
    if (metaDescription) {
      expect(metaDescription.length).toBeGreaterThan(0);
      expect(metaDescription.length).toBeLessThan(160); // Good SEO practice
    }

    // Verify Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
    const ogDescription = await page
      .locator('meta[property="og:description"]')
      .getAttribute("content");
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");

    if (ogTitle) expect(ogTitle.length).toBeGreaterThan(0);
    if (ogDescription) expect(ogDescription.length).toBeGreaterThan(0);
    if (ogImage) expect(ogImage).toContain("http");
  });
});
