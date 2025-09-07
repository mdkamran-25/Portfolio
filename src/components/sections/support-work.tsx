"use client";

import React, { useState, useRef, useEffect } from "react";
import { Coffee } from "lucide-react";
import { RazorpayPayment } from "@/components/RazorpayPayment";
import type { RazorpayResponse, RazorpayError } from "@/types/razorpay";
import { freelanceProjects } from "@/constants/projects";

const SupportWork = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(199);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handlePaymentSuccess = (response: RazorpayResponse) => {
    console.log("Payment successful:", response);
    setIsPaymentModalOpen(false);
  };

  const handlePaymentError = (error: RazorpayError) => {
    console.error("Payment failed:", error);
    setIsPaymentModalOpen(false);
  };

  const handleOpenPayment = (amount: number) => {
    // Clear any existing debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set amount and open modal with debounce
    setSelectedAmount(amount);
    debounceRef.current = setTimeout(() => {
      setIsPaymentModalOpen(true);
    }, 100);
  };

  return (
    <div>
      {/* Support Section */}
      <div className="mb-8 text-center sm:mb-12">
        <h2 className="mb-4 text-2xl font-bold text-yellow-500 sm:text-3xl">Support My Work</h2>
        <p className="mx-auto mb-6 max-w-2xl text-sm text-white sm:mb-8 sm:text-base">
          Your support helps me continue creating valuable content and projects. Choose an amount
          that works for you.
        </p>
        <div className="mx-auto mb-6 max-w-2xl rounded-lg bg-gray-900 p-4 shadow-lg sm:mb-8 sm:p-6">
          <h3 className="mb-4 text-lg font-semibold text-yellow-500 sm:text-xl">
            What You're Supporting
          </h3>
          <ul className="space-y-3 text-left text-sm text-white sm:text-base">
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
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {freelanceProjects[0].support?.amounts.map((option) => (
            <button
              key={option.amount}
              onClick={() => handleOpenPayment(option.amount)}
              disabled={isPaymentModalOpen}
              className={`rounded-lg border p-4 transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                selectedAmount === option.amount
                  ? "border-yellow-500 bg-yellow-900/50 text-yellow-500"
                  : "border-gray-700 text-white hover:border-yellow-500"
              }`}
            >
              <div className="font-semibold">₹{option.amount}</div>
              <div className="text-xs text-gray-400">{option.label}</div>
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <input
            type="number"
            min="10"
            placeholder="Enter custom amount"
            className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 sm:flex-1"
            onChange={(e) => setSelectedAmount(parseInt(e.target.value) || 0)}
          />
          <button
            onClick={() => {
              if (selectedAmount >= 10) {
                handleOpenPayment(selectedAmount);
              }
            }}
            disabled={selectedAmount < 10 || isPaymentModalOpen}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 text-black transition-colors hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <Coffee className="h-5 w-5" />
            Support
          </button>
        </div>

        <RazorpayPayment
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          amount={selectedAmount}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>
    </div>
  );
};

export default SupportWork;
