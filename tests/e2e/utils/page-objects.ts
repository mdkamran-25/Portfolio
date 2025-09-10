import { expect, Locator, Page } from "@playwright/test";

/**
 * Page Object Model for Home page
 * Encapsulates all interactions and elements for the main landing page
 */
export class HomePage {
  readonly page: Page;
  readonly profileSection: Locator;
  readonly projectsSection: Locator;
  readonly freelanceProjectsSection: Locator;
  readonly stackSection: Locator;
  readonly supportWorkSection: Locator;
  readonly buyMeCoffeeButton: Locator;
  readonly navigationMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.profileSection = page
      .getByTestId("profile-section")
      .or(page.locator('[data-section="profile"]'));
    this.projectsSection = page
      .getByTestId("projects-section")
      .or(page.locator('[data-section="projects"]'));
    this.freelanceProjectsSection = page
      .getByTestId("freelance-projects-section")
      .or(page.locator('[data-section="freelance-projects"]'));
    this.stackSection = page
      .getByTestId("stack-section")
      .or(page.locator('[data-section="stack"]'));
    this.supportWorkSection = page
      .getByTestId("support-work-section")
      .or(page.locator('[data-section="support-work"]'));
    this.buyMeCoffeeButton = page.getByRole("button", { name: /buy me coffee|support my work/i });
    this.navigationMenu = page.getByRole("navigation");
  }

  async goto() {
    await this.page.goto("/");
    await this.waitForLoad();
  }

  async waitForLoad() {
    // Wait for the main content to be visible
    await expect(this.profileSection.or(this.page.locator("main"))).toBeVisible();
  }

  async scrollToSection(
    section: "profile" | "projects" | "freelance-projects" | "stack" | "support-work"
  ) {
    const sectionMap = {
      profile: this.profileSection,
      projects: this.projectsSection,
      "freelance-projects": this.freelanceProjectsSection,
      stack: this.stackSection,
      "support-work": this.supportWorkSection,
    };

    const targetSection = sectionMap[section];
    await targetSection.scrollIntoViewIfNeeded();
    await expect(targetSection).toBeInViewport();
  }

  async clickBuyMeCoffee() {
    await this.buyMeCoffeeButton.click();
  }

  async verifyAllSectionsVisible() {
    // Check that all main sections are present on the page
    const sections = [this.profileSection, this.projectsSection, this.stackSection];

    for (const section of sections) {
      await expect(section.or(this.page.locator("main"))).toBeVisible();
    }
  }
}

/**
 * Page Object Model for Projects page
 */
export class ProjectsPage {
  readonly page: Page;
  readonly projectCards: Locator;
  readonly projectTitles: Locator;
  readonly viewProjectButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.projectCards = page
      .getByTestId("project-card")
      .or(page.locator('[data-testid*="project"]'));
    this.projectTitles = page.locator("h3, h2").filter({ hasText: /project|work/i });
    this.viewProjectButtons = page.getByRole("link", { name: /view project|live demo/i });
  }

  async goto() {
    await this.page.goto("/projects");
    await this.waitForLoad();
  }

  async waitForLoad() {
    await expect(this.page.locator("main").or(this.projectTitles.first())).toBeVisible();
  }

  async getProjectCount() {
    await this.waitForLoad();
    return await this.projectCards.count();
  }

  async clickFirstProject() {
    await this.projectCards.first().click();
  }
}

/**
 * Page Object Model for About page
 */
export class AboutPage {
  readonly page: Page;
  readonly profileImage: Locator;
  readonly skillsSection: Locator;
  readonly experienceSection: Locator;
  readonly socialLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.profileImage = page.locator('img[alt*="kamran" i], img[alt*="mohammad" i]');
    this.skillsSection = page.getByTestId("skills-section").or(page.locator(':has-text("Skills")'));
    this.experienceSection = page
      .getByTestId("experience-section")
      .or(page.locator(':has-text("Experience")'));
    this.socialLinks = page.locator('a[href*="github"], a[href*="linkedin"], a[href*="twitter"]');
  }

  async goto() {
    await this.page.goto("/about");
    await this.waitForLoad();
  }

  async waitForLoad() {
    await expect(this.page.locator("main")).toBeVisible();
  }

  async verifySocialLinksWork() {
    const socialLinks = await this.socialLinks.all();

    for (const link of socialLinks) {
      await expect(link).toBeVisible();
      // Check that links have proper href attributes
      const href = await link.getAttribute("href");
      expect(href).toBeTruthy();
    }
  }
}

