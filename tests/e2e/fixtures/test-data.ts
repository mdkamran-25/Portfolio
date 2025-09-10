/**
 * Test fixtures for E2E tests
 * Contains reusable test data and mock configurations
 */

export const testData = {
  contactForm: {
    valid: {
      name: "John Doe",
      email: "john.doe@example.com",
      subject: "Test Inquiry",
      message: "This is a test message for E2E testing purposes. Please ignore.",
    },
    invalid: {
      emptyName: {
        name: "",
        email: "test@example.com",
        subject: "Test",
        message: "Test message",
      },
      invalidEmail: {
        name: "Test User",
        email: "invalid-email",
        subject: "Test",
        message: "Test message",
      },
      emptyMessage: {
        name: "Test User",
        email: "test@example.com",
        subject: "Test",
        message: "",
      },
    },
  },

  payment: {
    amounts: [99, 199, 999],
    currency: "INR",
  },

  projects: {
    expectedMinimumCount: 1,
    expectedSections: ["title", "description", "technologies"],
  },

  navigation: {
    routes: [
      { path: "/", name: "Home" },
      { path: "/about", name: "About" },
      { path: "/projects", name: "Projects" },
      { path: "/contact", name: "Contact" },
      { path: "/pricing", name: "Pricing" },
    ],
  },

  socialLinks: {
    expectedPlatforms: ["github", "linkedin"],
    validateHref: true,
  },

  seo: {
    expectedTitlePattern: /kamran|portfolio|developer/i,
    expectedDescriptionMinLength: 50,
    expectedMetaTags: ["description", "viewport", "robots"],
  },

  performance: {
    maxLoadTime: 5000, // 5 seconds
    maxLCPTime: 2500, // 2.5 seconds
    maxFIDTime: 100, // 100ms
  },

  accessibility: {
    requiredLandmarks: ["main", "navigation"],
    minimumColorContrast: 4.5,
    keyboardNavigationRequired: true,
  },
};

export const mockRazorpayResponse = {
  success: {
    razorpay_payment_id: "pay_test123456789",
    razorpay_order_id: "order_test123456789",
    razorpay_signature: "test_signature_hash",
  },
  error: {
    code: "PAYMENT_FAILED",
    description: "Payment was cancelled by user",
    source: "customer",
    step: "payment_authentication",
    reason: "payment_cancelled",
  },
};

export const environmentConfig = {
  baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
  timeout: {
    default: 30000,
    navigation: 10000,
    assertion: 5000,
  },
  retries: process.env.CI ? 2 : 0,
  slowMo: process.env.PLAYWRIGHT_SLOW_MO ? 100 : 0,
};

export const browserConfig = {
  headless: process.env.CI ? true : false,
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1,
  hasTouch: false,
  isMobile: false,
};

/**
 * Mock data for API responses
 */
export const apiMocks = {
  createOrder: {
    success: {
      id: "order_test123456789",
      amount: 19900, // Amount in paise (₹199)
      currency: "INR",
      status: "created",
    },
    error: {
      error: "Payment service not configured",
      status: 503,
    },
  },

  verifyPayment: {
    success: {
      success: true,
      payment: {
        id: "pay_test123456789",
        status: "captured",
        amount: 19900,
      },
    },
    error: {
      error: "Invalid payment signature",
      status: 400,
    },
  },

  contact: {
    success: {
      message: "Email sent successfully",
      status: 200,
    },
    error: {
      message: "Failed to send email",
      status: 500,
    },
  },
};

/**
 * Utility function to get test data by key
 */
export function getTestData(key: string): any {
  const keys = key.split(".");
  let data: any = testData;

  for (const k of keys) {
    data = data[k];
    if (data === undefined) {
      throw new Error(`Test data not found for key: ${key}`);
    }
  }

  return data;
}

/**
 * Generate random test data
 */
export function generateRandomTestData() {
  const timestamp = Date.now();

  return {
    contactForm: {
      name: `Test User ${timestamp}`,
      email: `test${timestamp}@example.com`,
      subject: `Test Subject ${timestamp}`,
      message: `Test message generated at ${new Date().toISOString()}`,
    },
  };
}
