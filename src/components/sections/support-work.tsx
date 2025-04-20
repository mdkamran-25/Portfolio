'use client';

import React, { useState } from 'react';
import { Coffee } from 'lucide-react';
import { RazorpayPayment } from '@/components/RazorpayPayment';
import type { RazorpayResponse, RazorpayError } from '@/types/razorpay';
import { freelanceProjects } from '@/constants/projects';

const SupportWork = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(199);

  const handlePaymentSuccess = (response: RazorpayResponse) => {
    console.log('Payment successful:', response);
    setIsPaymentModalOpen(false);
  };

  const handlePaymentError = (error: RazorpayError) => {
    console.error('Payment failed:', error);
    setIsPaymentModalOpen(false);
  };

  return (
    <section className="py-8 sm:py-16 bg-black">
      <div className="container mx-auto px-4">
        {/* Support Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-yellow-500">Support My Work</h2>
          <p className="text-white max-w-2xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base">
            Your support helps me continue creating valuable content and projects. Choose an amount that works for you.
          </p>
          <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-yellow-500">What You're Supporting</h3>
            <ul className="text-left space-y-3 text-white text-sm sm:text-base">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>Development of open-source projects and tools</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>Creation of educational content and tutorials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>Maintenance and updates of existing projects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>Development of new features and improvements</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Support Options */}
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {freelanceProjects[0].support?.amounts.map((option) => (
              <button
                key={option.amount}
                onClick={() => {
                  setSelectedAmount(option.amount);
                  setIsPaymentModalOpen(true);
                }}
                className={`p-4 rounded-lg border transition-all ${
                  selectedAmount === option.amount
                    ? 'border-yellow-500 bg-yellow-900/50 text-yellow-500'
                    : 'border-gray-700 hover:border-yellow-500 text-white'
                }`}
              >
                <div className="font-semibold">₹{option.amount}</div>
                <div className="text-xs text-gray-400">{option.label}</div>
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="number"
              min="10"
              placeholder="Enter custom amount"
              className="w-full sm:flex-1 p-3 rounded-lg border border-gray-700 bg-gray-900 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              onChange={(e) => setSelectedAmount(parseInt(e.target.value) || 0)}
            />
            <button
              onClick={() => selectedAmount >= 10 && setIsPaymentModalOpen(true)}
              disabled={selectedAmount < 10}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Coffee className="w-5 h-5" />
              Support
            </button>
          </div>

          {/* Buy Me a Coffee Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                setSelectedAmount(199);
                setIsPaymentModalOpen(true);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
              Buy Me a Coffee
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

export default SupportWork; 