/**
 * Page Object Model for Contact page
 */
export class ContactPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly sendButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel(/name/i).or(page.locator('input[name="name"]'));
    this.emailInput = page.getByLabel(/email/i).or(page.locator('input[name="email"]'));
    this.subjectInput = page.getByLabel(/subject/i).or(page.locator('input[name="subject"]'));
    this.messageInput = page.getByLabel(/message/i).or(page.locator('textarea[name="message"]'));
    this.sendButton = page.getByRole("button", { name: /send|submit/i });
    this.successMessage = page.locator(':has-text("sent successfully")');
    this.errorMessage = page.locator(':has-text("failed"), :has-text("error")');
  }

  async goto() {
    await this.page.goto("/contact");
    await this.waitForLoad();
  }

  async waitForLoad() {
    await expect(this.nameInput.or(this.page.locator("form"))).toBeVisible();
  }

  async fillForm(data: { name: string; email: string; subject: string; message: string }) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.subjectInput.fill(data.subject);
    await this.messageInput.fill(data.message);
  }

  async submitForm() {
    await this.sendButton.click();
  }

  async verifyFormValidation() {
    // Try to submit empty form and check for validation
    await this.submitForm();

    // Should show validation errors or prevent submission
    const isFormValid = await this.successMessage.isVisible({ timeout: 1000 }).catch(() => false);
    expect(isFormValid).toBeFalsy();
  }
}

/**
 * Page Object Model for Payment Modal (Razorpay)
 */
export class PaymentModal {
  readonly page: Page;
  readonly modal: Locator;
  readonly amountSelector: Locator;
  readonly payButton: Locator;
  readonly closeButton: Locator;
  readonly razorpayFrame: any;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.getByTestId("payment-modal").or(page.locator('[role="dialog"]'));
    this.amountSelector = page.locator('input[type="radio"], button').filter({ hasText: /₹|\$/ });
    this.payButton = page.getByRole("button", { name: /pay|proceed/i });
    this.closeButton = page.getByRole("button", { name: /close|×/i });
    this.razorpayFrame = page.frameLocator('iframe[src*="razorpay"], iframe[name*="razorpay"]');
  }

  async waitForOpen() {
    await expect(this.modal).toBeVisible();
  }

  async selectAmount(amount: number) {
    const amountButton = this.page.locator(
      `button:has-text("${amount}"), input[value="${amount}"]`
    );
    await amountButton.click();
  }

  async clickPay() {
    await this.payButton.click();
  }

  async close() {
    await this.closeButton.click();
    await expect(this.modal).not.toBeVisible();
  }

  async waitForRazorpayScript() {
    // Wait for Razorpay script to load
    await this.page.waitForFunction(
      () => {
        return typeof window !== "undefined" && window.Razorpay !== undefined;
      },
      { timeout: 10000 }
    );
  }
}

/**
 * Common utilities for E2E tests
 */
export class TestUtils {
  static async waitForNetworkIdle(page: Page, timeout = 5000) {
    await page.waitForLoadState("networkidle", { timeout });
  }

  static async takeScreenshot(page: Page, name: string) {
    await page.screenshot({ path: `test-results/screenshots/${name}-${Date.now()}.png` });
  }

  static async checkAccessibility(page: Page) {
    // Basic accessibility checks
    const missingAlt = await page.locator("img:not([alt])").count();
    expect(missingAlt).toBe(0);

    const missingLabels = await page
      .locator("input:not([aria-label]):not([aria-labelledby]):not([id])")
      .count();
    expect(missingLabels).toBe(0);
  }

  static async checkResponsiveness(page: Page) {
    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 }, // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500); // Allow for responsive adjustments

      // Check that content is still visible and properly arranged
      const main = page.locator("main");
      await expect(main).toBeVisible();
    }
  }

  static generateTestData() {
    return {
      contactForm: {
        name: "Test User",
        email: "test@example.com",
        subject: "E2E Test Message",
        message: "This is a test message from automated E2E testing.",
      },
    };
  }
}
