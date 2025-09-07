"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Project, featuredProjects } from "@/constants/projects";
import { ThemeType, getThemeColors } from "@/constants/theme";

// Project Card Component
interface ProjectCardProps {
  project: Project;
  theme?: ThemeType;
  onClick: () => void;
}

function ProjectCard({ project, theme = "default", onClick }: ProjectCardProps) {
  const { bgColor } = getThemeColors(theme);

  return (
    <div
      className={`relative aspect-video overflow-hidden rounded-xl ${bgColor} cursor-pointer p-1 transition-all duration-300`}
      onClick={onClick}
    >
      <div className="relative h-full w-full overflow-hidden rounded-lg">
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

function ProjectDetails({ project, theme = "default" }: ProjectDetailsProps) {
  const { bgColor, tagBgColor, titleColor } = getThemeColors(theme);

  return (
    <div className={`h-full rounded-xl ${bgColor} p-4 sm:p-6`}>
      {/* Project Title and Description */}
      <div className="mb-4">
        <h2 className={`text-xl font-bold ${titleColor} mb-2`}>{project.title}</h2>
        <p className="text-neutral-300">{project.description}</p>
      </div>

      {/* Tech Stack */}
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold text-white">Tech Stack</h3>
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
        <div className="flex flex-col gap-2">
          <a
            href={project.demoLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block rounded-full bg-neutral-800 px-4 py-2 text-center text-sm text-white transition-colors hover:bg-neutral-700`}
          >
            Live Demo
          </a>
        </div>
      </div>

      {/* Support Section */}
      <div className="pt-0">
        <div className="flex flex-col gap-3">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block rounded-full bg-neutral-800 px-4 py-2 text-center text-sm text-white transition-colors hover:bg-neutral-700`}
          >
            Use This Source Code For Free
          </a>
        </div>
      </div>
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
  theme = "default",
  projects: customProjects,
}: ProjectsProps) {
  const projects = customProjects || featuredProjects;
  const { titleColor } = getThemeColors(theme);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Section Title */}
      <h1 className={`text-xl font-bold ${titleColor} sm:text-2xl`}>{title}</h1>

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
          <ProjectDetails project={projects[selectedProjectIndex]} theme={theme} />
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
