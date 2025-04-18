import React, { useState } from 'react';
import Link from 'next/link';
import { UilMapMarker } from '@iconscout/react-unicons';

const Footer: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const copyToClipboard = async (text: string, type: 'email' | 'phone') => {
    try {
      // Try using the modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      // Update UI state
      if (type === 'email') {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Show a fallback message to the user
      alert('Please copy manually: ' + text);
    }
  };

  return (
    <footer className="w-full pt-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl bg-neutral-900/50 p-4 sm:p-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              {/* Company Info */}
              <div className="flex flex-col space-y-4">
                <h3 className="text-xl font-bold text-orange-500">Kamran</h3>
                <p className="text-sm text-neutral-400">
                  Full-stack developer specializing in creating beautiful, functional web applications.
                </p>
                <div className="flex space-x-4">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-orange-500">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-orange-500">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-orange-500">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="flex flex-col space-y-4">
                <h3 className="text-lg font-semibold text-white">Quick Links</h3>
                <ul className="flex flex-col space-y-2">
                  <li>
                    <Link href="/" className="text-neutral-400 hover:text-orange-500 transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-neutral-400 hover:text-orange-500 transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/projects" className="text-neutral-400 hover:text-orange-500 transition-colors">
                      Projects
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-neutral-400 hover:text-orange-500 transition-colors">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div className="flex flex-col space-y-4">
                <h3 className="text-lg font-semibold text-white">Legal</h3>
                <ul className="flex flex-col space-y-2">
                  <li>
                    <Link href="/privacy-policy" className="text-neutral-400 hover:text-orange-500 transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-conditions" className="text-neutral-400 hover:text-orange-500 transition-colors">
                      Terms and Conditions
                    </Link>
                  </li>
                  <li>
                    <Link href="/cancellation-and-refund" className="text-neutral-400 hover:text-orange-500 transition-colors">
                      Cancellation and Refund
                    </Link>
                  </li>
                  <li>
                    <Link href="/shipping-and-delivery" className="text-neutral-400 hover:text-orange-500 transition-colors">
                      Shipping and Delivery
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div className="flex flex-col space-y-4">
                <h3 className="text-lg font-semibold text-white">Contact Us</h3>
                <ul className="flex flex-col space-y-3">
                  <li className="flex items-start space-x-4">
                    <UilMapMarker className="h-6 w-6 text-orange-500" />
                    <span className="text-neutral-400 text-sm sm:text-base">
                      CGEWHO Kendriya Vihar Greater Noida D2-902 ( Plot No.7, Sector P-4, Phi-2, Builders Area, Near Unitech Heights, Greater Noida, Uttar Pradesh 201310 )
                    </span>
                  </li>
                  <li className="flex items-start justify-between space-x-2 sm:space-x-3">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <svg className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href="mailto:webhost01001@gmail.com" className="text-neutral-400 hover:text-orange-500 transition-colors text-xs sm:text-sm md:text-base break-all">
                        webhost01001@gmail.com
                      </a>
                    </div>
                    <button
                      onClick={() => copyToClipboard('webhost01001@gmail.com', 'email')}
                      className="ml-2 text-neutral-400 hover:text-orange-500 transition-colors"
                      title="Copy email"
                    >
                      {copiedEmail ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      )}
                    </button>
                  </li>
                  <li className="flex items-start justify-between space-x-2 sm:space-x-3">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <svg className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      <a href="tel:+917366972054" className="text-neutral-400 hover:text-orange-500 transition-colors text-xs sm:text-sm md:text-base">
                        +91 7366972054
                      </a>
                    </div>
                    <button
                      onClick={() => copyToClipboard('+917366972054', 'phone')}
                      className="ml-2 text-neutral-400 hover:text-orange-500 transition-colors"
                      title="Copy phone number"
                    >
                      {copiedPhone ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      )}
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-12 border-t border-neutral-800 pt-8">
              <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                <p className="text-sm text-neutral-500">
                  © {new Date().getFullYear()} Kamran. All rights reserved.
                </p>
                <div className="flex space-x-6">
                  <Link href="/privacy-policy" className="text-sm text-neutral-500 hover:text-orange-500 transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms-conditions" className="text-sm text-neutral-500 hover:text-orange-500 transition-colors">
                    Terms
                  </Link>
                  <Link href="/contact" className="text-sm text-neutral-500 hover:text-orange-500 transition-colors">
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 