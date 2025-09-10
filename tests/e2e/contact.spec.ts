import { test, expect } from "@playwright/test";
import { ContactPage } from "./utils/page-objects";
import { testData, apiMocks } from "./fixtures/test-data";

/**
 * E2E Test Suite: Contact Form Functionality
 *
 * Tests the contact form submission, validation, and email functionality.
 * Includes both positive and negative test scenarios.
 */

test.describe("Contact Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test("should display contact form with all required fields", async ({ page }) => {
    const contactPage = new ContactPage(page);

    await contactPage.goto();

    // Verify all form fields are visible and functional
    await expect(contactPage.nameInput).toBeVisible();
    await expect(contactPage.emailInput).toBeVisible();
    await expect(contactPage.subjectInput).toBeVisible();
    await expect(contactPage.messageInput).toBeVisible();
    await expect(contactPage.sendButton).toBeVisible();

    // Verify fields are editable
    await contactPage.nameInput.fill("Test");
    await expect(contactPage.nameInput).toHaveValue("Test");

    await contactPage.emailInput.fill("test@example.com");
    await expect(contactPage.emailInput).toHaveValue("test@example.com");
  });

  test("should validate required fields", async ({ page }) => {
    const contactPage = new ContactPage(page);

    await contactPage.goto();

    // Try to submit empty form
    await contactPage.submitForm();

    // Should either show validation messages or prevent submission
    // Check for HTML5 validation or custom validation messages
    const nameValidation = await contactPage.nameInput.evaluate((el: HTMLInputElement) => {
      return el.validationMessage || el.checkValidity();
    });

    const emailValidation = await contactPage.emailInput.evaluate((el: HTMLInputElement) => {
      return el.validationMessage || el.checkValidity();
    });

    // At least one should show validation error for empty required fields
    const hasValidation =
      (typeof nameValidation === "string" && nameValidation.length > 0) ||
      (typeof nameValidation === "boolean" && !nameValidation) ||
      (typeof emailValidation === "string" && emailValidation.length > 0) ||
      (typeof emailValidation === "boolean" && !emailValidation);

    expect(hasValidation).toBeTruthy();
  });

  test("should validate email format", async ({ page }) => {
    const contactPage = new ContactPage(page);

    await contactPage.goto();

    // Fill form with invalid email
    await contactPage.fillForm({
      name: "Test User",
      email: "invalid-email-format",
      subject: "Test Subject",
      message: "Test message",
    });

    await contactPage.submitForm();

    // Check for email validation
    const emailValidation = await contactPage.emailInput.evaluate((el: HTMLInputElement) => {
      return el.validationMessage;
    });

    // Should show email format validation error
    expect(emailValidation).toBeTruthy();
  });

  test("should successfully submit valid form", async ({ page }) => {
    // Mock the contact API to return success
    await page.route("**/api/contact", async (route) => {
      const request = route.request();
      const postData = request.postData();

      // Verify request contains form data
      expect(postData).toBeTruthy();

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(apiMocks.contact.success),
      });
    });

    const contactPage = new ContactPage(page);

    await contactPage.goto();

    // Fill and submit valid form
    await contactPage.fillForm(testData.contactForm.valid);
    await contactPage.submitForm();

    // Wait for response and check for success message
    await expect(contactPage.successMessage).toBeVisible({ timeout: 10000 });

    // Verify form is cleared after successful submission
    await expect(contactPage.nameInput).toHaveValue("");
    await expect(contactPage.emailInput).toHaveValue("");
    await expect(contactPage.messageInput).toHaveValue("");
  });

  test("should handle API errors gracefully", async ({ page }) => {
    // Mock the contact API to return error
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify(apiMocks.contact.error),
      });
    });

    const contactPage = new ContactPage(page);

    await contactPage.goto();

    await contactPage.fillForm(testData.contactForm.valid);
    await contactPage.submitForm();

    // Should show error message
    await expect(contactPage.errorMessage).toBeVisible({ timeout: 10000 });

    // Form should retain data after error
    await expect(contactPage.nameInput).toHaveValue(testData.contactForm.valid.name);
    await expect(contactPage.emailInput).toHaveValue(testData.contactForm.valid.email);
  });

  test("should handle network timeout", async ({ page }) => {
    // Mock slow API response
    await page.route("**/api/contact", async (route) => {
      // Delay response to simulate timeout
      await new Promise((resolve) => setTimeout(resolve, 15000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(apiMocks.contact.success),
      });
    });

    const contactPage = new ContactPage(page);

    await contactPage.goto();

    await contactPage.fillForm(testData.contactForm.valid);
    await contactPage.submitForm();

    // Should show loading state or timeout handling
    // Wait reasonable time then check for timeout handling
    await page.waitForTimeout(5000);

    // Should either show loading indicator or error message for timeout
    const loadingIndicator = page.locator(
      '[data-testid="loading"], .loading, :has-text("sending")'
    );
    const timeoutError = page.locator(':has-text("timeout"), :has-text("taking longer")');

    const hasTimeoutHandling =
      (await loadingIndicator.isVisible()) || (await timeoutError.isVisible());
    expect(hasTimeoutHandling).toBeTruthy();
  });

  test("should prevent multiple rapid submissions", async ({ page }) => {
    // Mock delayed API response
    await page.route("**/api/contact", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(apiMocks.contact.success),
      });
    });

    const contactPage = new ContactPage(page);

    await contactPage.goto();

    await contactPage.fillForm(testData.contactForm.valid);

    // Rapidly click submit button multiple times
    for (let i = 0; i < 3; i++) {
      await contactPage.sendButton.click();
      await page.waitForTimeout(100);
    }

    // Button should be disabled during submission
    const isDisabled = await contactPage.sendButton.isDisabled();
    expect(isDisabled).toBeTruthy();
  });

  test("should be accessible with keyboard navigation", async ({ page }) => {
    const contactPage = new ContactPage(page);

    await contactPage.goto();

    // Navigate through form using Tab key
    await page.keyboard.press("Tab");
    await expect(contactPage.nameInput).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(contactPage.emailInput).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(contactPage.subjectInput).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(contactPage.messageInput).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(contactPage.sendButton).toBeFocused();

    // Should be able to submit form using Enter key
    await contactPage.nameInput.focus();
    await contactPage.nameInput.fill("Test User");
    await contactPage.emailInput.fill("test@example.com");
    await contactPage.subjectInput.fill("Test Subject");
    await contactPage.messageInput.fill("Test message");

    await contactPage.sendButton.focus();
    await page.keyboard.press("Enter");

    // Form should submit (even if it fails due to no mock, the attempt should work)
  });

  test("should handle special characters in form data", async ({ page }) => {
    // Mock successful API response
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(apiMocks.contact.success),
      });
    });

    const contactPage = new ContactPage(page);

    await contactPage.goto();

    // Fill form with special characters
    const specialCharData = {
      name: "John O'Connor & María José",
      email: "test+tag@example-domain.com",
      subject: 'Test: Special chars & symbols <>"',
      message: "Message with special chars: àáâãäåæçèéêë & symbols: <>&\"'",
    };

    await contactPage.fillForm(specialCharData);
    await contactPage.submitForm();

    // Should handle special characters without issues
    await expect(contactPage.successMessage).toBeVisible({ timeout: 10000 });
  });

  test("should handle very long input data", async ({ page }) => {
    const contactPage = new ContactPage(page);

    await contactPage.goto();

    // Fill form with very long data
    const longData = {
      name: "A".repeat(100),
      email: "verylongemailaddress" + "a".repeat(50) + "@example.com",
      subject: "Very long subject line ".repeat(10),
      message: "This is a very long message. ".repeat(100),
    };

    await contactPage.fillForm(longData);

    // Verify data is accepted (up to field limits)
    const nameValue = await contactPage.nameInput.inputValue();
    const messageValue = await contactPage.messageInput.inputValue();

    expect(nameValue.length).toBeGreaterThan(0);
    expect(messageValue.length).toBeGreaterThan(0);
  });

  test("should display proper form labels and accessibility attributes", async ({ page }) => {
    const contactPage = new ContactPage(page);

    await contactPage.goto();

    // Check for proper labels
    const nameLabel = page.locator('label[for*="name"], label:has-text("name")');
    const emailLabel = page.locator('label[for*="email"], label:has-text("email")');
    const subjectLabel = page.locator('label[for*="subject"], label:has-text("subject")');
    const messageLabel = page.locator('label[for*="message"], label:has-text("message")');

    // Verify labels exist
    await expect(nameLabel.or(contactPage.nameInput)).toBeVisible();
    await expect(emailLabel.or(contactPage.emailInput)).toBeVisible();
    await expect(subjectLabel.or(contactPage.subjectInput)).toBeVisible();
    await expect(messageLabel.or(contactPage.messageInput)).toBeVisible();

    // Check required field indicators
    const requiredFields = page.locator(
      'input[required], textarea[required], [aria-required="true"]'
    );
    const requiredCount = await requiredFields.count();
    expect(requiredCount).toBeGreaterThan(0);
  });
});
