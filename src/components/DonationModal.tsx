'use client';

import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Smartphone, MessageSquare, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UPI_APPS = [
  { 
    name: 'Google Pay', 
    scheme: 'gpay',
    url: (upiId: string, name: string, amount: number, message?: string) => {
      const params = new URLSearchParams();
      params.append('pa', upiId);
      params.append('pn', name);
      params.append('am', amount.toString());
      params.append('cu', 'INR');
      params.append('tn', message || 'Support My Work');
      params.append('mc', '0000');
      params.append('tr', `TR${Date.now()}`);
      return `upi://pay?${params.toString()}`;
    }
  },
  { 
    name: 'PhonePe', 
    scheme: 'phonepe',
    url: (upiId: string, name: string, amount: number, message?: string) => {
      const params = new URLSearchParams();
      params.append('pa', upiId);
      params.append('pn', name);
      params.append('am', amount.toString());
      params.append('cu', 'INR');
      params.append('tn', message || 'Support My Work');
      params.append('mc', '0000');
      params.append('tr', `TR${Date.now()}`);
      return `upi://pay?${params.toString()}`;
    }
  },
  { 
    name: 'Paytm', 
    scheme: 'paytm',
    url: (upiId: string, name: string, amount: number, message?: string) => {
      const params = new URLSearchParams();
      params.append('pa', upiId);
      params.append('pn', name);
      params.append('am', amount.toString());
      params.append('cu', 'INR');
      params.append('tn', message || 'Support My Work');
      params.append('mc', '0000');
      params.append('tr', `TR${Date.now()}`);
      return `upi://pay?${params.toString()}`;
    }
  },
  { 
    name: 'Amazon Pay', 
    scheme: 'amazon',
    url: (upiId: string, name: string, amount: number, message?: string) => {
      const params = new URLSearchParams();
      params.append('pa', upiId);
      params.append('pn', name);
      params.append('am', amount.toString());
      params.append('cu', 'INR');
      params.append('tn', message || 'Support My Work');
      params.append('mc', '0000');
      params.append('tr', `TR${Date.now()}`);
      return `upi://pay?${params.toString()}`;
    }
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
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [paymentWindow, setPaymentWindow] = useState<Window | null>(null);

  useEffect(() => {
    const checkDeviceType = () => {
      const userAgent = navigator.userAgent;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTablet = /iPad|Android/i.test(userAgent) && !/Mobile/i.test(userAgent);
      
      if (isMobile) {
        setDeviceType('mobile');
      } else if (isTablet) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);
    return () => window.removeEventListener('resize', checkDeviceType);
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

  const verifyPayment = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/verify-payment?paymentId=${paymentId}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setIsPaymentSuccessful(true);
        setPaymentStatus('success');
        setIsCheckingPayment(false);
      } else if (data.status === 'failed') {
        setPaymentStatus('failed');
        setIsCheckingPayment(false);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setIsCheckingPayment(false);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (paymentId && isCheckingPayment) {
      intervalId = setInterval(() => {
        verifyPayment(paymentId);
      }, 5000); // Check every 5 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [paymentId, isCheckingPayment]);

  const handleProceedToPay = () => {
    const amount = isCustom ? parseInt(customAmount) : selectedAmount;
    if (amount && amount > 0 && selectedApp) {
      const app = UPI_APPS.find(a => a.scheme === selectedApp);
      if (app) {
        try {
          const transactionId = `TR${Date.now()}`;
          setPaymentId(transactionId);
          const paymentUrl = app.url(UPI_ID, RECIPIENT_NAME, amount, message);
          
          // Try to open payment in a new window
          const newWindow = window.open('', '_blank');
          if (newWindow) {
            setPaymentWindow(newWindow);
            newWindow.location.href = paymentUrl;
            
            // Check if window is closed (payment completed or failed)
            const checkWindow = setInterval(() => {
              if (newWindow.closed) {
                clearInterval(checkWindow);
                setPaymentWindow(null);
                setIsCheckingPayment(true);
                // Start payment verification with the transaction ID
                verifyPayment(transactionId);
              }
            }, 1000);
          } else {
            // If popup is blocked, try direct navigation
            window.location.href = paymentUrl;
            
            // Add fallback for UPI app not installed
            setTimeout(() => {
              if (!document.hidden) {
                alert('No UPI app found. Please install a UPI payment app or try scanning the QR code.');
              }
            }, 2000);
          }
          
          setShowConfirmButton(true);
        } catch (error) {
          console.error('Error generating payment URL:', error);
          alert('Error initiating payment. Please try again or use the QR code.');
        }
      }
    }
  };

  // Add cleanup for payment window
  useEffect(() => {
    return () => {
      if (paymentWindow && !paymentWindow.closed) {
        paymentWindow.close();
      }
    };
  }, [paymentWindow]);

  const getUPIString = () => {
    const amount = isCustom ? parseInt(customAmount) : selectedAmount;
    const params = new URLSearchParams();
    params.append('pa', UPI_ID);
    params.append('pn', RECIPIENT_NAME);
    if (amount && amount > 0) {
      params.append('am', amount.toString());
    }
    params.append('cu', 'INR');
    params.append('tn', message || 'Support My Work');
    params.append('mc', '0000');
    params.append('tr', `TR${Date.now()}`);
    return `upi://pay?${params.toString()}`;
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
          {isPaymentSuccessful ? (
            <div className="flex flex-col items-center space-y-6 py-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-24 w-24 animate-ping rounded-full bg-orange-500/20"></div>
                </div>
                <CheckCircle2 className="h-24 w-24 text-orange-500" />
              </div>
              
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
                <p className="text-neutral-400">
                  Thank you for your support. Your contribution means a lot to me.
                </p>
              </div>

              <div className="w-full space-y-4">
                <div className="rounded-lg border border-neutral-700 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-neutral-300">Payment Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Amount</span>
                      <span className="font-medium text-white">
                        ₹{isCustom ? customAmount : selectedAmount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Payment Method</span>
                      <span className="font-medium text-white">
                        {selectedApp ? UPI_APPS.find(app => app.scheme === selectedApp)?.name : 'UPI QR Code'}
                      </span>
                    </div>
                    {message && (
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Message</span>
                        <span className="font-medium text-white">{message}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full rounded-lg bg-orange-500 px-6 py-3 text-white transition-colors hover:bg-orange-600"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
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

                {(deviceType === 'mobile' || deviceType === 'tablet') && (
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
                  </div>
                )}

                {(deviceType === 'desktop' || deviceType === 'tablet') && (selectedAmount || isCustom) && (
                  <div className="mt-4 sm:mt-6">
                    <h3 className="mb-2 text-sm font-semibold text-neutral-300 sm:mb-3">Scan QR Code to Pay</h3>
                    <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                      <div className="rounded-lg border border-neutral-700 p-3 bg-white sm:p-4">
                        <QRCodeSVG
                          value={getUPIString()}
                          size={deviceType === 'tablet' ? 200 : 160}
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                      <p className="text-center text-xs text-neutral-400 sm:text-sm">
                        {deviceType === 'tablet' 
                          ? 'You can either scan this QR code or select a payment app above'
                          : 'Scan this QR code with any UPI app on your phone to make the payment'}
                      </p>
                      {showConfirmButton && (
                        <button
                          onClick={handleProceedToPay}
                          className="mt-4 rounded-lg bg-orange-500 px-6 py-2 text-sm text-white transition-colors hover:bg-orange-600"
                        >
                          Completed the Payment
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {deviceType === 'tablet' && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-neutral-400">
                      Choose your preferred payment method above
                    </p>
                  </div>
                )}
              </div>

              {(deviceType === 'mobile' || deviceType === 'tablet') && showConfirmButton && (
                <button
                  onClick={handleProceedToPay}
                  className="mt-4 w-full rounded-lg bg-orange-500 px-6 py-2 text-sm text-white transition-colors hover:bg-orange-600"
                >
                  Completed the Payment
                </button>
              )}

              {isCheckingPayment && (
                <div className="mt-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="mt-2 text-sm text-neutral-400">Verifying payment status...</p>
                  <button
                    onClick={() => {
                      setIsCheckingPayment(false);
                      setPaymentStatus('pending');
                    }}
                    className="mt-2 text-sm text-orange-500 hover:text-orange-600"
                  >
                    Cancel Verification
                  </button>
                </div>
              )}

              {paymentStatus === 'failed' && (
                <div className="mt-4 text-center">
                  <p className="text-red-500">Payment verification failed. Please try again.</p>
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => {
                        setPaymentStatus('pending');
                        setIsCheckingPayment(false);
                      }}
                      className="text-sm text-orange-500 hover:text-orange-600"
                    >
                      Retry Payment
                    </button>
                    <button
                      onClick={() => {
                        setPaymentStatus('pending');
                        setIsCheckingPayment(false);
                        setSelectedApp(null);
                      }}
                      className="text-sm text-neutral-400 hover:text-neutral-300"
                    >
                      Try Different App
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationModal; 
