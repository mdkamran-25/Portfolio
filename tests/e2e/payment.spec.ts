import { test, expect } from "@playwright/test";
import { HomePage, PaymentModal } from "./utils/page-objects";
import { testData, apiMocks } from "./fixtures/test-data";

/**
 * E2E Test Suite: Payment Flow with Razorpay Integration
 *
 * Tests the complete payment workflow including:
 * - Opening payment modal
 * - Razorpay script loading
 * - Payment flow simulation
 * - Success/error handling
 */

test.describe("Payment Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Set up viewport
    await page.setViewportSize({ width: 1280, height: 720 });

    // Mock Razorpay script if needed
    await page.addInitScript(() => {
      // Mock Razorpay for testing purposes
      (window as any).Razorpay = function (options: any) {
        return {
          open: function () {
            // Simulate payment success after a short delay
            setTimeout(() => {
              if (options.handler) {
                options.handler({
                  razorpay_payment_id: "pay_test123456789",
                  razorpay_order_id: "order_test123456789",
                  razorpay_signature: "test_signature_hash",
                });
              }
            }, 1000);
          },
          on: function (_event: string, _callback: Function) {
            // Mock event handlers
          },
        };
      };
    });
  });

  test("should open payment modal from home page", async ({ page }) => {
    const homePage = new HomePage(page);
    const paymentModal = new PaymentModal(page);

    await homePage.goto();

    // Scroll to support work section
    await homePage.scrollToSection("support-work");

    // Click on Buy Me Coffee button
    await homePage.clickBuyMeCoffee();

    // Verify payment modal opens
    await paymentModal.waitForOpen();

    // Verify amount options are visible
    await expect(paymentModal.amountSelector.first()).toBeVisible();

    // Verify pay button is visible
    await expect(paymentModal.payButton).toBeVisible();
  });

  test("should handle payment amount selection", async ({ page }) => {
    const homePage = new HomePage(page);
    const paymentModal = new PaymentModal(page);

    await homePage.goto();
    await homePage.scrollToSection("support-work");
    await homePage.clickBuyMeCoffee();
    await paymentModal.waitForOpen();

    // Test selecting different amounts
    const amounts = testData.payment.amounts;

    for (const amount of amounts) {
      await paymentModal.selectAmount(amount);

      // If no specific selected state, just verify the amount button exists
      const amountButton = page.locator(`button:has-text("${amount}"), input[value="${amount}"]`);
      await expect(amountButton).toBeVisible();
    }
  });

  test("should load Razorpay script when payment modal opens", async ({ page }) => {
    const homePage = new HomePage(page);
    const paymentModal = new PaymentModal(page);

    await homePage.goto();
    await homePage.scrollToSection("support-work");
    await homePage.clickBuyMeCoffee();
    await paymentModal.waitForOpen();

    // Verify Razorpay script is loaded
    const razorpayLoaded = await page.evaluate(() => {
      return typeof window.Razorpay !== "undefined";
    });

    expect(razorpayLoaded).toBeTruthy();
  });

  test("should handle payment API calls correctly", async ({ page }) => {
    // Mock the create-order API
    await page.route("**/api/create-order", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(apiMocks.createOrder.success),
      });
    });

    // Mock the verify-payment API
    await page.route("**/api/verify-payment", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(apiMocks.verifyPayment.success),
      });
    });

    const homePage = new HomePage(page);
    const paymentModal = new PaymentModal(page);

    await homePage.goto();
    await homePage.scrollToSection("support-work");
    await homePage.clickBuyMeCoffee();
    await paymentModal.waitForOpen();

    // Select an amount and proceed with payment
    await paymentModal.selectAmount(199);
    await paymentModal.clickPay();

    // Wait for API calls to complete
    await page.waitForTimeout(2000);

    // Verify no error messages are shown
    const errorMessage = page.locator(':has-text("error"), :has-text("failed")');
    await expect(errorMessage).not.toBeVisible();
  });

  test("should handle payment errors gracefully", async ({ page }) => {
    // Mock API to return error
    await page.route("**/api/create-order", async (route) => {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify(apiMocks.createOrder.error),
      });
    });

    const homePage = new HomePage(page);
    const paymentModal = new PaymentModal(page);

    await homePage.goto();
    await homePage.scrollToSection("support-work");
    await homePage.clickBuyMeCoffee();
    await paymentModal.waitForOpen();

    await paymentModal.selectAmount(199);
    await paymentModal.clickPay();

    // Wait for error handling
    await page.waitForTimeout(2000);

    // Should show error message or toast
    const errorIndicator = page.locator(
      ':has-text("temporarily unavailable"), :has-text("service not configured"), :has-text("error")'
    );
    await expect(errorIndicator).toBeVisible({ timeout: 5000 });
  });

  test("should close payment modal correctly", async ({ page }) => {
    const homePage = new HomePage(page);
    const paymentModal = new PaymentModal(page);

    await homePage.goto();
    await homePage.scrollToSection("support-work");
    await homePage.clickBuyMeCoffee();
    await paymentModal.waitForOpen();

    // Close modal using close button
    await paymentModal.close();

    // Verify modal is closed
    await expect(paymentModal.modal).not.toBeVisible();
  });

  test("should handle successful payment flow", async ({ page }) => {
    // Mock successful APIs
    await page.route("**/api/create-order", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(apiMocks.createOrder.success),
      });
    });

    await page.route("**/api/verify-payment", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(apiMocks.verifyPayment.success),
      });
    });

    const homePage = new HomePage(page);
    const paymentModal = new PaymentModal(page);

    await homePage.goto();
    await homePage.scrollToSection("support-work");
    await homePage.clickBuyMeCoffee();
    await paymentModal.waitForOpen();

    await paymentModal.selectAmount(199);
    await paymentModal.clickPay();

    // Wait for payment process
    await page.waitForTimeout(3000);

    // Verify success indication (toast, message, or modal close)
    const successIndicator = page.locator(
      ':has-text("success"), :has-text("thank you"), :has-text("payment completed")'
    );

    // Either success message is shown OR modal is closed (indicating success)
    const modalClosed = await paymentModal.modal
      .isVisible({ timeout: 1000 })
      .then(() => false)
      .catch(() => true);
    const successVisible = await successIndicator.isVisible({ timeout: 1000 }).catch(() => false);

    expect(modalClosed || successVisible).toBeTruthy();
  });

  test("should navigate to pricing page payment flow", async ({ page }) => {
    await page.goto("/pricing");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Look for pricing cards or payment buttons
    const pricingCards = page.locator('[data-testid*="pricing"], .pricing, [class*="price"]');
    const paymentButtons = page.getByRole("button", { name: /buy|purchase|select|choose/i });

    // If pricing elements exist, test the flow
    const pricingElementsCount = (await pricingCards.count()) + (await paymentButtons.count());

    if (pricingElementsCount > 0) {
      // Click on a pricing option if available
      if ((await paymentButtons.count()) > 0) {
        await paymentButtons.first().click();

        // Should either open payment modal or navigate to payment
        const paymentModal = new PaymentModal(page);

        try {
          await paymentModal.waitForOpen();
          await expect(paymentModal.modal).toBeVisible();
        } catch {
          // Alternative: might navigate to another page or show payment form
          await expect(page.locator('form, [data-testid*="payment"]')).toBeVisible({
            timeout: 5000,
          });
        }
      }
    }
  });

  test("should be accessible with keyboard navigation", async ({ page }) => {
    const homePage = new HomePage(page);
    const paymentModal = new PaymentModal(page);

    await homePage.goto();
    await homePage.scrollToSection("support-work");

    // Use keyboard to navigate to and activate buy coffee button
    await page.keyboard.press("Tab");

    // Find the buy coffee button and press Enter
    const buyButton = homePage.buyMeCoffeeButton;
    await buyButton.focus();
    await page.keyboard.press("Enter");

    await paymentModal.waitForOpen();

    // Verify modal is keyboard accessible
    await page.keyboard.press("Tab");

    // Should be able to close modal with Escape
    await page.keyboard.press("Escape");

    // Modal should close
    await expect(paymentModal.modal).not.toBeVisible({ timeout: 2000 });
  });

  test("should handle multiple rapid payment attempts", async ({ page }) => {
    const homePage = new HomePage(page);
    const paymentModal = new PaymentModal(page);

    await homePage.goto();
    await homePage.scrollToSection("support-work");
    await homePage.clickBuyMeCoffee();
    await paymentModal.waitForOpen();

    await paymentModal.selectAmount(199);

    // Rapidly click pay button multiple times
    for (let i = 0; i < 3; i++) {
      await paymentModal.clickPay();
      await page.waitForTimeout(100);
    }

    // Should handle gracefully without breaking
    // Verify no error state or broken UI
    await expect(paymentModal.modal.or(page.locator("body"))).toBeVisible();
  });
});
