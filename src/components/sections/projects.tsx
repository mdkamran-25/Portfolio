'use client';

import Image from "next/image";
import { useState } from "react";
import { Project, featuredProjects } from "@/constants/projects";
import { ThemeType, getThemeColors } from "@/constants/theme";

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
  const { bgColor, overlayColor, tagBgColor } = getThemeColors(theme);

  return (
    <div 
      className={`group relative aspect-video overflow-hidden rounded-xl ${bgColor} cursor-pointer transition-all duration-300 p-1`}
      onClick={onClick}
    >
      <div className="relative h-full w-full rounded-lg overflow-hidden">
        <Image 
          src={project.image} 
          alt={project.title} 
          width={800}
          height={450}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          priority
          unoptimized
        />
        {/* Overlay with content */}
        <div className={`absolute inset-0 flex items-center justify-center ${overlayColor} p-2 sm:p-4 opacity-0 backdrop-blur-sm transition-all duration-500 ease-in-out group-hover:opacity-100`}>
          <div className="space-y-2 sm:space-y-3 text-center max-h-full overflow-y-auto">
            <h3 className="text-base sm:text-lg font-semibold text-white">{project.title}</h3>
            <p className="text-xs sm:text-sm text-neutral-300">{project.description}</p>
            <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
              {project.tech.map((item, index) => (
                <span 
                  key={index}
                  className={`rounded-full ${tagBgColor} px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs text-neutral-300`}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProjectDetailsProps {
  project: Project;
  theme?: ThemeType;
}

function ProjectDetails({ project, theme = 'default' }: ProjectDetailsProps) {
  const { bgColor, tagBgColor, titleColor, borderColor } = getThemeColors(theme);
  const coffeeButtonColor = 'bg-amber-600 hover:bg-amber-700';

  return (
    <div className={`h-full rounded-xl ${bgColor} p-4 sm:p-6`}>
      <div className="mb-4">
        <h2 className={`text-xl font-bold ${titleColor} mb-2`}>{project.title}</h2>
        <p className="text-neutral-300">{project.description}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Tech Stack</h3>
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

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Project Links</h3>
        <div className="flex flex-col gap-2">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block rounded-full bg-neutral-800 hover:bg-neutral-700 px-4 py-2 text-sm text-white transition-colors text-center`}
          >
            Source Code
          </a>
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

      <div className={`border-t ${borderColor} pt-4`}>
        <h3 className="text-lg font-semibold text-white mb-2">Support This Project</h3>
        <div className="flex flex-col gap-3">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block rounded-full bg-neutral-800 hover:bg-neutral-700 px-4 py-2 text-sm text-white transition-colors text-center`}
          >
            Use This Source Code For Free
          </a>
          <a
            href="https://www.buymeacoffee.com/mdkamran"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block rounded-full ${coffeeButtonColor} px-4 py-2 text-sm text-white transition-colors text-center flex items-center justify-center gap-2`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
            Buy Me A Coffee
          </a>
        </div>
      </div>
    </div>
  );
}

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
      <h1 className={`text-xl font-bold ${titleColor} sm:text-2xl`}>
        {title}
      </h1>

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
