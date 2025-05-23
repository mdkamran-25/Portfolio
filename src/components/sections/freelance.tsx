'use client';

import React, { useState } from 'react';
import { Coffee, Star } from 'lucide-react';
import { RazorpayPayment } from '@/components/RazorpayPayment';
import type { RazorpayResponse, RazorpayError } from '@/types/razorpay';
import { freelanceProjects } from '@/constants/projects';

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
        {/* Client Review Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Client Review</h2>
          {freelanceProjects.map((project) => (
            project.review && (
              <div key={project.id} className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(project.review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{project.review.comment}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{project.review.reviewer}</p>
                    <p className="text-sm text-gray-500">{project.review.position}</p>
                  </div>
                  <p className="text-sm text-gray-500">{project.client}</p>
                </div>
                
              </div>

            )
          ))}
        </div>
        
        

        {/* Support Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Support My Work</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Your support helps me continue creating valuable content and projects. Choose an amount that works for you.
          </p>
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">What You're Supporting</h3>
            <ul className="text-left space-y-3 text-gray-600">
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
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {freelanceProjects[0].support?.amounts.map((option) => (
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