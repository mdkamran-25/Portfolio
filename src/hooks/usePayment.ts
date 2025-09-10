/**
 * usePayment Hook - Phase 5: State & Side Effects Discipline
 *
 * React Query hook for payment operations.
 * Manages payment state, caching, and error handling with enterprise patterns.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services/payment/payment.service";
import { useUIStore } from "@/state/stores/ui-store";

/**
 * Payment Query Keys Factory
 */
export const paymentKeys = {
  all: ["payments"] as const,
  orders: () => [...paymentKeys.all, "orders"] as const,
  order: (id: string) => [...paymentKeys.orders(), id] as const,
  payments: () => [...paymentKeys.all, "payments"] as const,
  payment: (id: string) => [...paymentKeys.payments(), id] as const,
  status: (id: string) => [...paymentKeys.payment(id), "status"] as const,
};

/**
 * Payment Hook Configuration
 */
interface UsePaymentConfig {
  enableNotifications?: boolean;
  autoCloseModal?: boolean;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
}

/**
 * Payment Hook
 *
 * Provides a comprehensive payment interface with:
 * - Order creation
 * - Payment processing
 * - State management
 * - Error handling
 * - Loading states
 * - Notifications
 */
export function usePayment(config: UsePaymentConfig = {}) {
  const { enableNotifications = true, autoCloseModal = true, onSuccess, onError } = config;

  const queryClient = useQueryClient();
  const { closePaymentModal, addNotification, setLoading } = useUIStore();

  /**
   * Create Payment Order Mutation
   */
  const createOrderMutation = useMutation({
    mutationFn: async (request: {
      amount: number;
      currency?: string;
      purpose?: string;
      metadata?: Record<string, any>;
    }) => {
      setLoading(true, "Creating payment order...");

      try {
        const order = await paymentService.createOrder(request);
        return order;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (order) => {
      // Cache the order
      queryClient.setQueryData(paymentKeys.order(order.id), order);

      if (enableNotifications) {
        addNotification({
          type: "success",
          title: "Order Created",
          message: `Payment order created successfully for ₹${order.amount / 100}`,
        });
      }
    },
    onError: (error) => {
      console.error("Order creation failed:", error);

      if (enableNotifications) {
        addNotification({
          type: "error",
          title: "Order Creation Failed",
          message: error instanceof Error ? error.message : "Failed to create payment order",
        });
      }

      onError?.(error);
    },
  });

  /**
   * Process Payment Mutation
   */
  const processPaymentMutation = useMutation({
    mutationFn: async ({
      order,
      customerInfo = {},
    }: {
      order: any;
      customerInfo?: {
        name?: string;
        email?: string;
        contact?: string;
      };
    }) => {
      setLoading(true, "Processing payment...");

      try {
        const result = await paymentService.processPayment(order, customerInfo);
        return result;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (result) => {
      if (result.success) {
        // Cache payment data
        if (result.paymentId) {
          queryClient.setQueryData(paymentKeys.payment(result.paymentId), result);
        }

        // Close modal if configured
        if (autoCloseModal) {
          closePaymentModal();
        }

        if (enableNotifications) {
          addNotification({
            type: "success",
            title: "Payment Successful",
            message: "Your payment has been processed successfully!",
          });
        }

        onSuccess?.(result);
      } else {
        // Handle payment failure
        const errorMessage = result.error?.message || "Payment failed";

        if (enableNotifications) {
          addNotification({
            type: "error",
            title: "Payment Failed",
            message: errorMessage,
          });
        }

        onError?.(result.error);
      }
    },
    onError: (error) => {
      console.error("Payment processing failed:", error);

      if (enableNotifications) {
        addNotification({
          type: "error",
          title: "Payment Error",
          message: error instanceof Error ? error.message : "Payment processing failed",
        });
      }

      onError?.(error);
    },
  });

  /**
   * Verify Payment Mutation
   */
  const verifyPaymentMutation = useMutation({
    mutationFn: async ({
      orderId,
      paymentId,
      signature,
    }: {
      orderId: string;
      paymentId: string;
      signature: string;
    }) => {
      return await paymentService.verifyPayment(orderId, paymentId, signature);
    },
    onSuccess: (isValid) => {
      if (enableNotifications) {
        addNotification({
          type: isValid ? "success" : "warning",
          title: isValid ? "Payment Verified" : "Verification Warning",
          message: isValid
            ? "Payment signature verified successfully"
            : "Payment signature verification failed",
        });
      }
    },
  });

  /**
   * Quick Payment Function
   *
   * Combines order creation and payment processing in one call
   */
  const quickPayment = async (
    amount: number,
    purpose?: string,
    customerInfo?: {
      name?: string;
      email?: string;
      contact?: string;
    }
  ) => {
    try {
      // Create order
      const orderRequest: {
        amount: number;
        currency?: string;
        purpose?: string;
        metadata?: Record<string, any>;
      } = {
        amount,
        metadata: { source: "portfolio" },
      };

      if (purpose) {
        orderRequest.purpose = purpose;
        orderRequest.metadata = { ...orderRequest.metadata, purpose };
      }

      const order = await createOrderMutation.mutateAsync(orderRequest);

      // Process payment
      const paymentRequest: {
        order: any;
        customerInfo?: {
          name?: string;
          email?: string;
          contact?: string;
        };
      } = { order };

      if (customerInfo) {
        paymentRequest.customerInfo = customerInfo;
      }

      const result = await processPaymentMutation.mutateAsync(paymentRequest);

      return result;
    } catch (error) {
      console.error("Quick payment failed:", error);
      throw error;
    }
  };

  /**
   * Get Payment Status Query
   */
  const usePaymentStatus = (paymentId: string, enabled = false) => {
    return useQuery({
      queryKey: paymentKeys.status(paymentId),
      queryFn: () => paymentService.getPaymentStatus(paymentId),
      enabled: enabled && !!paymentId,
      refetchInterval: (query) => {
        // Stop polling if payment is completed
        const data = query.state.data;
        if (data?.status === "captured" || data?.status === "failed") {
          return false;
        }
        return 5000; // Poll every 5 seconds
      },
      staleTime: 30 * 1000, // 30 seconds
    });
  };

  return {
    // Mutations
    createOrder: createOrderMutation.mutate,
    createOrderAsync: createOrderMutation.mutateAsync,
    processPayment: processPaymentMutation.mutate,
    processPaymentAsync: processPaymentMutation.mutateAsync,
    verifyPayment: verifyPaymentMutation.mutate,
    verifyPaymentAsync: verifyPaymentMutation.mutateAsync,

    // Combined operations
    quickPayment,

    // Status hooks
    usePaymentStatus,

    // State
    isCreatingOrder: createOrderMutation.isPending,
    isProcessingPayment: processPaymentMutation.isPending,
    isVerifyingPayment: verifyPaymentMutation.isPending,

    // Computed states
    isLoading: createOrderMutation.isPending || processPaymentMutation.isPending,

    // Errors
    createOrderError: createOrderMutation.error,
    processPaymentError: processPaymentMutation.error,
    verifyPaymentError: verifyPaymentMutation.error,

    // Reset functions
    resetCreateOrder: createOrderMutation.reset,
    resetProcessPayment: processPaymentMutation.reset,
    resetVerifyPayment: verifyPaymentMutation.reset,

    // Cache utilities
    invalidatePayments: () => queryClient.invalidateQueries({ queryKey: paymentKeys.all }),
    clearPaymentCache: () => queryClient.removeQueries({ queryKey: paymentKeys.all }),
  };
}

/**
 * Specific payment hooks for common use cases
 */

/**
 * Coffee Payment Hook
 */
export function useCoffeePayment() {
  const payment = usePayment({
    enableNotifications: true,
    autoCloseModal: true,
    onSuccess: (result) => {
      console.log("Coffee payment successful:", result);
      // Could trigger additional effects like analytics
    },
  });

  const buyCoffee = (amount: number, message?: string) => {
    return payment.quickPayment(amount, `Buy me a coffee: ${message || "Thank you!"}`);
  };

  return {
    ...payment,
    buyCoffee,
  };
}

/**
 * Service Payment Hook
 */
export function useServicePayment() {
  const payment = usePayment({
    enableNotifications: true,
    autoCloseModal: true,
    onSuccess: (result) => {
      console.log("Service payment successful:", result);
      // Could trigger service fulfillment workflow
    },
  });

  const payForService = (
    serviceType: string,
    amount: number,
    customerInfo?: {
      name?: string;
      email?: string;
      contact?: string;
    }
  ) => {
    return payment.quickPayment(amount, `Service: ${serviceType}`, customerInfo);
  };

  return {
    ...payment,
    payForService,
  };
}

/**
 * Payment Status Hook
 *
 * For tracking payment status outside of the main payment flow
 */
export function usePaymentTracking(paymentId: string) {
  const queryClient = useQueryClient();

  const statusQuery = useQuery({
    queryKey: paymentKeys.status(paymentId),
    queryFn: () => paymentService.getPaymentStatus(paymentId),
    enabled: !!paymentId,
    refetchInterval: (query) => {
      // Stop polling if payment is completed
      const data = query.state.data;
      if (data?.status === "captured" || data?.status === "failed") {
        return false;
      }
      return 5000; // Poll every 5 seconds
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  return {
    status: statusQuery.data,
    isLoading: statusQuery.isLoading,
    error: statusQuery.error,
    refetch: statusQuery.refetch,

    // Cache utilities
    invalidateStatus: () =>
      queryClient.invalidateQueries({ queryKey: paymentKeys.status(paymentId) }),
  };
}
