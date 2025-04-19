'use client';

import React, { useState } from 'react';
import { Coffee } from 'lucide-react';
import DonationModal from '../DonationModal';

const Freelance = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-neutral-900/50 p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Support My Work
            </h2>
            <p className="mb-8 max-w-2xl text-lg text-neutral-400">
              If you appreciate my work and would like to support me, consider buying me a coffee!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="group flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-white transition-colors hover:bg-orange-600"
            >
              <Coffee className="h-5 w-5" />
              <span>Buy Me A Coffee</span>
            </button>
          </div>
        </div>
      </div>

      <DonationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default Freelance; 