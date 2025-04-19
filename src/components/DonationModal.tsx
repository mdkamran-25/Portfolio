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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
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
          const transactionId = `TR${Date.now()}`;
          setPaymentId(transactionId);
          const paymentUrl = app.url(UPI_ID, RECIPIENT_NAME, amount, message);

          const newWindow = window.open('', '_blank');
          if (newWindow) {
            setPaymentWindow(newWindow);
            newWindow.location.href = paymentUrl;

            const checkWindow = setInterval(() => {
              if (newWindow.closed) {
                clearInterval(checkWindow);
                setPaymentWindow(null);
                setIsCheckingPayment(true);
                verifyPayment(transactionId);
              }
            }, 1000);
          } else {
            window.location.href = paymentUrl;

            setTimeout(() => {
              if (!document.hidden) {
                alert('No UPI app found. Please install a UPI payment app or try scanning the QR code.');
              }
            }, 3000);
          }
        } catch (error) {
          console.error('Error initiating payment:', error);
        }
      }
    }
  };

  const verifyPayment = (transactionId: string) => {
    // Dummy verification logic — Replace with actual API call
    setTimeout(() => {
      alert(`Payment ${transactionId} verification complete!`);
      setIsCheckingPayment(false);
    }, 3000);
  };

  return null; // You can replace this with the actual JSX of the modal
};

export default DonationModal;
