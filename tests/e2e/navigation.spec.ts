import { test, expect } from "@playwright/test";
import { HomePage, ProjectsPage, AboutPage, ContactPage, TestUtils } from "./utils/page-objects";
import { testData } from "./fixtures/test-data";

/**
 * E2E Test Suite: Core Navigation & Page Loading
 *
 * Tests the fundamental user journeys across the portfolio website.
 * Covers navigation, page loading, and basic functionality.
 */

test.describe("Core Navigation and Page Loading", () => {
  test.beforeEach(async ({ page }) => {
    // Set up any global configurations
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test("should load home page successfully", async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();

    // Verify page loads and main sections are visible
    await homePage.verifyAllSectionsVisible();

    // Check page title
    await expect(page).toHaveTitle(/kamran|portfolio|developer/i);

    // Verify no console errors
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Allow some time for any async operations
    await page.waitForTimeout(2000);

    // Filter out known non-critical errors (like missing favicon)
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes("favicon") && !error.includes("404") && !error.includes("manifest.json")
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test("should navigate to all main pages", async ({ page }) => {
    const routes = testData.navigation.routes;

    for (const route of routes) {
      await page.goto(route.path);

      // Wait for page to load
      await page.waitForLoadState("networkidle");

      // Check that main content is visible
      await expect(page.locator("main").or(page.locator("body"))).toBeVisible();

      // Verify URL
      expect(page.url()).toContain(route.path);

      // Take screenshot for visual regression testing
      await TestUtils.takeScreenshot(page, `navigation-${route.name.toLowerCase()}`);
    }
  });

  test("should display projects page with project list", async ({ page }) => {
    const projectsPage = new ProjectsPage(page);

    await projectsPage.goto();

    // Verify projects are displayed
    const projectCount = await projectsPage.getProjectCount();
    expect(projectCount).toBeGreaterThanOrEqual(testData.projects.expectedMinimumCount);

    // Check if project titles are visible
    await expect(projectsPage.projectTitles.first()).toBeVisible();
  });

  test("should display about page with profile information", async ({ page }) => {
    const aboutPage = new AboutPage(page);

    await aboutPage.goto();

    // Verify profile image is visible
    await expect(aboutPage.profileImage).toBeVisible();

    // Verify skills section exists
    await expect(aboutPage.skillsSection).toBeVisible();

    // Check social links functionality
    await aboutPage.verifySocialLinksWork();
  });

  test("should load contact page with functional form", async ({ page }) => {
    const contactPage = new ContactPage(page);

    await contactPage.goto();

    // Verify all form fields are present
    await expect(contactPage.nameInput).toBeVisible();
    await expect(contactPage.emailInput).toBeVisible();
    await expect(contactPage.subjectInput).toBeVisible();
    await expect(contactPage.messageInput).toBeVisible();
    await expect(contactPage.sendButton).toBeVisible();

    // Test form validation
    await contactPage.verifyFormValidation();
  });

  test("should be responsive across different screen sizes", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Test responsiveness
    await TestUtils.checkResponsiveness(page);
  });

  test("should meet basic accessibility requirements", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Run basic accessibility checks
    await TestUtils.checkAccessibility(page);

    // Check for proper heading structure
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // Check for navigation landmark
    await expect(page.locator('nav, [role="navigation"]')).toBeVisible();

    // Check for main landmark
    await expect(page.locator('main, [role="main"]')).toBeVisible();
  });

  test("should handle network failures gracefully", async ({ page, context }) => {
    // Simulate offline scenario
    await context.setOffline(true);

    try {
      await page.goto("/", { timeout: 5000 });
    } catch (error) {
      // Expected behavior when offline
      expect(error).toBeDefined();
    }

    // Restore connection
    await context.setOffline(false);

    // Verify page loads normally after connection restored
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.verifyAllSectionsVisible();
  });

  test("should have proper meta tags for SEO", async ({ page }) => {
    await page.goto("/");

    // Check essential meta tags
    const title = await page.locator("title").textContent();
    expect(title).toMatch(testData.seo.expectedTitlePattern);

    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(testData.seo.expectedDescriptionMinLength);

    // Check viewport meta tag
    const viewport = await page.locator('meta[name="viewport"]').getAttribute("content");
    expect(viewport).toBeTruthy();

    // Check robots meta tag
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toBeAttached();
  });

  test("should load external resources successfully", async ({ page }) => {
    const homePage = new HomePage(page);

    // Track failed network requests
    const failedRequests: string[] = [];
    page.on("requestfailed", (request) => {
      // Filter out non-critical failures
      if (!request.url().includes("favicon") && !request.url().includes("ads")) {
        failedRequests.push(request.url());
      }
    });

    await homePage.goto();
    await page.waitForLoadState("networkidle");

    // Check that no critical resources failed to load
    expect(failedRequests).toHaveLength(0);

    // Verify images load properly
    const images = page.locator("img");
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute("src");

      if (src && !src.startsWith("data:")) {
        // Check that image has natural dimensions (loaded successfully)
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
      }
    }
  });
});
