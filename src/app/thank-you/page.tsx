'use client';

import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { CheckCircle, Heart, Gift } from 'lucide-react';
import Link from 'next/link';

const ThankYouPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const inspirationalQuotes = [
    "Your support fuels creativity and innovation. Thank you for believing in my work! 🚀",
    "Together we build amazing things. Your contribution makes a real difference! ✨",
    "Thank you for investing in my journey. Your support means the world to me! 🌟",
    "Your generosity helps turn ideas into reality. Thank you for being awesome! 💫",
    "Supporting creators like me helps build a better digital world. Thank you! 🎯"
  ];

  const randomQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];

  if (!mounted) {
    return null;
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-neutral-900/50 p-8 sm:p-12">
          <div className="text-center">
            {/* Success Icon */}
            <div className="mb-8 flex justify-center">
              <div className="rounded-full bg-green-500/20 p-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
            </div>

            {/* Thank You Message */}
            <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
              Thank You! 🎉
            </h1>
            
            <div className="mb-6 text-xl text-gray-300">
              Payment Successful! 
            </div>

            {/* Happy Emojis */}
            <div className="mb-8 text-6xl">
              😊 🎊 💙 🙏 ✨
            </div>

            {/* Inspirational Quote */}
            <div className="mb-8 rounded-xl bg-orange-500/10 p-6 border border-orange-500/20">
              <div className="flex justify-center mb-4">
                <Heart className="h-8 w-8 text-orange-500" />
              </div>
              <p className="text-lg text-gray-300 font-medium leading-relaxed">
                {randomQuote}
              </p>
            </div>

            {/* Additional Message */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Gift className="h-5 w-5" />
                <span>Your support helps me continue creating amazing projects</span>
              </div>
              
              <p className="text-gray-400 max-w-2xl mx-auto">
                You'll receive a confirmation email shortly. If you have any questions or need support, 
                please don't hesitate to reach out through the contact page.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
              >
                Back to Portfolio
              </Link>
              
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-lg transition-colors"
              >
                Contact Me
              </Link>
              
              <Link 
                href="/projects"
                className="inline-flex items-center justify-center px-6 py-3 border border-neutral-600 hover:border-neutral-500 text-gray-300 hover:text-white font-semibold rounded-lg transition-colors"
              >
                View My Work
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ThankYouPage;