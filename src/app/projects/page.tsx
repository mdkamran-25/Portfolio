'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Project, featuredProjects } from '@/constants/projects';
// These will be used for future theme customization
// import { ThemeType, getThemeColors } from '@/constants/theme';
import { RazorpayPayment } from '@/components/RazorpayPayment';
import type { RazorpayResponse, RazorpayError } from '@/types/razorpay';
import MainLayout from '@/components/layout/MainLayout';

const ProjectsPage = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const SUPPORT_AMOUNT = 99; // Fixed amount for project support

  const handlePaymentSuccess = (response: RazorpayResponse) => {
    console.log('Payment successful:', response);
    // Handle successful payment
  };

  const handlePaymentError = (error: RazorpayError) => {
    console.error('Payment failed:', error);
    // Handle payment error
  };

  return (
    <MainLayout>
      <main className="container mx-auto px-4 py-16">
        <h1 className="mb-12 text-4xl font-bold text-white">Projects</h1>

        {/* Projects Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-2xl bg-neutral-800"
            >
              {/* Project Image */}
              <div className="aspect-video overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={800}
                  height={450}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h2 className="mb-2 text-xl font-semibold text-white">
                  {project.title}
                </h2>
                <p className="mb-4 text-neutral-400">{project.description}</p>

                {/* Tech Stack */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-neutral-700 px-3 py-1 text-xs text-neutral-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Project Links */}
                <div className="flex flex-col gap-2">
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-orange-500 px-4 py-2 text-center text-white transition-colors hover:bg-orange-600"
                  >
                    Live Demo
                  </a>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-neutral-700 px-4 py-2 text-center text-neutral-300 transition-colors hover:border-orange-500 hover:text-orange-500"
                  >
                    Source Code
                  </a>
                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setIsPaymentModalOpen(true);
                    }}
                    className="rounded-lg border border-neutral-700 px-4 py-2 text-center text-neutral-300 transition-colors hover:border-orange-500 hover:text-orange-500"
                  >
                    Support Project
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Modal */}
        {selectedProject && (
          <RazorpayPayment
            isOpen={isPaymentModalOpen}
            onClose={() => {
              setIsPaymentModalOpen(false);
              setSelectedProject(null);
            }}
            amount={SUPPORT_AMOUNT}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        )}
      </main>
    </MainLayout>
  );
};

export default ProjectsPage; 