"use client";

import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

// Loading component for payment modal
const PaymentLoading = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    <span className="ml-2 text-sm text-gray-600">Loading payment...</span>
  </div>
);

// Dynamically import RazorpayPayment with loading state
export const RazorpayPaymentDynamic = dynamic(
  () => import("./RazorpayPayment").then((mod) => ({ default: mod.RazorpayPayment })),
  {
    loading: PaymentLoading,
    ssr: false, // Payment components should not be server-side rendered
  }
);

// Re-export types for convenience
export type { RazorpayResponse, RazorpayError } from "@/types/razorpay";
