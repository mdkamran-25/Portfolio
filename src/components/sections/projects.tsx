'use client';

import Image from "next/image";
import React, { useState } from "react";
import { Project, featuredProjects } from "@/constants/projects";
import { ThemeType, getThemeColors } from "@/constants/theme";
import { RazorpayPayment } from '@/components/RazorpayPayment';
import type { RazorpayResponse, RazorpayError } from '@/types/razorpay';

// Project Card Component
interface ProjectCardProps {
  project: Project;
  theme?: ThemeType;
  onClick: () => void;
}

function ProjectCard({ 
  project,
  theme = 'default',
  onClick
}: ProjectCardProps) {
  const { bgColor } = getThemeColors(theme);

  return (
    <div 
      className={`relative aspect-video overflow-hidden rounded-xl ${bgColor} cursor-pointer transition-all duration-300 p-1`}
      onClick={onClick}
    >
      <div className="relative h-full w-full rounded-lg overflow-hidden">
        <Image 
          src={project.image} 
          alt={project.title} 
          width={800}
          height={450}
          className="h-full w-full object-cover"
          priority
          unoptimized
        />
      </div>
    </div>
  );
}

// Project Details Component
interface ProjectDetailsProps {
  project: Project;
  theme?: ThemeType;
}

function ProjectDetails({ project, theme = 'default' }: ProjectDetailsProps) {
  const { bgColor, tagBgColor, titleColor, borderColor } = getThemeColors(theme);
  const coffeeButtonColor = 'bg-amber-600 hover:bg-amber-700';
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const SUPPORT_AMOUNT = 99; // Fixed amount for project support

  return (
    <div className={`h-full rounded-xl ${bgColor} p-4 sm:p-6`}>
      {/* Project Title and Description */}
      <div className="mb-4">
        <h2 className={`text-xl font-bold ${titleColor} mb-2`}>
          {project.title}
        </h2>
        <p className="text-neutral-300">
          {project.description}
        </p>
      </div>

      {/* Tech Stack */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          Tech Stack
        </h3>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((item, index) => (
            <span 
              key={index}
              className={`rounded-full ${tagBgColor} px-2 py-1 text-xs text-neutral-300`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Project Links */}
      <div className="mb-6">
        {/* <h3 className="text-lg font-semibold text-white mb-2">
          Project Links
        </h3> */}
        <div className="flex flex-col gap-2">
          {/* <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block rounded-full bg-neutral-800 hover:bg-neutral-700 px-4 py-2 text-sm text-white transition-colors text-center`}
          >
            Source Code
          </a> */}
          <a
            href={project.demoLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block rounded-full bg-neutral-800 hover:bg-neutral-700 px-4 py-2 text-sm text-white transition-colors text-center`}
          >
            Live Demo
          </a>
        </div>
      </div>

      {/* Support Section */}
      <div className={`border-t ${borderColor} pt-4`}>
        <h3 className="text-lg font-semibold text-white mb-2">
          Support This Project
        </h3>
        <div className="flex flex-col gap-3">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block rounded-full bg-neutral-800 hover:bg-neutral-700 px-4 py-2 text-sm text-white transition-colors text-center`}
          >
            Use This Source Code For Free
          </a>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className={`inline-block rounded-full ${coffeeButtonColor} px-4 py-2 text-sm text-white transition-colors text-center flex items-center justify-center gap-2`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
            Buy Me A Coffee
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <RazorpayPayment 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)}
        amount={SUPPORT_AMOUNT}
        onSuccess={(response: RazorpayResponse) => {
          console.log('Payment successful:', response);
          setIsPaymentModalOpen(false);
        }}
        onError={(error: RazorpayError) => {
          console.error('Payment failed:', error);
        }}
      />
    </div>
  );
}

// Main Projects Component
interface ProjectsProps {
  title?: string;
  theme?: ThemeType;
  projects?: Project[];
}

export default function Projects({ 
  title = "Featured Projects ...", 
  theme = 'default',
  projects: customProjects
}: ProjectsProps) {
  const projects = customProjects || featuredProjects;
  const { titleColor } = getThemeColors(theme);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Section Title */}
      <h1 className={`text-xl font-bold ${titleColor} sm:text-2xl`}>
        {title}
      </h1>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Project Selection */}
        <div className="lg:col-span-1">
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project, index) => (
              <ProjectCard 
                key={index} 
                project={project}
                theme={theme}
                onClick={() => setSelectedProjectIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Project Details Panel */}
        <div className="lg:col-span-2">
          <ProjectDetails 
            project={projects[selectedProjectIndex]} 
            theme={theme}
          />
        </div>
      </div>

      {/* View All Projects Link */}
      <div className="flex justify-center">
        <a
          href="https://spring-mars-7c5.notion.site/Welcome-1868ac9f1d858023a5ddf222dacf5051"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-neutral-800/50 px-4 py-1.5 text-xs text-orange-500 transition-colors hover:bg-neutral-700/50 sm:px-6 sm:py-2 sm:text-sm"
        >
          View All Projects
        </a>
      </div>
    </div>
  );
}
