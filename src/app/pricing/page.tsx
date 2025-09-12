"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import MainLayout from "@/components/layout/MainLayout";
import { RazorpayPaymentDynamic as RazorpayPayment } from "@/components/RazorpayPayment.dynamic";
import type { RazorpayResponse, RazorpayError } from "@/types/razorpay";

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
      name: "Basic",
      price: 99,
      features: ["Basic support", "Access to basic features", "Email support"],
    },
    {
      name: "Pro",
      price: 199,
      features: ["Priority support", "Access to all features", "24/7 support", "Custom solutions"],
    },
    {
      name: "Enterprise",
      price: 499,
      features: [
        "Dedicated support",
        "Custom development",
        "Priority updates",
        "Training sessions",
      ],
    },
  ];

  const handlePaymentSuccess = (response: RazorpayResponse) => {
    console.log("Payment successful:", response);
    setIsPaymentModalOpen(false);
    setSelectedPackage(null);

    // Redirect to thank you page after successful payment
    router.push("/thank-you");
  };

  const handlePaymentError = (error: RazorpayError) => {
    console.error("Payment failed:", error);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-center text-4xl font-bold">Pricing Plans</h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-lg border p-6 transition-shadow hover:shadow-lg"
            >
              <h2 className="mb-4 text-2xl font-bold">{plan.name}</h2>
              <p className="mb-4 text-3xl font-bold">₹{plan.price}</p>
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  setSelectedPackage(plan);
                  setIsPaymentModalOpen(true);
                }}
                className="bg-primary hover:bg-primary/90 w-full rounded py-2 text-white transition-colors"
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
