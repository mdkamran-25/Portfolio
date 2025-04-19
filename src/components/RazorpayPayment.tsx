'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { RazorpayOptions, RazorpayResponse, RazorpayError, RazorpayConstructor } from '@/types/razorpay';

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

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  isOpen,
  onClose,
  amount,
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const loadScript = async () => {
      if (isScriptLoaded) return;

      try {
        if (document.getElementById('razorpay-script')) {
          setIsScriptLoaded(true);
          return;
        }

        const script = document.createElement('script');
        script.id = 'razorpay-script';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        
        script.onload = () => {
          const originalConsoleWarn = console.warn;
          console.warn = (...args: unknown[]) => {
            if (!args[0]?.toString().includes('lockdown-install.js')) {
              originalConsoleWarn.apply(console, args);
            }
          };
          setIsScriptLoaded(true);
        };
        
        script.onerror = () => {
          console.error('Failed to load Razorpay script');
          toast.error('Failed to load payment system. Please try again.');
        };
        
        document.body.appendChild(script);
      } catch (error) {
        console.error('Error loading Razorpay script:', error);
        toast.error('Failed to load payment system. Please try again.');
      }
    };

    if (isOpen) {
      loadScript();
    }

    return () => {
      const script = document.getElementById('razorpay-script');
      if (script) {
        script.remove();
      }
    };
  }, [isOpen, isScriptLoaded]);

  const handlePayment = async () => {
    if (!isScriptLoaded) {
      toast.error('Payment system is not ready yet. Please try again.');
      return;
    }

    const Razorpay = window.Razorpay;
    if (!Razorpay) {
      toast.error('Payment system is not available. Please try again.');
      return;
    }

    setIsLoading(true);
    try {
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          amount: amount * 100,
          currency: 'INR'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Order creation failed:', data);
        if (response.status === 500) {
          toast.error('Payment service is temporarily unavailable. Please try again later.');
        } else {
          throw new Error(data.error || 'Failed to create order. Please try again.');
        }
        return;
      }

      if (!data.id || !data.amount) {
        console.error('Invalid order response:', data);
        throw new Error('Invalid response from server. Please try again.');
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: data.amount,
        currency: 'INR',
        name: 'Kamran',
        description: 'Support my work',
        order_id: data.id,
        handler: (response: RazorpayResponse) => {
          console.log('Payment successful:', response);
          toast.success('Payment successful! Thank you for your support.');
          onSuccess?.(response);
        },
        prefill: {
          name: 'Customer',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#F97316'
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
            toast.info('Payment cancelled');
          }
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: 'Pay using UPI',
                instruments: [
                  {
                    method: 'upi',
                    flows: ['collect']
                  }
                ]
              }
            },
            sequence: ['block.banks'],
            preferences: {
              show_default_blocks: true
            }
          }
        },
        qr_code: {
          enabled: true,
          size: 200,
          image: true
        },
        error: (error: RazorpayError) => {
          console.error('Payment error:', error);
          toast.error('An error occurred during payment. Please try again.');
          onError?.(error);
        }
      };

      const razorpay = new Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process payment';
      toast.error(errorMessage);
      onError?.({
        code: 'PAYMENT_ERROR',
        description: errorMessage,
        source: 'client',
        step: 'order_creation',
        reason: 'network_error',
        metadata: {
          order_id: '',
          payment_id: '',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-neutral-900 border-orange-200 dark:border-orange-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-600 dark:text-orange-500">Support My Work</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Thank you for your support! Your contribution helps me continue creating great content.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-4">
          <div className="text-center space-y-2">
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
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : !isScriptLoaded ? (
              'Loading Payment...'
            ) : (
              'Proceed to Payment'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { RazorpayPayment }; 