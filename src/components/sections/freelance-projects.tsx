import Image from "next/image";
import React, { useState } from "react";
import { FreelanceProject, freelanceProjects } from "@/constants/projects";
import { ThemeType, getThemeColors } from "@/constants/theme";

interface ProjectCardProps {
  project: FreelanceProject;
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
            <h3 className={`text-base sm:text-lg font-semibold text-white ${project.title === "Task Management App" ? "group-hover:text-white" : "group-hover:text-black"}`}>{project.title}</h3>
            <p className={`text-xs sm:text-sm text-neutral-300 ${project.title === "Task Management App" ? "group-hover:text-white" : "group-hover:text-black"}`}>{project.description}</p>
            <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
              {project.tech.map((item, index) => (
                <span 
                  key={index}
                  className={`rounded-full ${tagBgColor} px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs text-neutral-300 ${project.title === "Task Management App" ? "group-hover:text-white" : "group-hover:text-black"}`}
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

interface FreelanceProjectDetailsProps {
  project: FreelanceProject;
  theme?: ThemeType;
}

const FreelanceProjectDetails: React.FC<FreelanceProjectDetailsProps> = ({ project, theme = 'default' }) => {
  const { bgColor, tagBgColor, buttonBgColor, titleColor, borderColor } = getThemeColors(theme);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-neutral-600'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className={`h-full rounded-xl ${bgColor} p-4 sm:p-6`}>
      <div className="mb-4">
        <h2 className={`text-xl font-bold ${titleColor} mb-2`}>{project.title}</h2>
        <p className="text-neutral-300">{project.description}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Client Details</h3>
        <div className="space-y-2">
          <p className="text-neutral-300"><span className="font-medium">Client:</span> {project.client}</p>
          <p className="text-neutral-300"><span className="font-medium">Role:</span> {project.role}</p>
          <p className="text-neutral-300"><span className="font-medium">Duration:</span> {project.duration}</p>
        </div>
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
        <h3 className="text-lg font-semibold text-white mb-2">Client Review</h3>
        {project.review ? (
          <div className="space-y-3">
            <div className="flex items-center gap-1">
              {renderStars(project.review.rating)}
            </div>
            <p className="text-neutral-300 italic">"{project.review.comment}"</p>
            <div className="text-sm text-neutral-400">
              <p className="font-medium text-white">{project.review.reviewer}</p>
              <p>{project.review.position}</p>
            </div>
          </div>
        ) : (
          <p className="text-neutral-400">No review available for this project.</p>
        )}
      </div>
    </div>
  );
};

interface FreelanceProjectsProps {
  title?: string;
  theme?: ThemeType;
  projects?: FreelanceProject[];
}

export default function FreelanceProjects({ 
  title = "$ Freelance", 
  theme = 'default',
  projects: customProjects
}: FreelanceProjectsProps) {
  const projects = customProjects || freelanceProjects;
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
          <FreelanceProjectDetails 
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