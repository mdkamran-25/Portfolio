import Image, { StaticImageData } from "next/image";
import React from "react";
import Project from "../../../public/project.png";
import KrmagsLight from "../../../public/krmagsLight.png";
import KrmagsDark from "../../../public/KrmagsDark.png";

interface ProjectCardProps {
  image: StaticImageData;
  title: string;
  description: string;
  tech: string[];
  link: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ image, title, description, tech, link }) => {
  return (
    <div className="group relative aspect-video overflow-hidden rounded-xl bg-neutral-800/50">
      <div className="relative h-full w-full">
        <Image 
          src={image} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
        {/* Overlay with content */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-4 opacity-0 backdrop-blur-sm transition-all duration-500 ease-in-out group-hover:opacity-100">
          <div className="space-y-3 text-center">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-neutral-300">{description}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {tech.map((item, index) => (
                <span 
                  key={index}
                  className="rounded-full bg-neutral-700/50 px-2 py-1 text-xs text-neutral-300"
                >
                  {item}
                </span>
              ))}
            </div>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-neutral-700/50 px-4 py-1 text-sm text-white transition-colors hover:bg-neutral-600/50"
            >
              View Project
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Projects() {
  const projects = [
    {
      image: Project,
      title: "Portfolio Website",
      description: "A modern portfolio website built with Next.js and Tailwind CSS",
      tech: ["Next.js", "React", "Tailwind CSS"],
      link: "https://github.com/yourusername/project1"
    },
    {
      image: KrmagsLight,
      title: "E-commerce Platform",
      description: "Full-featured e-commerce platform with cart and checkout functionality",
      tech: ["React", "Node.js", "MongoDB"],
      link: "https://github.com/yourusername/project2"
    },
    {
      image: KrmagsDark,
      title: "Task Management App",
      description: "Collaborative task management application with real-time updates",
      tech: ["TypeScript", "Firebase", "Material-UI"],
      link: "https://github.com/yourusername/project3"
    }
  ];

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <h1 className="text-xl font-bold text-orange-500 sm:text-2xl">
        Recent Front-end Projects
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>

      <div className="flex justify-center">
        <a
          href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-neutral-800/50 px-4 py-1.5 text-xs text-white transition-colors hover:bg-neutral-700/50 sm:px-6 sm:py-2 sm:text-sm"
        >
          View All Projects
        </a>
      </div>
    </div>
  );
}
