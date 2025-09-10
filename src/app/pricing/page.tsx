'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Check } from 'lucide-react';
import { RazorpayPayment } from '@/components/RazorpayPayment';
import { useRouter } from 'next/navigation';
import type { RazorpayResponse, RazorpayError } from '@/types/razorpay';

interface PricingPackage {
  name: string;
  price: number;
  features: string[];
}

const PricingPage = () => {
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const router = useRouter();

  const pricingPlans = [
    {
      name: 'Basic',
      price: 99,
      features: [
        'Basic support',
        'Access to basic features',
        'Email support',
      ],
    },
    {
      name: 'Pro',
      price: 199,
      features: [
        'Priority support',
        'Access to all features',
        '24/7 support',
        'Custom solutions',
      ],
    },
    {
      name: 'Enterprise',
      price: 499,
      features: [
        'Dedicated support',
        'Custom development',
        'Priority updates',
        'Training sessions',
      ],
    },
  ];

  const handlePaymentSuccess = (response: RazorpayResponse) => {
    console.log('Payment successful:', response);
    setIsPaymentModalOpen(false);
    setSelectedPackage(null);
    
    // Redirect to thank you page after successful payment
    router.push('/thank-you');
  };

  const handlePaymentError = (error: RazorpayError) => {
    console.error('Payment failed:', error);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Pricing Plans</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
              <p className="text-3xl font-bold mb-4">₹{plan.price}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  setSelectedPackage(plan);
                  setIsPaymentModalOpen(true);
                }}
                className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition-colors"
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      <RazorpayPayment
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedPackage(null);
        }}
        amount={selectedPackage?.price || 99}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </MainLayout>
  );
};

export default PricingPage; 