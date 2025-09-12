"use client";

import { Coffee, Star } from "lucide-react";
import React, { useState } from "react";

import { RazorpayPaymentDynamic as RazorpayPayment } from "@/components/RazorpayPayment.dynamic";
import { freelanceProjects } from "@/constants/projects";
import type { RazorpayResponse, RazorpayError } from "@/types/razorpay";

const Freelance = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(99);

  const handlePaymentSuccess = (response: RazorpayResponse) => {
    console.log("Payment successful:", response);
    setIsPaymentModalOpen(false);
  };

  const handlePaymentError = (error: RazorpayError) => {
    console.error("Payment failed:", error);
    setIsPaymentModalOpen(false);
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Client Review Section */}
        <div className="mb-12">
          <h2 className="mb-8 text-center text-3xl font-bold">Client Review</h2>
          {freelanceProjects.map(
            (project) =>
              project.review && (
                <div
                  key={project.id}
                  className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-lg"
                >
                  <div className="mb-4 flex items-center gap-2">
                    {[...Array(project.review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-4 text-gray-600">{project.review.comment}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{project.review.reviewer}</p>
                      <p className="text-sm text-gray-500">{project.review.position}</p>
                    </div>
                    <p className="text-sm text-gray-500">{project.client}</p>
                  </div>
                </div>
              )
          )}
        </div>

        {/* Support Section */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Support My Work</h2>
          <p className="mx-auto mb-8 max-w-2xl text-gray-600">
            Your support helps me continue creating valuable content and projects. Choose an amount
            that works for you.
          </p>
          <div className="mx-auto mb-8 max-w-2xl rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-semibold">What You're Supporting</h3>
            <ul className="space-y-3 text-left text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-orange-500">•</span>
                <span>Development of open-source projects and tools</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">•</span>
                <span>Creation of educational content and tutorials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">•</span>
                <span>Maintenance and updates of existing projects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">•</span>
                <span>Development of new features and improvements</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Support Options */}
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 grid grid-cols-3 gap-4">
            {freelanceProjects[0]?.support?.amounts?.map((option) => (
              <button
                key={option.amount}
                onClick={() => {
                  setSelectedAmount(option.amount);
                  setIsPaymentModalOpen(true);
                }}
                className={`rounded-lg border p-4 transition-all ${
                  selectedAmount === option.amount
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-gray-200 hover:border-orange-300"
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
              className="flex-1 rounded-lg border border-gray-200 p-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              onChange={(e) => setSelectedAmount(parseInt(e.target.value) || 0)}
            />
            <button
              onClick={() => selectedAmount >= 10 && setIsPaymentModalOpen(true)}
              disabled={selectedAmount < 10}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Coffee className="h-5 w-5" />
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
