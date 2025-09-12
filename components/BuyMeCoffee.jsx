import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

const BuyMeCoffee = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 100, // Amount in INR
          currency: 'INR',
        }),
      });

      const data = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'Support My Work',
        description: 'Buy me a coffee',
        order_id: data.id,
        handler: function (response) {
          // Handle successful payment
          console.log('Payment successful:', response);
        },
        prefill: {
          name: 'Your Name',
          email: 'your.email@example.com',
        },
        theme: {
          color: '#FF813F',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-24 h-24">
          <Image
            src="/coffee-cup.png"
            alt="Coffee Cup"
            fill
            className="object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Buy Me a Coffee</h2>
        <p className="text-gray-600 text-center">
          If you enjoy my work and would like to support me, consider buying me a coffee!
        </p>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Buy Me a Coffee</span>
              <span className="text-lg">☕</span>
            </>
          )}
        </button>
        <p className="text-sm text-gray-500">
          Powered by Razorpay
        </p>
      </div>
    </motion.div>
  );
};

export default BuyMeCoffee; 