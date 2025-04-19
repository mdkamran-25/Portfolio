import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Coffee } from 'lucide-react';
import { RazorpayConstructor, RazorpayOptions, RazorpayResponse } from '@/types/razorpay';

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

interface RazorpayPaymentProps {
  amount?: number;
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: (response: RazorpayResponse) => void;
  onError?: (error: RazorpayError) => void;
}

declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}

const PREDEFINED_AMOUNTS = [
  { amount: 99, label: 'Basic Support' },
  { amount: 199, label: 'Premium Support' },
  { amount: 999, label: 'Enterprise Support' },
];

export function RazorpayPayment({ 
  amount = 99, 
  isOpen = false, 
  onClose,
  onSuccess, 
  onError 
}: RazorpayPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(amount);
  const [isCustomAmount, setIsCustomAmount] = useState(false);

  useEffect(() => {
    const loadScript = async () => {
      if (isScriptLoaded) return;

      try {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          setIsScriptLoaded(true);
        };
        script.onerror = () => {
          toast.error('Failed to load Razorpay script');
        };
        document.body.appendChild(script);
      } catch (error) {
        console.error('Error loading Razorpay script:', error);
        toast.error('Failed to load Razorpay script');
      }
    };

    if (isOpen) {
      loadScript();
    }
  }, [isOpen, isScriptLoaded]);

  const handlePayment = async () => {
    if (!window.Razorpay) {
      toast.error('Payment system not loaded. Please try again.');
      return;
    }

    setIsLoading(true);
    try {
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
      if (!razorpayKey) {
        throw new Error('Razorpay key not configured');
      }

      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        name: 'Mohammad Kamran',
        description: 'Support the developer',
        order_id: '', // This will be set after creating the order
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify the payment
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(response),
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            toast.success('Payment successful! Thank you for your support.');
            onSuccess?.(response);
          } catch (error) {
            console.error('Verification error:', error);
            toast.error('Payment verification failed');
            onError?.({
              code: 'VERIFICATION_FAILED',
              description: 'Payment verification failed',
              source: 'verification',
              step: 'verification',
              reason: 'API Error',
              metadata: {
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
              },
            });
          }
        },
        prefill: {
          name: 'Supporter',
          email: 'supporter@example.com',
        },
        theme: {
          color: '#18181b',
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      onError?.({
        code: 'PAYMENT_FAILED',
        description: 'Payment failed',
        source: 'payment',
        step: 'payment',
        reason: 'API Error',
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
      <DialogTrigger asChild>
        <Button variant="default" className="w-full flex items-center gap-2">
          <Coffee className="w-4 h-4" />
          Support Developer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coffee className="w-5 h-5" />
            Support My Work
          </DialogTitle>
          <DialogDescription>
            Choose an amount to support my work and help me continue creating great content.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Predefined Amounts */}
          <div className="grid grid-cols-3 gap-2">
            {PREDEFINED_AMOUNTS.map((option) => (
              <button
                key={option.amount}
                onClick={() => {
                  setSelectedAmount(option.amount);
                  setIsCustomAmount(false);
                }}
                className={`p-3 rounded-lg border transition-all ${
                  selectedAmount === option.amount && !isCustomAmount
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="font-semibold">₹{option.amount}</div>
                <div className="text-xs text-gray-500">{option.label}</div>
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <Input
              type="number"
              value={isCustomAmount ? selectedAmount : ''}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setSelectedAmount(value);
                setIsCustomAmount(true);
              }}
              placeholder="Enter custom amount"
              className="pl-7"
              min="10"
            />
          </div>

          <Button 
            onClick={handlePayment} 
            disabled={isLoading || !isScriptLoaded || selectedAmount < 10}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              `Pay ₹${selectedAmount}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 