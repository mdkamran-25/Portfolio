"use client";
import React from "react";

// These imports will be used in future updates
// import Image from 'next/image';
// import { ArrowRight } from 'lucide-react';
// import Link from 'next/link';
import MainLayout from "@/components/layout/MainLayout";
import FreelanceProjects from "@/components/sections/freelance-projects";
import Profile from "@/components/sections/profile";
import Projects from "@/components/sections/projects";
import Stack from "@/components/sections/stack";
import SupportWork from "@/components/sections/support-work";

export default function Home() {
  return (
    <MainLayout>
      <main id="main-content" className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
        {/* First row: Profile and Stack side by side */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <div className="bg-neutral-900/50 rounded-2xl p-4 sm:p-6">
            <Profile />
          </div>
          <div className="bg-neutral-900/50 rounded-2xl p-4 sm:p-6">
            <Stack />
          </div>
        </div>

        {/* Second row: Projects */}
        <div className="bg-neutral-900/50 rounded-2xl p-4 sm:p-6">
          <FreelanceProjects theme="default" title="$ Freelance" />
        </div>
        <div className="bg-neutral-900/50 rounded-2xl p-4 sm:p-6">
          <Projects theme="alternative" title="Featured Projects ..." />
        </div>

        {/* Support Work Section */}
        <div className="bg-neutral-900/50 rounded-2xl p-4 sm:p-6">
          <SupportWork />
        </div>
      </main>
    </MainLayout>
  );
}
