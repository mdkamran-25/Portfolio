'use client';

import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Smartphone, ArrowRight, QrCode, MessageSquare, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UPI_APPS = [
  { 
    name: 'Google Pay', 
    scheme: 'gpay',
    url: (upiId: string, name: string, amount: number, message?: string) => 
      `tez://upi/pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(message || 'Support My Work')}&mc=0000`
  },
  { 
    name: 'PhonePe', 
    scheme: 'phonepe',
    url: (upiId: string, name: string, amount: number, message?: string) => 
      `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(message || 'Support My Work')}&mc=0000`
  },
  { 
    name: 'Paytm', 
    scheme: 'paytm',
    url: (upiId: string, name: string, amount: number, message?: string) => 
      `paytmmp://upi/pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(message || 'Support My Work')}&mc=0000`
  },
  { 
    name: 'Amazon Pay', 
    scheme: 'amazon',
    url: (upiId: string, name: string, amount: number, message?: string) => 
      `amazonpay://upi/pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(message || 'Support My Work')}&mc=0000`
  }
];

// Declare the window property
declare global {
  interface Window {
    paymentStartTime: number;
  }
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const UPI_ID = 'keykamran7366@ybl';
  const RECIPIENT_NAME = 'Kamran';
  const PHONE_NUMBER = '7366972054';
  const [isMobile, setIsMobile] = useState(false);
  const [showConfirmButton, setShowConfirmButton] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scrolling when modal is closed
      document.body.style.overflow = 'auto';
    }
    return () => {
      // Cleanup: restore body scrolling when component unmounts
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setCustomAmount('');
    setShowConfirmButton(true);
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
      setIsCustom(true);
      setShowConfirmButton(true);
    }
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAppSelect = (app: typeof UPI_APPS[0]) => {
    setSelectedApp(app.scheme);
  };

  const getUPIString = () => {
    const amount = isCustom ? parseInt(customAmount) : selectedAmount;
    if (amount && amount > 0) {
      return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(RECIPIENT_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(message || 'Support My Work')}`;
    }
    return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(RECIPIENT_NAME)}&cu=INR&tn=${encodeURIComponent(message || 'Support My Work')}`;
  };

  const handleProceedToPay = () => {
    const amount = isCustom ? parseInt(customAmount) : selectedAmount;
    if (amount && amount > 0 && selectedApp) {
      const app = UPI_APPS.find(a => a.scheme === selectedApp);
      if (app) {
        try {
          const paymentUrl = app.url(UPI_ID, RECIPIENT_NAME, amount, message);
          
          // For mobile devices, try to open the UPI app directly
          if (isMobile) {
            // First try to open the app directly using the specific scheme
            const link = document.createElement('a');
            link.href = paymentUrl;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // If the app doesn't open within 2 seconds, show a fallback message
            setTimeout(() => {
              if (!document.hidden) {
                // Try the generic UPI URL as fallback
                const fallbackUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(RECIPIENT_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(message || 'Support My Work')}`;
                window.location.href = fallbackUrl;
                
                // If that also fails, show QR code
                setTimeout(() => {
                  if (!document.hidden) {
                    alert('If the UPI app didn\'t open automatically, please scan the QR code below');
                  }
                }, 2000);
              }
            }, 2000);
          } else {
            // For desktop, open in new window
            window.open(paymentUrl, '_blank', 'noopener,noreferrer');
          }
        } catch (error) {
          console.error('Error initiating payment:', error);
          alert('Error initiating payment. Please try again or use the QR code.');
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-neutral-900 p-4 sm:p-6 my-auto">
        <div className="sticky top-0 z-10 flex justify-end">
          <button
            onClick={onClose}
            className="absolute right-2 top-2 text-neutral-400 hover:text-orange-500 sm:right-4 sm:top-4"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-4rem)]">
          <h2 className="mb-4 text-xl font-bold text-white sm:mb-6 sm:text-2xl">Support My Work</h2>
          
          <div className="mb-4 space-y-3 sm:mb-6 sm:space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={() => handleAmountSelect(99)}
                className={`rounded-lg border p-3 text-center transition-colors sm:p-4 ${
                  selectedAmount === 99
                    ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                    : 'border-neutral-700 text-neutral-300 hover:border-orange-500 hover:text-orange-500'
                }`}
              >
                <span className="text-lg font-semibold sm:text-xl">₹99</span>
              </button>
              <button
                onClick={() => handleAmountSelect(199)}
                className={`rounded-lg border p-3 text-center transition-colors sm:p-4 ${
                  selectedAmount === 199
                    ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                    : 'border-neutral-700 text-neutral-300 hover:border-orange-500 hover:text-orange-500'
                }`}
              >
                <span className="text-lg font-semibold sm:text-xl">₹199</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={customAmount}
                onChange={handleCustomAmount}
                placeholder="Enter custom amount"
                className={`w-full rounded-lg border bg-neutral-800 p-3 text-white placeholder-neutral-500 focus:border-orange-500 focus:outline-none sm:p-4 ${
                  isCustom ? 'border-orange-500' : 'border-neutral-700'
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 sm:right-4">₹</span>
            </div>

            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message (optional)"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 p-3 text-white placeholder-neutral-500 focus:border-orange-500 focus:outline-none sm:p-4"
                rows={2}
                maxLength={100}
              />
              <MessageSquare className="absolute right-3 top-3 h-4 w-4 text-neutral-400 sm:right-4 sm:top-4 sm:h-5 sm:w-5" />
              <span className="absolute bottom-1 right-2 text-xs text-neutral-500 sm:bottom-2">
                {message.length}/100
              </span>
            </div>

            <div className="mt-4 rounded-lg border border-neutral-700 p-3 sm:mt-6 sm:p-4">
              <h3 className="mb-2 text-sm font-semibold text-neutral-300">UPI Payment Details</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-neutral-500">UPI ID</p>
                    <span className="text-sm text-neutral-400 sm:text-base">{UPI_ID}</span>
                  </div>
                  <button
                    onClick={handleCopyUPI}
                    className="text-neutral-400 hover:text-orange-500"
                    title="Copy UPI ID"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Phone Number</p>
                  <span className="text-sm text-neutral-400 sm:text-base">+91 {PHONE_NUMBER}</span>
                </div>
              </div>
            </div>

            {isMobile ? (
              <div className="mt-4 sm:mt-6">
                <h3 className="mb-2 text-sm font-semibold text-neutral-300 sm:mb-3">Select Payment App</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {UPI_APPS.map((app) => (
                    <button
                      key={app.scheme}
                      onClick={() => handleAppSelect(app)}
                      className={`flex items-center justify-center gap-1.5 rounded-lg border p-2 text-sm transition-colors sm:gap-2 sm:p-3 sm:text-base ${
                        selectedApp === app.scheme
                          ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                          : 'border-neutral-700 text-neutral-300 hover:border-orange-500 hover:text-orange-500'
                      }`}
                    >
                      <Smartphone className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>{app.name}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-neutral-400 text-center">
                  Select your preferred UPI app and click Proceed to Pay
                </p>

                {showConfirmButton && (
                  <button
                    onClick={handleProceedToPay}
                    className="mt-4 w-full rounded-lg bg-orange-500 px-6 py-2 text-sm text-white transition-colors hover:bg-orange-600"
                  >
                    Proceed to Pay
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-4 sm:mt-6">
                <h3 className="mb-2 text-sm font-semibold text-neutral-300 sm:mb-3">Scan QR Code to Pay</h3>
                <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                  <div className="rounded-lg border border-neutral-700 p-3 bg-white sm:p-4">
                    <QRCodeSVG
                      value={getUPIString()}
                      size={160}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-center text-xs text-neutral-400 sm:text-sm">
                    Scan this QR code with any UPI app on your phone to make the payment
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal; 