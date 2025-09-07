"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type {
  RazorpayOptions,
  RazorpayResponse,
  RazorpayError,
  RazorpayConstructor,
} from "@/types/razorpay";

interface RazorpayPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess?: (response: RazorpayResponse) => void;
  onError?: (error: RazorpayError) => void;
}

declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = React.memo(function RazorpayPayment({
  isOpen,
  onClose,
  amount,
  onSuccess,
  onError,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const scriptLoadedRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Optimized script loading with proper cleanup
  useEffect(() => {
    const loadRazorpayScript = () => {
      // Prevent multiple loading attempts
      if (scriptLoadedRef.current || isScriptLoaded) return;

      // Check if script already exists
      if (typeof window !== "undefined" && window.Razorpay) {
        scriptLoadedRef.current = true;
        setIsScriptLoaded(true);
        return;
      }

      // Check if script element exists
      const existingScript = document.getElementById("razorpay-script");
      if (existingScript) {
        // Wait for existing script to load
        existingScript.onload = () => {
          scriptLoadedRef.current = true;
          setIsScriptLoaded(true);
        };
        return;
      }

      // Create and load script
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        scriptLoadedRef.current = true;
        setIsScriptLoaded(true);
        console.log("Razorpay script loaded successfully");
      };

      script.onerror = () => {
        console.error("Failed to load Razorpay script");
        toast.error("Failed to load payment system. Please refresh the page.");
      };

      document.head.appendChild(script);
    };

    // Load script only when modal is open to avoid unnecessary loading
    if (isOpen && !scriptLoadedRef.current) {
      loadRazorpayScript();

      // Set up a one-time check after a delay instead of continuous polling
      intervalRef.current = setTimeout(() => {
        if (typeof window !== "undefined" && window.Razorpay && !scriptLoadedRef.current) {
          scriptLoadedRef.current = true;
          setIsScriptLoaded(true);
        }
      }, 1000); // Single check after 1 second
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isOpen, isScriptLoaded]); // Only depend on isOpen and isScriptLoaded

  const handlePayment = useCallback(async () => {
    // Prevent multiple simultaneous payment attempts
    if (isLoading) return;

    if (!isScriptLoaded || !window.Razorpay) {
      toast.error("Payment system is not ready yet. Please try again.");
      return;
    }

    setIsLoading(true);
    try {
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          amount: amount * 100,
          currency: "INR",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Order creation failed:", data);
        if (response.status === 500) {
          toast.error("Payment service is temporarily unavailable. Please try again later.");
        } else {
          throw new Error(data.error || "Failed to create order. Please try again.");
        }
        return;
      }

      if (!data.id || !data.amount) {
        console.error("Invalid order response:", data);
        throw new Error("Invalid response from server. Please try again.");
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: data.amount,
        currency: "INR",
        name: "Kamran",
        description: "Support my work",
        order_id: data.id,
        handler: (response: RazorpayResponse) => {
          console.log("Payment successful:", response);
          toast.success("Payment successful! Thank you for your support.");
          onSuccess?.(response);
          setIsLoading(false); // Reset loading state on success
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#F97316",
        },
        modal: {
          ondismiss: () => {
            console.log("Payment modal dismissed");
            toast.info("Payment cancelled");
            document.body.classList.remove("razorpay-open");
            setIsLoading(false); // Reset loading state on dismiss
          },
          confirm_close: false, // Disable confirm dialog on close
          escape: true, // Allow escape key to close
          backdropclose: true, // Allow clicking outside to close
          animation: true, // Enable smooth animations
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: "Pay using UPI",
                instruments: [
                  {
                    method: "upi",
                    flows: ["collect"],
                  },
                ],
              },
            },
            sequence: ["block.banks"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        qr_code: {
          enabled: true,
          size: 200,
          image: true,
        },
        timeout: 300, // 5 minute timeout
        retry: {
          enabled: true,
          max_count: 3,
        },
        remember_customer: false, // Don't remember customer details
        readonly: {
          email: false,
          contact: false,
          name: false,
        },
      };

      // Create new Razorpay instance and open
      const razorpay = new window.Razorpay(options);

      // Handle payment errors
      razorpay.on("payment.failed", (response: { error: RazorpayError }) => {
        console.error("Payment failed:", response);
        toast.error("Payment failed. Please try again.");
        onError?.({
          code: "PAYMENT_FAILED",
          description: response.error.description || "Payment failed",
          source: "payment",
          step: "payment",
          reason: response.error.reason || "unknown",
          metadata: {
            order_id: response.error.metadata?.order_id || "",
            payment_id: response.error.metadata?.payment_id || "",
          },
        });
        setIsLoading(false);
      });

      // Close our dialog first to prevent modal conflicts
      onClose();

      // Add delay to ensure dialog is fully closed before opening Razorpay
      setTimeout(() => {
        try {
          // Ensure DOM is ready and no other modals are interfering
          if (document.body) {
            // Remove any existing Razorpay iframe or overlay
            const existingFrames = document.querySelectorAll(
              'iframe[src*="razorpay"], .razorpay-checkout-frame'
            );
            existingFrames.forEach((frame) => frame.remove());

            // Clear any existing overlays
            const existingOverlays = document.querySelectorAll(
              ".razorpay-overlay, .razorpay-backdrop"
            );
            existingOverlays.forEach((overlay) => overlay.remove());

            // Add body class to prevent scroll issues
            document.body.classList.add("razorpay-open");

            // Force focus on document body to ensure proper event handling
            document.body.focus();
          }

          // Open Razorpay with additional error handling
          razorpay.open();

          // Add event listeners to handle modal state
          const handleRazorpayClose = () => {
            document.body.classList.remove("razorpay-open");
            // Clean up any remaining overlays after close
            setTimeout(() => {
              const remainingFrames = document.querySelectorAll(
                'iframe[src*="razorpay"], .razorpay-checkout-frame'
              );
              remainingFrames.forEach((frame) => frame.remove());

              const remainingOverlays = document.querySelectorAll(
                ".razorpay-overlay, .razorpay-backdrop"
              );
              remainingOverlays.forEach((overlay) => overlay.remove());
            }, 100);
          };

          // Listen for modal close events
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              mutation.removedNodes.forEach((node) => {
                if (
                  node instanceof Element &&
                  (node.classList?.contains("razorpay-checkout-frame") ||
                    (node.tagName === "IFRAME" && node.getAttribute("src")?.includes("razorpay")))
                ) {
                  handleRazorpayClose();
                }
              });
            });
          });

          observer.observe(document.body, { childList: true, subtree: true });

          // Clean up observer after 5 minutes
          setTimeout(() => {
            observer.disconnect();
          }, 300000);
        } catch (openError) {
          console.error("Error opening Razorpay modal:", openError);
          toast.error("Failed to open payment gateway. Please try again.");
          document.body.classList.remove("razorpay-open");
          setIsLoading(false);
        }
      }, 500); // Increased delay to 500ms for better stability
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to process payment";
      toast.error(errorMessage);
      onError?.({
        code: "PAYMENT_ERROR",
        description: errorMessage,
        source: "client",
        step: "order_creation",
        reason: "network_error",
        metadata: {
          order_id: "",
          payment_id: "",
        },
      });
      setIsLoading(false);
    }
    // Removed finally block to prevent premature loading state reset
  }, [isLoading, isScriptLoaded, amount, onSuccess, onClose, onError]);

  // Memoize dialog content to prevent unnecessary re-renders
  const dialogContent = useMemo(
    () => (
      <DialogContent className="border-orange-200 bg-white sm:max-w-md dark:border-orange-800 dark:bg-neutral-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-600 dark:text-orange-500">
            Support My Work
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Thank you for your support! Your contribution helps me continue creating great content.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-4">
          <div className="space-y-2 text-center">
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-500">₹{amount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Thank you for your support!</p>
          </div>
          <div className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-orange-500"
            >
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
          </div>
          <Button
            onClick={handlePayment}
            disabled={isLoading || !isScriptLoaded}
            className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : !isScriptLoaded ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading Payment System...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </Button>
        </div>
      </DialogContent>
    ),
    [amount, isLoading, isScriptLoaded, handlePayment]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {dialogContent}
    </Dialog>
  );
});

export { RazorpayPayment };
