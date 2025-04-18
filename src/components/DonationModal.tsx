import React from 'react';
import Image from 'next/image';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative max-w-md w-full bg-neutral-900 rounded-xl p-4 shadow-xl">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-orange-500 transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Modal content */}
        <div className="mt-2">
          <h3 className="text-xl font-bold text-white mb-4 text-center">Support My Work</h3>
          
          <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
            <Image 
              src="/images/Phonepay.png" 
              alt="PhonePe QR Code" 
              fill
              className="object-contain"
              priority
            />
          </div>
          
          <p className="text-neutral-300 text-center mb-4">
            Scan this QR code with PhonePe to support my work. Thank you for your generosity!
          </p>
          
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal; 