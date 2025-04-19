"use client";
import React from 'react';
// These imports will be used in future updates
// import Image from 'next/image';
// import { ArrowRight } from 'lucide-react';
// import Link from 'next/link';
import Profile from "@/components/sections/profile";
import Projects from "@/components/sections/projects";
import FreelanceProjects from "@/components/sections/freelance-projects";
import Stack from "@/components/sections/stack";
import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
        {/* First row: Profile and Stack side by side */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <div className="rounded-2xl bg-neutral-900/50 p-4 sm:p-6">
            <Profile />
          </div>
          <div className="rounded-2xl bg-neutral-900/50 p-4 sm:p-6">
            <Stack />
          </div>
        </div>

        {/* Second row: Projects */}
        <div className="rounded-2xl bg-neutral-900/50 p-4 sm:p-6">
          <FreelanceProjects theme="default" title="$ Freelance" />
        </div>
        <div className="rounded-2xl bg-neutral-900/50 p-4 sm:p-6">
          <Projects theme="alternative" title="Featured Projects ..." />
        </div>
      </div>
    </MainLayout>
  );
}
