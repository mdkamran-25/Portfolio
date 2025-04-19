'use client';

import React, { useState } from 'react';
import { Coffee } from 'lucide-react';
import { RazorpayPayment } from '@/components/RazorpayPayment';
import type { RazorpayResponse, RazorpayError } from '@/types/razorpay';

const PREDEFINED_AMOUNTS = [
  { amount: 99, label: 'Basic Support' },
  { amount: 199, label: 'Premium Support' },
  { amount: 999, label: 'Enterprise Support' },
];

const Freelance = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(99);

  const handlePaymentSuccess = (response: RazorpayResponse) => {
    console.log('Payment successful:', response);
    setIsPaymentModalOpen(false);
  };

  const handlePaymentError = (error: RazorpayError) => {
    console.error('Payment failed:', error);
    setIsPaymentModalOpen(false);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Support My Work</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            If you find my work valuable and would like to support me, you can choose from the options below or enter a custom amount.
          </p>
        </div>
        
        {/* Support Options */}
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {PREDEFINED_AMOUNTS.map((option) => (
              <button
                key={option.amount}
                onClick={() => {
                  setSelectedAmount(option.amount);
                  setIsPaymentModalOpen(true);
                }}
                className={`p-4 rounded-lg border transition-all ${
                  selectedAmount === option.amount
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
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="10"
              placeholder="Enter custom amount"
              className="flex-1 p-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              onChange={(e) => setSelectedAmount(parseInt(e.target.value) || 0)}
            />
            <button
              onClick={() => selectedAmount >= 10 && setIsPaymentModalOpen(true)}
              disabled={selectedAmount < 10}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Coffee className="w-5 h-5" />
              Support
            </button>
          </div>
        </div>
      </div>

      <RazorpayPayment
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={selectedAmount}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </section>
  );
};

export default Freelance; 