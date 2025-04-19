export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string | number | boolean>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  config?: {
    display?: {
      blocks?: Record<string, {
        name: string;
        instruments: Array<{
          method: string;
          flows: string[];
        }>;
      }>;
      sequence?: string[];
      preferences?: {
        show_default_blocks?: boolean;
      };
    };
  };
  qr_code?: {
    enabled: boolean;
    size: number;
    image: boolean;
  };
  error?: (error: RazorpayError) => void;
}

export interface RazorpayInstance {
  open(): void;
  on(event: 'payment.failed' | 'payment.error', callback: (response: RazorpayError) => void): void;
}

export interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayError {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: {
    order_id: string;
    payment_id: string;
  };
}

declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}

export type { RazorpayInstance, RazorpayConstructor, RazorpayResponse, RazorpayError }; 