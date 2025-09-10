/**
 * Payment Service - Phase 5: State & Side Effects Discipline
 *
 * Encapsulates all payment-related business logic and side effects.
 * Provides a clean interface for payment operations with proper error handling.
 */

import type { RazorpayOptions, RazorpayResponse, RazorpayError } from "@/types/razorpay";

/**
 * Payment Configuration
 */
interface PaymentConfig {
  keyId: string;
  currency: string;
  timeout: number;
  retryAttempts: number;
}

/**
 * Payment Order Request
 */
interface CreateOrderRequest {
  amount: number;
  currency?: string;
  purpose?: string;
  metadata?: Record<string, any>;
}

/**
 * Payment Order Response
 */
interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

/**
 * Payment Result
 */
interface PaymentResult {
  success: boolean;
  orderId: string;
  paymentId?: string;
  signature?: string;
  error?: PaymentErrorData;
}

/**
 * Payment Error Data
 */
interface PaymentErrorData {
  code: string;
  message: string;
  description?: string;
  source?: string;
  step?: string;
  reason?: string;
  metadata?: Record<string, any>;
}

/**
 * Payment Service Class
 *
 * Handles all payment operations including order creation,
 * payment processing, and error handling.
 */
export class PaymentService {
  private config: PaymentConfig;
  private isScriptLoaded = false;
  private scriptLoadPromise: Promise<void> | null = null;

  constructor(config: PaymentConfig) {
    this.config = config;
  }

  /**
   * Load Razorpay script
   */
  private async loadRazorpayScript(): Promise<void> {
    // Return existing promise if already loading
    if (this.scriptLoadPromise) {
      return this.scriptLoadPromise;
    }

    // Return immediately if already loaded
    if (this.isScriptLoaded && window.Razorpay) {
      return Promise.resolve();
    }

    this.scriptLoadPromise = new Promise((resolve, reject) => {
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="razorpay"]');
      if (existingScript && window.Razorpay) {
        this.isScriptLoaded = true;
        resolve();
        return;
      }

      // Create and load script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        this.isScriptLoaded = true;
        resolve();
      };

      script.onerror = () => {
        this.scriptLoadPromise = null;
        reject(new Error("Failed to load Razorpay script"));
      };

      document.head.appendChild(script);
    });

    return this.scriptLoadPromise;
  }

  /**
   * Create payment order
   */
  async createOrder(request: CreateOrderRequest): Promise<PaymentOrder> {
    try {
      const response = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: request.amount,
          currency: request.currency || this.config.currency,
          purpose: request.purpose,
          metadata: request.metadata,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        id: data.id,
        amount: data.amount,
        currency: data.currency,
        receipt: data.receipt || `receipt_${Date.now()}`,
      };
    } catch (error) {
      console.error("Failed to create payment order:", error);
      throw new PaymentError({
        code: "ORDER_CREATION_FAILED",
        message: "Failed to create payment order",
        description: error instanceof Error ? error.message : "Unknown error",
        source: "api",
        step: "order_creation",
      });
    }
  }

  /**
   * Process payment
   */
  async processPayment(
    order: PaymentOrder,
    customerInfo: {
      name?: string;
      email?: string;
      contact?: string;
    } = {}
  ): Promise<PaymentResult> {
    try {
      // Ensure Razorpay script is loaded
      await this.loadRazorpayScript();

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not available");
      }

      return new Promise((resolve) => {
        const options: RazorpayOptions = {
          key: this.config.keyId,
          amount: order.amount,
          currency: order.currency,
          order_id: order.id,
          name: "Mohammad Kamran",
          description: "Portfolio Services",
          image: "/images/kamran.jpeg",

          // Customer information
          prefill: {
            name: customerInfo.name || "",
            email: customerInfo.email || "",
            contact: customerInfo.contact || "",
          },

          // Success handler
          handler: (response: RazorpayResponse) => {
            resolve({
              success: true,
              orderId: order.id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
          },

          // Modal configuration
          modal: {
            confirm_close: true,
            ondismiss: () => {
              resolve({
                success: false,
                orderId: order.id,
                error: {
                  code: "PAYMENT_CANCELLED",
                  message: "Payment was cancelled by user",
                  source: "user",
                  step: "payment",
                  reason: "cancelled",
                },
              });
            },
          },

          // Theme configuration
          theme: {
            color: "#3B82F6",
            backdrop_color: "rgba(0, 0, 0, 0.5)",
            image_padding: false,
          },

          // Retry configuration
          retry: {
            enabled: true,
            max_count: this.config.retryAttempts,
          },

          // Timeout
          timeout: this.config.timeout,

          // Remember customer
          remember_customer: false,
        };

        const razorpay = new window.Razorpay(options);

        // Handle payment failures
        razorpay.on("payment.failed", (response: { error: RazorpayError }) => {
          resolve({
            success: false,
            orderId: order.id,
            error: {
              code: response.error.code || "PAYMENT_FAILED",
              message: "Payment failed",
              description: response.error.description,
              source: response.error.source,
              step: response.error.step,
              reason: response.error.reason,
              metadata: response.error.metadata,
            },
          });
        });

        // Open payment modal
        razorpay.open();
      });
    } catch (error) {
      console.error("Payment processing failed:", error);
      return {
        success: false,
        orderId: order.id,
        error: {
          code: "PAYMENT_PROCESSING_FAILED",
          message: "Failed to process payment",
          description: error instanceof Error ? error.message : "Unknown error",
          source: "payment_service",
          step: "processing",
        },
      };
    }
  }

  /**
   * Verify payment signature (optional - for additional security)
   */
  async verifyPayment(orderId: string, paymentId: string, signature: string): Promise<boolean> {
    try {
      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          paymentId,
          signature,
        }),
      });

      const data = await response.json();
      return data.isValid || false;
    } catch (error) {
      console.error("Payment verification failed:", error);
      return false;
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<any> {
    try {
      const response = await fetch(`/api/payment-status/${paymentId}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to get payment status:", error);
      throw error;
    }
  }
}

/**
 * Payment Service Instance
 */
export const paymentService = new PaymentService({
  keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  currency: "INR",
  timeout: 300, // 5 minutes
  retryAttempts: 3,
});

/**
 * PaymentError Class
 */
export class PaymentError extends Error {
  code: string;
  description?: string;
  source?: string;
  step?: string;
  reason?: string;
  metadata?: Record<string, any>;

  constructor(error: {
    code: string;
    message: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
    metadata?: Record<string, any>;
  }) {
    super(error.message);
    this.name = "PaymentError";
    this.code = error.code;
    if (error.description !== undefined) this.description = error.description;
    if (error.source !== undefined) this.source = error.source;
    if (error.step !== undefined) this.step = error.step;
    if (error.reason !== undefined) this.reason = error.reason;
    if (error.metadata !== undefined) this.metadata = error.metadata;
  }
}
